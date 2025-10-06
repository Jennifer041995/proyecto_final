# Estructura de Componentes Angular

Esta documentación describe la nueva estructura organizada de componentes en el proyecto Angular.

## 📁 Estructura de Directorios

```
src/app/
├── core/                           # Funcionalidades centrales
│   ├── services/                   # Servicios globales
│   │   ├── player.service.ts       # Servicio del reproductor de audio
│   │   └── favorites.service.ts     # Servicio de favoritos
│   └── models/                     # Interfaces y tipos
│       └── song.interface.ts       # Interfaz para el modelo Song
├── shared/                        # Componentes reutilizables
│   ├── layout/                    # Componentes de layout
│   │   ├── option-bar/            # Sidebar de navegación
│   │   └── audio-controls/        # Controles globales de audio
│   └── components/                # Componentes UI reutilizables
├── features/                      # Funcionalidades específicas
│   ├── audio-player/              # Vista del reproductor principal
│   ├── library/                   # Vista de biblioteca de música
│   ├── favorites/                 # Vista de canciones favoritas
│   ├── videos/                    # Vista de videos
│   └── select-file/               # Vista de selección de archivos
└── app.ts                         # Componente principal de la aplicación
```

## 🎯 Principios de Organización

### Core (Núcleo)
- **Servicios**: Lógica de negocio compartida
- **Modelos**: Interfaces y tipos TypeScript
- **Funcionalidades**: Que son esenciales para toda la aplicación

### Shared (Compartido)
- **Layout**: Componentes de estructura (sidebar, controles globales)
- **Components**: Componentes UI reutilizables
- **Funcionalidades**: Que se usan en múltiples partes de la aplicación

### Features (Características)
- **Vistas específicas**: Cada funcionalidad tiene su propia carpeta
- **Componentes**: Relacionados con una funcionalidad particular
- **Funcionalidades**: Que representan una característica completa de la aplicación

## 🔧 Componentes por Categoría

### Componentes Globales (Siempre visibles)
- `shared/layout/audio-controls/` - Controles de audio que siempre están disponibles
- `shared/layout/option-bar/` - Sidebar de navegación

### Vistas de Navegación (Accesibles desde sidebar)
- `features/audio-player/` - Reproductor principal
- `features/library/` - Biblioteca de música
- `features/favorites/` - Canciones favoritas
- `features/videos/` - Videos
- `features/select-file/` - Selección de archivos

## 📋 Beneficios de esta Estructura

1. **Mantenibilidad**: Fácil localización de componentes por funcionalidad
2. **Escalabilidad**: Estructura clara para agregar nuevas características
3. **Reutilización**: Componentes compartidos en `shared/`
4. **Separación de responsabilidades**: Core, Shared y Features bien definidos
5. **Tipado fuerte**: Interfaces centralizadas en `core/models/`

## 🚀 Cómo Agregar Nuevos Componentes

### Para un nuevo componente de vista:
```
features/nueva-vista/
├── nueva-vista.ts
├── nueva-vista.html
├── nueva-vista.css
└── nueva-vista.spec.ts
```

### Para un componente reutilizable:
```
shared/components/nuevo-componente/
├── nuevo-componente.ts
├── nuevo-componente.html
├── nuevo-componente.css
└── nuevo-componente.spec.ts
```

### Para un nuevo servicio:
```
core/services/nuevo-servicio.service.ts
```

## 🔄 Imports Actualizados

Todos los imports han sido actualizados para reflejar la nueva estructura:

```typescript
// Antes
import { AudioPlayerComponent } from "./audio-player/audio-player";
import { PlayerService } from './services/player.service';

// Después
import { AudioPlayerComponent } from "./features/audio-player/audio-player";
import { PlayerService } from './core/services/player.service';
```

## 📝 Notas Importantes

- Todos los componentes son **standalone**
- Los servicios están centralizados en `core/services/`
- Las interfaces están en `core/models/`
- La estructura sigue las mejores prácticas de Angular
