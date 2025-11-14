import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CancionService, Cancion } from '../../services/cancion.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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
  private subscription: Subscription = new Subscription();

  constructor(
    private cancionService: CancionService,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cancionForm = this.fb.group({
      artista: ['', [Validators.required, Validators.minLength(2)]],
      genero: ['', [Validators.required]],
      album: ['', [Validators.required]],
      anioLanzamiento: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear())]],
      enlaceDrive: ['', [Validators.required, Validators.pattern(/^https:\/\/drive\.google\.com\/.*/)]]
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

  cargarCanciones(): void {
    const sub = this.cancionService.getCanciones().subscribe({
      next: (canciones) => {
        this.canciones = canciones;
      },
      error: (error) => {
        console.error('Error al cargar canciones:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las canciones'
        });
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
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Canción actualizada correctamente'
            });
            this.cerrarModal();
            this.cancionForm.reset();
          })
          .catch((error) => {
            console.error('Error al actualizar canción:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar la canción'
            });
          });
      } else {
        // Crear
        this.cancionService.crearCancion(cancionData)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Éxito',
              text: 'Canción creada correctamente'
            });
            this.cerrarModal();
            this.cancionForm.reset();
          })
          .catch((error) => {
            console.error('Error al crear canción:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo crear la canción'
            });
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
      Swal.fire({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la canción de ${cancion.artista}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.cancionService.eliminarCancion(cancion.id!)
            .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Eliminado',
                text: 'Canción eliminada correctamente'
              });
            })
            .catch((error) => {
              console.error('Error al eliminar canción:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo eliminar la canción'
              });
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
          return 'Debe ser un enlace válido de Google Drive';
        }
      }
      return '';
    };
  }
}

