import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PlyrService {
  private plyrInstance: any = null;
  private plyrModule: any = null;
  private isPlyrLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  /**
   * Carga el módulo de Plyr dinámicamente
   */
  private async loadPlyr(): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Plyr solo está disponible en el navegador');
    }

    if (this.isPlyrLoaded && this.plyrModule) {
      return this.plyrModule;
    }

    try {
      const PlyrModule = await import('plyr');
      // Manejar diferentes formas de exportación de Plyr
      this.plyrModule = (PlyrModule as any).default || PlyrModule;
      this.isPlyrLoaded = true;
      return this.plyrModule;
    } catch (error) {
      console.error('Error al cargar Plyr:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva instancia de Plyr con la configuración por defecto
   */
  async createInstance(element: HTMLVideoElement | HTMLAudioElement): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    // Destruir instancia anterior si existe
    if (this.plyrInstance) {
      this.destroyInstance();
    }

    try {
      const Plyr = await this.loadPlyr();
      
      this.plyrInstance = new Plyr(element, this.getDefaultConfig());
      
      return this.plyrInstance;
    } catch (error) {
      console.error('Error al crear instancia de Plyr:', error);
      return null;
    }
  }

  /**
   * Crea una instancia de Plyr con configuración personalizada
   */
  async createInstanceWithConfig(
    element: HTMLVideoElement | HTMLAudioElement,
    config?: any
  ): Promise<any> {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    // Destruir instancia anterior si existe
    if (this.plyrInstance) {
      this.destroyInstance();
    }

    try {
      const Plyr = await this.loadPlyr();
      const finalConfig = config ? { ...this.getDefaultConfig(), ...config } : this.getDefaultConfig();
      
      this.plyrInstance = new Plyr(element, finalConfig);
      
      return this.plyrInstance;
    } catch (error) {
      console.error('Error al crear instancia de Plyr:', error);
      return null;
    }
  }

  /**
   * Obtiene la instancia actual de Plyr
   */
  getInstance(): any {
    return this.plyrInstance;
  }

  /**
   * Destruye la instancia actual de Plyr
   */
  destroyInstance(): void {
    if (this.plyrInstance) {
      try {
        this.plyrInstance.destroy();
      } catch (error) {
        console.error('Error al destruir instancia de Plyr:', error);
      }
      this.plyrInstance = null;
    }
  }

  /**
   * Obtiene la configuración por defecto de Plyr
   */
  private getDefaultConfig(): any {
    return {
      controls: [
        'play-large',
        'restart',
        'rewind',
        'play',
        'fast-forward',
        'progress',
        'current-time',
        'duration',
        'mute',
        'volume',
        'settings',
        'pip',
        'airplay',
        'fullscreen'
      ],
      settings: ['speed', 'quality'],
      speed: {
        selected: 1,
        options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]
      }
    };
  }

  /**
   * Verifica si hay una instancia activa de Plyr
   */
  hasInstance(): boolean {
    return this.plyrInstance !== null;
  }
}

