# 🎵 Reproductor de Música Angular

Un reproductor de música moderno y responsivo desarrollado con Angular, que permite reproducir archivos de audio locales y gestionar una biblioteca de música personal.

## ✨ Características

- 🎵 **Reproductor de Audio**: Reproducción de archivos MP3 locales
- 📚 **Biblioteca de Música**: Gestión de canciones y álbumes
- ❤️ **Favoritos**: Sistema de canciones favoritas
- 🎬 **Videos**: Soporte para contenido multimedia
- 📁 **Selección de Archivos**: Carga de archivos desde el sistema
- 📱 **Diseño Responsivo**: Optimizado para móviles y escritorio
- 🎨 **Interfaz Moderna**: UI/UX intuitiva con Font Awesome

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado siguiendo las mejores prácticas de Angular con una estructura modular:

```
src/app/
├── core/                    # Funcionalidades centrales
├── shared/                  # Componentes reutilizables
├── features/                # Funcionalidades específicas
└── docs/                   # Documentación
```

## 📚 Documentación

- 📖 [Estructura de Componentes](docs/ESTRUCTURA.md) - Documentación detallada de la arquitectura
- 🎨 [Diagrama de Estructura](docs/ESTRUCTURA_DIAGRAMA.md) - Visualización de la organización del proyecto

## 🛠️ Tecnologías Utilizadas

- **Angular 20.1.6** - Framework principal
- **TypeScript** - Lenguaje de programación
- **Bootstrap** - Framework CSS para diseño responsivo
- **Font Awesome** - Iconografía
- **RxJS** - Programación reactiva
- **HTML5 Audio API** - Reproducción de audio

## 🚀 Inicio Rápido

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 20.1.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## 📁 Estructura del Proyecto

```
proyecto_final/
├── docs/                           # 📚 Documentación
│   ├── ESTRUCTURA.md               # Arquitectura detallada
│   └── ESTRUCTURA_DIAGRAMA.md      # Diagrama visual
├── src/
│   ├── app/
│   │   ├── core/                   # 🏗️ Funcionalidades centrales
│   │   │   ├── services/           # Servicios globales
│   │   │   └── models/             # Interfaces y tipos
│   │   ├── shared/                 # 🔄 Componentes reutilizables
│   │   │   ├── layout/             # Componentes de layout
│   │   │   └── components/         # Componentes UI
│   │   ├── features/               # ⭐ Funcionalidades
│   │   │   ├── audio-player/       # Reproductor principal
│   │   │   ├── library/            # Biblioteca de música
│   │   │   ├── favorites/          # Canciones favoritas
│   │   │   ├── videos/             # Videos
│   │   │   └── select-file/        # Selección de archivos
│   │   └── app.ts                  # Componente principal
│   └── assets/                     # Recursos estáticos
└── README.md                       # Este archivo
```

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🔗 Recursos Adicionales

Para más información sobre el uso de Angular CLI, incluyendo referencias detalladas de comandos, visita la página [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli).
