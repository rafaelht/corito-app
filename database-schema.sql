-- Esquema de base de datos para la aplicación de eventos
-- Ejecutar este script en el SQL Editor de Supabase

-- Crear tabla de eventos
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location VARCHAR(500) NOT NULL,
  activities TEXT[] DEFAULT '{}',
  max_guests INTEGER,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'cancelled')),
  guests TEXT[] DEFAULT '{}',
  votes JSONB DEFAULT '{"location": {}, "date": {}, "activities": {}}'::jsonb
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at);

-- Habilitar RLS (Row Level Security)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
-- Los usuarios solo pueden ver eventos que han creado
CREATE POLICY "Users can view their own events" ON events
  FOR SELECT USING (auth.uid() = created_by);

-- Los usuarios solo pueden insertar eventos para sí mismos
CREATE POLICY "Users can insert their own events" ON events
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Los usuarios solo pueden actualizar eventos que han creado
CREATE POLICY "Users can update their own events" ON events
  FOR UPDATE USING (auth.uid() = created_by);

-- Los usuarios solo pueden eliminar eventos que han creado
CREATE POLICY "Users can delete their own events" ON events
  FOR DELETE USING (auth.uid() = created_by);

-- Función para actualizar automáticamente updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para actualizar updated_at automáticamente
CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Comentarios sobre la tabla
COMMENT ON TABLE events IS 'Tabla para almacenar eventos/reuniones creados por los usuarios';
COMMENT ON COLUMN events.title IS 'Título del evento';
COMMENT ON COLUMN events.description IS 'Descripción detallada del evento';
COMMENT ON COLUMN events.date IS 'Fecha del evento';
COMMENT ON COLUMN events.time IS 'Hora del evento';
COMMENT ON COLUMN events.location IS 'Ubicación del evento';
COMMENT ON COLUMN events.activities IS 'Array de actividades planificadas';
COMMENT ON COLUMN events.max_guests IS 'Número máximo de invitados permitidos';
COMMENT ON COLUMN events.created_by IS 'ID del usuario que creó el evento';
COMMENT ON COLUMN events.status IS 'Estado del evento: draft, active, cancelled';
COMMENT ON COLUMN events.guests IS 'Array de emails de invitados';
COMMENT ON COLUMN events.votes IS 'JSON con votaciones para ubicación, fecha y actividades';

--
-- Perfiles de Usuario
--
-- Crear tabla para perfiles públicos de usuario
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  website TEXT,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Habilitar RLS para perfiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para perfiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger para crear un perfil automáticamente para nuevos usuarios
-- Esto asegura que cada usuario en 'auth.users' tenga su correspondiente 'profile'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Comentarios sobre la tabla de perfiles
COMMENT ON TABLE profiles IS 'Tabla para almacenar los perfiles públicos de los usuarios.';
COMMENT ON COLUMN profiles.id IS 'Referencia al ID del usuario en auth.users.';

-- Para migrar datos existentes (opcional, ejecutar una sola vez):
-- ALTER TABLE profiles ADD COLUMN first_name TEXT;
-- ALTER TABLE profiles ADD COLUMN last_name TEXT;
-- UPDATE profiles SET first_name = split_part(full_name, ' ', 1), last_name = substring(full_name from position(' ' in full_name) + 1) WHERE full_name IS NOT NULL;
-- ALTER TABLE profiles DROP COLUMN full_name; 