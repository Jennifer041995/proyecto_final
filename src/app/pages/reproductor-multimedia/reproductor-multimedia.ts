import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlyrService } from '../../services/plyr.service';
import { NotificationService } from '../../services/notification.service';

interface ArchivoMultimedia {
  id: string;
  nombre: string;
  archivo: File;
  url: string;
  tipo: 'audio' | 'video';
  duracion?: number;
}

@Component({
  selector: 'app-reproductor-multimedia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reproductor-multimedia.html',
  styleUrl: './reproductor-multimedia.css',
})
export class ReproductorMultimedia implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('reproductorVideo', { static: false }) reproductorVideoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('reproductorAudio', { static: false }) reproductorAudioElement?: ElementRef<HTMLAudioElement>;

  archivos: ArchivoMultimedia[] = [];
  archivoActual: ArchivoMultimedia | null = null;
  modoReproductor: 'video' | 'audio' | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private plyrService: PlyrService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Inicialización
  }

  ngAfterViewInit(): void {
    // Inicialización después de que la vista esté lista
  }

  ngOnDestroy(): void {
    // Destruir instancia de Plyr a través del servicio
    this.plyrService.destroyInstance();
    
    // Limpiar URLs de objetos
    this.archivos.forEach(archivo => {
      if (archivo.url) {
        URL.revokeObjectURL(archivo.url);
      }
    });
  }

  onFileSelected(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const archivosAntes = this.archivos.length;
      this.procesarArchivos(files);
      const archivosAgregados = this.archivos.length - archivosAntes;
      const archivosIgnorados = files.length - archivosAgregados;

      // Mostrar alerta con el servicio de notificaciones
      if (archivosAgregados > 0) {
        this.notificationService.custom({
          icon: 'success',
          title: 'Archivos cargados',
          html: `
            <p>Se cargaron <strong>${archivosAgregados}</strong> archivo${archivosAgregados !== 1 ? 's' : ''} multimedia.</p>
            ${archivosIgnorados > 0 ? `<p class="text-muted">Se ignoraron ${archivosIgnorados} archivo${archivosIgnorados !== 1 ? 's' : ''} que no son multimedia.</p>` : ''}
          `,
          timer: 3000,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar'
        });
      } else {
        this.notificationService.warning('No se encontraron archivos multimedia', 'Los archivos seleccionados no son de audio o video válidos.');
      }
    }
  }

  abrirSelectorCarpeta(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if ('showDirectoryPicker' in window) {
      this.seleccionarCarpetaModerno();
    } else {
      // Fallback: usar input tradicional (mostrará alerta nativa)
      const input = document.getElementById('carpetaInput') as HTMLInputElement;
      if (input) {
        input.click();
      }
    }
  }

  private async seleccionarCarpetaModerno(): Promise<void> {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      const files: File[] = [];

      // Recorrer recursivamente la carpeta
      await this.obtenerArchivosDeCarpeta(directoryHandle, files);

      if (files.length > 0) {
        const nombreCarpeta = directoryHandle.name || 'la carpeta';
        this.mostrarConfirmacionCarpeta(files, nombreCarpeta);
      } else {
        this.notificationService.warning('Carpeta vacía', 'La carpeta seleccionada no contiene archivos.');
      }
    } catch (error: any) {
      // Si el usuario cancela, no hacer nada
      if (error.name !== 'AbortError') {
        console.error('Error al seleccionar carpeta:', error);
        // Fallback al método tradicional
        const input = document.getElementById('carpetaInput') as HTMLInputElement;
        if (input) {
          input.click();
        }
      }
    }
  }

  private async obtenerArchivosDeCarpeta(directoryHandle: any, files: File[]): Promise<void> {
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === 'file') {
        const file = await entry.getFile();
        // Solo agregar archivos multimedia
        if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
          files.push(file);
        }
      } else if (entry.kind === 'directory') {
        // Recursivamente obtener archivos de subcarpetas
        await this.obtenerArchivosDeCarpeta(entry, files);
      }
    }
  }

  private mostrarConfirmacionCarpeta(files: File[], nombreCarpeta: string): void {
    const totalArchivos = files.length;

    this.notificationService.custom({
      title: '¿Deseas cargar los archivos?',
      html: `
        <p>Se encontraron <strong>${totalArchivos}</strong> archivo${totalArchivos !== 1 ? 's' : ''} multimedia en <strong>"${nombreCarpeta}"</strong>.</p>
        <p class="text-muted">Se cargarán únicamente los archivos de audio y video válidos.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, cargar archivos',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarArchivosConfirmados(files);
      }
    });
  }

  onFolderSelected(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      const totalArchivos = files.length;
      
      // Obtener el nombre de la carpeta (del primer archivo)
      const nombreCarpeta = files.length > 0 && files[0].webkitRelativePath 
        ? files[0].webkitRelativePath.split('/')[0] 
        : 'la carpeta';

      // Mostrar confirmación con SweetAlert2 antes de procesar
      this.mostrarConfirmacionCarpeta(files, nombreCarpeta);
    }
  }

  private procesarArchivosConfirmados(files: File[]): void {
    const archivosAntes = this.archivos.length;
    this.procesarArchivos(files);
    const archivosAgregados = this.archivos.length - archivosAntes;
    const archivosIgnorados = files.length - archivosAgregados;

    // Mostrar resultado
    if (archivosAgregados > 0) {
      this.notificationService.custom({
        icon: 'success',
        title: 'Archivos cargados',
        html: `
          <p>Se cargaron <strong>${archivosAgregados}</strong> archivo${archivosAgregados !== 1 ? 's' : ''} multimedia.</p>
          ${archivosIgnorados > 0 ? `<p class="text-muted">Se ignoraron ${archivosIgnorados} archivo${archivosIgnorados !== 1 ? 's' : ''} que no son multimedia.</p>` : ''}
        `,
        timer: 3000,
        showConfirmButton: true,
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.notificationService.warning('No se encontraron archivos multimedia', 'La carpeta seleccionada no contiene archivos de audio o video válidos.');
    }

    // Resetear el input
    const input = document.getElementById('carpetaInput') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  }

  procesarArchivos(files: File[]): void {
    if (!isPlatformBrowser(this.platformId)) return;

    files.forEach(file => {
      // Verificar si es un archivo multimedia
      if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        const url = URL.createObjectURL(file);
        const tipo: 'audio' | 'video' = file.type.startsWith('video/') ? 'video' : 'audio';
        
        const archivoMultimedia: ArchivoMultimedia = {
          id: this.generarId(),
          nombre: file.name,
          archivo: file,
          url: url,
          tipo: tipo
        };

        this.archivos.push(archivoMultimedia);
      }
    });
  }

  generarId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  reproducirArchivo(archivo: ArchivoMultimedia): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Limpiar reproductor anterior a través del servicio
    this.plyrService.destroyInstance();

    this.archivoActual = archivo;
    this.modoReproductor = archivo.tipo;

    // Mostrar el modal
    this.mostrarModal();

    // Esperar a que el modal se muestre y el DOM se actualice
    setTimeout(() => {
      this.inicializarPlyr();
    }, 300);
  }

  inicializarPlyr(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    let elemento: HTMLVideoElement | HTMLAudioElement | null = null;

    if (this.modoReproductor === 'video' && this.reproductorVideoElement) {
      elemento = this.reproductorVideoElement.nativeElement;
    } else if (this.modoReproductor === 'audio' && this.reproductorAudioElement) {
      elemento = this.reproductorAudioElement.nativeElement;
    }

    if (elemento && this.archivoActual) {
      elemento.src = this.archivoActual.url;
      
      // Crear instancia de Plyr a través del servicio
      this.plyrService.createInstance(elemento).then((plyrInstance) => {
        if (plyrInstance) {
          // Cargar el archivo
          elemento!.load();
        }
      }).catch((error) => {
        console.error('Error al inicializar Plyr:', error);
      });
    }
  }

  eliminarArchivo(archivo: ArchivoMultimedia): void {
    // Si es el archivo actual, limpiar el reproductor
    if (this.archivoActual?.id === archivo.id) {
      this.plyrService.destroyInstance();
      this.archivoActual = null;
      this.modoReproductor = null;
    }

    // Revocar URL y eliminar de la lista
    URL.revokeObjectURL(archivo.url);
    this.archivos = this.archivos.filter(a => a.id !== archivo.id);
  }

  limpiarTodos(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Mostrar confirmación con el servicio de notificaciones
    this.notificationService.confirm(
      '¿Estás seguro?',
      `¿Deseas eliminar todos los archivos cargados (${this.archivos.length} archivo${this.archivos.length !== 1 ? 's' : ''})?`,
      'Sí, limpiar todo',
      'Cancelar'
    ).then((result) => {
      if (result.isConfirmed) {
        // Limpiar reproductor a través del servicio
        this.plyrService.destroyInstance();

        // Revocar todas las URLs
        this.archivos.forEach(archivo => {
          URL.revokeObjectURL(archivo.url);
        });

        // Limpiar lista
        this.archivos = [];
        this.archivoActual = null;
        this.modoReproductor = null;

        // Resetear los inputs de archivo para que puedan detectar cambios nuevamente
        const archivoInput = document.getElementById('archivoInput') as HTMLInputElement;
        const carpetaInput = document.getElementById('carpetaInput') as HTMLInputElement;
        
        if (archivoInput) {
          archivoInput.value = '';
        }
        if (carpetaInput) {
          carpetaInput.value = '';
        }

        // Mostrar mensaje de éxito
        this.notificationService.success('Limpiado', 'Todos los archivos han sido eliminados correctamente', 2000);
      }
    });
  }

  obtenerIconoTipo(tipo: 'audio' | 'video'): string {
    return tipo === 'video' ? 'fa-video' : 'fa-music';
  }

  formatearTamano(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  mostrarModal(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const modalElement = document.getElementById('reproductorModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
      
      // Cuando se cierra el modal, limpiar el reproductor
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.cerrarModal();
      }, { once: true });
    }
  }

  cerrarModal(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Destruir instancia de Plyr
    this.plyrService.destroyInstance();

    // Limpiar estado
    this.archivoActual = null;
    this.modoReproductor = null;

    // Cerrar el modal si está abierto
    const modalElement = document.getElementById('reproductorModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
