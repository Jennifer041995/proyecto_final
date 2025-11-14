import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { getDatabase, ref, push, set, remove, onValue, off, DataSnapshot } from 'firebase/database';
import { app } from '../config/firebase-config';
import { Observable } from 'rxjs';

export interface Cancion {
  id?: string;
  artista: string;
  genero: string;
  album: string;
  anioLanzamiento: number;
  enlaceDrive: string;
}

@Injectable({
  providedIn: 'root'
})
export class CancionService {
  private database = getDatabase(app);
  private cancionesRef = ref(this.database, 'canciones');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Asegurar que Firebase solo se use en el cliente
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('CancionService: Firebase solo está disponible en el navegador');
    }
  }

  // Obtener todas las canciones
  getCanciones(): Observable<Cancion[]> {
    return new Observable(observer => {
      onValue(this.cancionesRef, (snapshot: DataSnapshot) => {
        const canciones: Cancion[] = [];
        snapshot.forEach((childSnapshot) => {
          const cancion = {
            id: childSnapshot.key,
            ...childSnapshot.val()
          } as Cancion;
          canciones.push(cancion);
        });
        observer.next(canciones);
      }, (error) => {
        observer.error(error);
      });

      // Retornar función de limpieza
      return () => {
        off(this.cancionesRef);
      };
    });
  }

  // Crear una nueva canción
  crearCancion(cancion: Cancion): Promise<void> {
    const nuevaCancionRef = push(this.cancionesRef);
    return set(nuevaCancionRef, {
      artista: cancion.artista,
      genero: cancion.genero,
      album: cancion.album,
      anioLanzamiento: cancion.anioLanzamiento,
      enlaceDrive: cancion.enlaceDrive
    });
  }

  // Actualizar una canción
  actualizarCancion(id: string, cancion: Cancion): Promise<void> {
    const cancionRef = ref(this.database, `canciones/${id}`);
    return set(cancionRef, {
      artista: cancion.artista,
      genero: cancion.genero,
      album: cancion.album,
      anioLanzamiento: cancion.anioLanzamiento,
      enlaceDrive: cancion.enlaceDrive
    });
  }

  // Eliminar una canción
  eliminarCancion(id: string): Promise<void> {
    const cancionRef = ref(this.database, `canciones/${id}`);
    return remove(cancionRef);
  }
}

