# CORITO

Eventos, coritos, reuniones entre amigos/familiares.

## Prerequisitos

- **Node.js** (versión 18 o superior)
- **Ionic CLI** (`npm install -g @ionic/cli`)
- **Angular CLI** (`npm install -g @angular/cli`)
- **Capacitor CLI** (`npm install -g @capacitor/cli`)

### Para desarrollo móvil:
- **Android Studio** (para Android)
- **Xcode** (para iOS - solo macOS)

## Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd corito-app
```

2. Instala las dependencias:
```bash
npm install
```

## Ejecutar el proyecto

### Desarrollo Web

Para ejecutar el proyecto en el navegador:

```bash
# Servidor de desarrollo
npm start
# o
ionic serve
```

El proyecto estará disponible en `http://localhost:4200`

### Construir para producción

```bash
# Construir para producción
npm run build:prod
```

### Despliegue en Netlify

Para desplegar la aplicación en Netlify:

```bash
# Construir para producción
ionic build --prod
```

Los archivos generados estarán en la carpeta `www/` que puedes subir a Netlify.

### Desarrollo móvil

#### Android

1. **Preparar el proyecto para Android:**
```bash
# Agregar plataforma Android
ionic capacitor add android
```

2. **Sincronizar cambios:**
```bash
# Después de hacer cambios en el código
ionic capacitor sync android
```

3. **Abrir en Android Studio:**
```bash
ionic capacitor open android
```

4. **Ejecutar en dispositivo/emulador:**
```bash
# Desde Android Studio o
ionic capacitor run android
```

#### iOS

1. **Preparar el proyecto para iOS:**
```bash
# Agregar plataforma iOS
ionic capacitor add ios
```

2. **Sincronizar cambios:**
```bash
# Después de hacer cambios en el código
ionic capacitor sync ios
```

3. **Abrir en Xcode:**
```bash
ionic capacitor open ios
```

4. **Ejecutar en dispositivo/simulador:**
```bash
# Desde Xcode o
ionic capacitor run ios
```

## Comandos útiles

```bash
# Construir el proyecto
npm run build

# Ejecutar tests
npm test

# Linting
npm run lint

# Ver cambios en tiempo real
npm run watch

# Sincronizar todas las plataformas
ionic capacitor sync
```

## Estructura del proyecto

```
corito-app/
├── src/                    # Código fuente
│   ├── app/               # Componentes y páginas
│   ├── assets/            # Recursos estáticos
│   └── global.scss        # Estilos globales
├── android/               # Proyecto Android
├── ios/                   # Proyecto iOS
├── www/                   # Build de producción
└── capacitor.config.ts    # Configuración de Capacitor
```

## Tecnologías utilizadas

- **Ionic Framework** - Framework de UI móvil
- **Angular** - Framework de desarrollo
- **Capacitor** - Bridge nativo
- **Supabase** - Backend y autenticación
- **TypeScript** - Lenguaje de programación

## Notas importantes

- Para desarrollo en iOS, necesitas macOS y Xcode
- Para desarrollo en Android, necesitas Android Studio
- Asegúrate de tener los SDKs correspondientes instalados
- Para dispositivos físicos, necesitas habilitar el modo desarrollador
