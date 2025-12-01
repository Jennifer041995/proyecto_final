import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  /**
   * Muestra una alerta de éxito
   */
  success(title: string, text?: string, timer?: number): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      timer: timer || 3000,
      showConfirmButton: !!timer || timer === 0 ? false : true,
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Muestra una alerta de error
   */
  error(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Muestra una alerta de advertencia
   */
  warning(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Muestra una alerta informativa
   */
  info(title: string, text?: string): Promise<SweetAlertResult> {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonText: 'Aceptar'
    });
  }

  /**
   * Muestra una confirmación
   */
  confirm(
    title: string, 
    text?: string, 
    confirmText: string = 'Sí, confirmar', 
    cancelText: string = 'Cancelar'
  ): Promise<SweetAlertResult> {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmText,
      cancelButtonText: cancelText
    });
  }

  /**
   * Muestra una confirmación de eliminación
   */
  confirmDelete(itemName: string, itemType: string = 'elemento'): Promise<SweetAlertResult> {
    return Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar ${itemType} "${itemName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });
  }

  /**
   * Muestra una alerta personalizada
   */
  custom(options: SweetAlertOptions): Promise<SweetAlertResult> {
    return Swal.fire(options);
  }

  /**
   * Muestra una alerta de carga
   */
  loading(title: string = 'Cargando...'): void {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  /**
   * Cierra la alerta actual
   */
  close(): void {
    Swal.close();
  }
}

