import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CancionService, Cancion } from '../../services/cancion.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-canciones',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './canciones.component.html',
  styleUrl: './canciones.component.css'
})
export class CancionesComponent implements OnInit, OnDestroy {
  canciones: Cancion[] = [];
  cancionForm: FormGroup;
  cancionSeleccionada: Cancion | null = null;
  modoEdicion = false;
  cancionReproduciendo: Cancion | null = null;
  urlYoutubeEmbed: SafeResourceUrl | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private cancionService: CancionService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cancionForm = this.fb.group({
      artista: ['', [Validators.required, Validators.minLength(2)]],
      genero: ['', [Validators.required]],
      album: ['', [Validators.required]],
      anioLanzamiento: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      enlaceDrive: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/)]]
    });
  }

  ngOnInit(): void {
    // Solo cargar canciones si estamos en el navegador (no durante SSR)
    if (isPlatformBrowser(this.platformId)) {
      this.cargarCanciones();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  obtenerIdYoutube(url: string): string | null {
    // Formatos soportados:
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // https://youtube.com/embed/VIDEO_ID
    
    let videoId = null;
    
    // Formato: ?v=VIDEO_ID
    const match1 = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
    if (match1) {
      videoId = match1[1];
    }
    
    return videoId;
  }

  obtenerUrlYoutubeEmbed(url: string): SafeResourceUrl | null {
    const videoId = this.obtenerIdYoutube(url);
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    return null;
  }

  abrirReproductor(cancion: Cancion): void {
    this.cancionReproduciendo = cancion;
    this.urlYoutubeEmbed = this.obtenerUrlYoutubeEmbed(cancion.enlaceDrive);
    
    if (!this.urlYoutubeEmbed) {
      this.notificationService.error('Error', 'El enlace de YouTube no es válido');
      return;
    }
    
    // Mostrar el modal
    this.mostrarModalReproductor();
  }

  mostrarModalReproductor(): void {
    const modalElement = document.getElementById('reproductorModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
      
      // Cuando se cierra el modal, limpiar la URL del embed
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.cancionReproduciendo = null;
        this.urlYoutubeEmbed = null;
      }, { once: true });
    }
  }

  cargarCanciones(): void {
    const sub = this.cancionService.getCanciones().subscribe({
      next: (canciones) => {
        this.canciones = canciones;
      },
      error: (error) => {
        console.error('Error al cargar canciones:', error);
        this.notificationService.error('Error', 'No se pudieron cargar las canciones');
      }
    });
    this.subscription.add(sub);
  }

  abrirModalCrear(): void {
    this.modoEdicion = false;
    this.cancionSeleccionada = null;
    this.cancionForm.reset();
    this.mostrarModal();
  }

  abrirModalEditar(cancion: Cancion): void {
    this.modoEdicion = true;
    this.cancionSeleccionada = cancion;
    this.cancionForm.patchValue({
      artista: cancion.artista,
      genero: cancion.genero,
      album: cancion.album,
      anioLanzamiento: cancion.anioLanzamiento,
      enlaceDrive: cancion.enlaceDrive
    });
    this.mostrarModal();
  }

  mostrarModal(): void {
    const modalElement = document.getElementById('cancionModal');
    if (modalElement) {
      const modal = new (window as any).bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  cerrarModal(): void {
    const modalElement = document.getElementById('cancionModal');
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  guardarCancion(): void {
    if (this.cancionForm.valid) {
      const cancionData: Cancion = this.cancionForm.value;

      if (this.modoEdicion && this.cancionSeleccionada?.id) {
        // Actualizar
        this.cancionService.actualizarCancion(this.cancionSeleccionada.id, cancionData)
          .then(() => {
            this.notificationService.success('Éxito', 'Canción actualizada correctamente');
            this.cerrarModal();
            this.cancionForm.reset();
          })
          .catch((error) => {
            console.error('Error al actualizar canción:', error);
            this.notificationService.error('Error', 'No se pudo actualizar la canción');
          });
      } else {
        // Crear
        this.cancionService.crearCancion(cancionData)
          .then(() => {
            this.notificationService.success('Éxito', 'Canción creada correctamente');
            this.cerrarModal();
            this.cancionForm.reset();
          })
          .catch((error) => {
            console.error('Error al crear canción:', error);
            this.notificationService.error('Error', 'No se pudo crear la canción');
          });
      }
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.cancionForm.controls).forEach(key => {
        this.cancionForm.get(key)?.markAsTouched();
      });
    }
  }

  eliminarCancion(cancion: Cancion): void {
    if (cancion.id) {
      this.notificationService.confirm(
        '¿Estás seguro?',
        `¿Deseas eliminar la canción de ${cancion.artista}?`,
        'Sí, eliminar',
        'Cancelar'
      ).then((result) => {
          if (result.isConfirmed) {
            this.cancionService.eliminarCancion(cancion.id!)
              .then(() => {
                this.notificationService.success('Eliminado', 'Canción eliminada correctamente');
              })
              .catch((error) => {
                console.error('Error al eliminar canción:', error);
                this.notificationService.error('Error', 'No se pudo eliminar la canción');
              });
          }
        });
    }
  }

  get campoInvalido() {
    return (campo: string) => {
      const control = this.cancionForm.get(campo);
      return control && control.invalid && control.touched;
    };
  }

  get mensajeError() {
    return (campo: string) => {
      const control = this.cancionForm.get(campo);
      if (control && control.errors && control.touched) {
        if (control.errors['required']) {
          return `${campo.charAt(0).toUpperCase() + campo.slice(1)} es requerido`;
        }
        if (control.errors['minlength']) {
          return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
        }
        if (control.errors['min']) {
          return `El año mínimo es ${control.errors['min'].min}`;
        }
        if (control.errors['max']) {
          return `El año máximo es ${control.errors['max'].max}`;
        }
        if (control.errors['pattern']) {
          return 'Debe ser un enlace válido de YouTube';
        }
      }
      return '';
    };
  }
}

