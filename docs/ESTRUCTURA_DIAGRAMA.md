# Diagrama de Estructura de Componentes

```
📁 src/app/
├── 🏗️ core/                           # Funcionalidades centrales
│   ├── 🔧 services/                   # Servicios globales
│   │   ├── player.service.ts         # 🎵 Servicio del reproductor
│   │   └── favorites.service.ts      # ❤️ Servicio de favoritos
│   └── 📋 models/                    # Interfaces y tipos
│       └── song.interface.ts          # 🎼 Interfaz Song
├── 🔄 shared/                        # Componentes reutilizables
│   ├── 🏛️ layout/                    # Componentes de layout
│   │   ├── option-bar/               # 📱 Sidebar de navegación
│   │   └── audio-controls/          # 🎛️ Controles globales
│   └── 🧩 components/                # Componentes UI reutilizables
├── ⭐ features/                      # Funcionalidades específicas
│   ├── audio-player/                # 🎵 Reproductor principal
│   ├── library/                     # 📚 Biblioteca de música
│   ├── favorites/                   # ❤️ Canciones favoritas
│   ├── videos/                      # 🎬 Videos
│   └── select-file/                 # 📁 Selección de archivos
└── 🚀 app.ts                        # Componente principal
```

## 🔄 Flujo de Navegación

```
┌─────────────────┐    ┌─────────────────┐
│   option-bar    │────│  audio-controls │
│   (sidebar)     │    │  (globales)     │
└─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│            content-area                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐  │
│  │ player  │ │library  │ │favorites│  │
│  └─────────┘ └─────────┘ └─────────┘  │
│  ┌─────────┐ ┌─────────┐              │
│  │ videos  │ │select-  │              │
│  │         │ │ file    │              │
│  └─────────┘ └─────────┘              │
└─────────────────────────────────────────┘
```

## 🎯 Separación de Responsabilidades

### 🏗️ Core (Núcleo)
- **Servicios**: Lógica de negocio compartida
- **Modelos**: Tipos e interfaces TypeScript
- **Funcionalidades**: Esenciales para toda la aplicación

### 🔄 Shared (Compartido)
- **Layout**: Componentes de estructura
- **Components**: Componentes UI reutilizables
- **Funcionalidades**: Usadas en múltiples partes

### ⭐ Features (Características)
- **Vistas específicas**: Una funcionalidad por carpeta
- **Componentes**: Relacionados con una característica
- **Funcionalidades**: Características completas de la app

## 📊 Beneficios

✅ **Mantenibilidad**: Fácil localización de componentes
✅ **Escalabilidad**: Estructura clara para nuevas características  
✅ **Reutilización**: Componentes compartidos organizados
✅ **Separación**: Responsabilidades bien definidas
✅ **Tipado**: Interfaces centralizadas y tipado fuerte
