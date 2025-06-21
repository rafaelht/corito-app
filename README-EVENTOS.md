# Funcionalidad de Eventos - AppCitas

## Descripción
Esta funcionalidad permite a los usuarios crear eventos/reuniones donde pueden:
- Definir título, descripción, fecha, hora y ubicación
- Agregar actividades planificadas
- Establecer límite de invitados
- Guardar como borrador o crear evento activo
- Sistema de votaciones para ubicación, fecha y actividades (futuro)

## Configuración de Base de Datos

### 1. Ejecutar el esquema SQL en Supabase
1. Ve a tu proyecto de Supabase
2. Abre el SQL Editor
3. Copia y pega el contenido del archivo `database-schema.sql`
4. Ejecuta el script

### 2. Verificar la tabla creada
La tabla `events` debe tener las siguientes columnas:
- `id` (UUID, Primary Key)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `date` (DATE, NOT NULL)
- `time` (TIME, NOT NULL)
- `location` (VARCHAR, NOT NULL)
- `activities` (TEXT[])
- `max_guests` (INTEGER)
- `created_by` (UUID, Foreign Key a auth.users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `status` (VARCHAR, 'draft'|'active'|'cancelled')
- `guests` (TEXT[])
- `votes` (JSONB)

## Funcionalidades Implementadas

### 1. Crear Evento
- Formulario completo con validación
- Campos requeridos: título, fecha, hora, ubicación
- Campos opcionales: descripción, máximo de invitados
- Gestión dinámica de actividades (agregar/eliminar)
- Opción de guardar como borrador

### 2. Navegación
- Botón flotante en la página de home
- Navegación entre páginas con botón de regreso
- Validación de usuario autenticado

### 3. Interfaz de Usuario
- Diseño moderno con gradientes
- Formularios responsivos
- Validación en tiempo real
- Mensajes de feedback (toasts)
- Confirmaciones para acciones importantes

## Archivos Creados/Modificados

### Nuevos Archivos:
- `src/app/models/event.interface.ts` - Interfaces TypeScript
- `src/app/services/event.service.ts` - Servicio para operaciones CRUD
- `src/app/create-event/` - Módulo completo para crear eventos
- `database-schema.sql` - Esquema de base de datos
- `README-EVENTOS.md` - Este archivo

### Archivos Modificados:
- `src/app/home/home.page.html` - Agregado botón flotante
- `src/app/home/home.page.ts` - Agregado método de navegación
- `src/app/home/home.page.scss` - Estilos del botón flotante
- `src/app/app-routing.module.ts` - Agregada ruta de create-event

## Uso

### Para el Usuario:
1. Inicia sesión en la aplicación
2. En la página de home, verás un botón flotante (+)
3. Haz clic en el botón para crear un nuevo evento
4. Completa el formulario con los detalles del evento
5. Agrega actividades usando el campo de texto
6. Guarda como borrador o crea el evento

### Para el Desarrollador:
1. Ejecuta el script SQL en Supabase
2. Verifica que las rutas estén correctamente configuradas
3. Prueba la funcionalidad creando un evento
4. Verifica que los datos se guarden en la base de datos

## Próximas Funcionalidades

### Fase 2:
- Lista de eventos creados
- Editar eventos existentes
- Eliminar eventos
- Invitar usuarios por email

### Fase 3:
- Sistema de votaciones
- Notificaciones push
- Compartir eventos
- Calendario integrado

## Notas Técnicas

### Seguridad:
- Row Level Security (RLS) habilitado
- Usuarios solo pueden acceder a sus propios eventos
- Validación en frontend y backend

### Rendimiento:
- Índices creados en columnas importantes
- Lazy loading de componentes
- Optimización de consultas

### Escalabilidad:
- Estructura modular
- Interfaces bien definidas
- Servicios reutilizables 