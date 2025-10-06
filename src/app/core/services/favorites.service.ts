import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favoritesSubject = new BehaviorSubject<any[]>([]);
  public favorites$ = this.favoritesSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedFavorites = localStorage.getItem('favoriteSongs');
      if (savedFavorites) {
        const allSongs = JSON.parse(savedFavorites);
        const favorites = allSongs.filter((song: any) => song.isFavorite);
        this.favoritesSubject.next(favorites);
      }
    }
  }

  toggleFavorite(song: any): void {
    if (isPlatformBrowser(this.platformId)) {
      // Obtener todas las canciones del localStorage
      const savedFavorites = localStorage.getItem('favoriteSongs');
      let allSongs: any[] = [];
      
      if (savedFavorites) {
        allSongs = JSON.parse(savedFavorites);
      }

      // Buscar la canción y cambiar su estado
      const songIndex = allSongs.findIndex(s => 
        s.title === song.title && s.artist === song.artist
      );

      if (songIndex !== -1) {
        allSongs[songIndex].isFavorite = !allSongs[songIndex].isFavorite;
      } else {
        // Si no existe, agregarla
        allSongs.push({ ...song, isFavorite: true });
      }

      // Guardar en localStorage
      localStorage.setItem('favoriteSongs', JSON.stringify(allSongs));

      // Actualizar el subject con las canciones favoritas
      const favorites = allSongs.filter((s: any) => s.isFavorite);
      this.favoritesSubject.next(favorites);
    }
  }

  removeFavorite(song: any): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedFavorites = localStorage.getItem('favoriteSongs');
      if (savedFavorites) {
        const allSongs = JSON.parse(savedFavorites);
        const updatedSongs = allSongs.map((s: any) => {
          if (s.title === song.title && s.artist === song.artist) {
            return { ...s, isFavorite: false };
          }
          return s;
        });
        
        localStorage.setItem('favoriteSongs', JSON.stringify(updatedSongs));
        
        // Actualizar el subject
        const favorites = updatedSongs.filter((s: any) => s.isFavorite);
        this.favoritesSubject.next(favorites);
      }
    }
  }

  getFavoriteSongs(): any[] {
    return this.favoritesSubject.value;
  }

  isFavorite(song: any): boolean {
    const favorites = this.getFavoriteSongs();
    return favorites.some(fav => 
      fav.title === song.title && fav.artist === song.artist
    );
  }

  updateSongsList(songs: any[]): void {
    if (isPlatformBrowser(this.platformId)) {
      // Guardar todas las canciones con su estado de favorito
      localStorage.setItem('favoriteSongs', JSON.stringify(songs));
      
      // Actualizar el subject con las favoritas
      const favorites = songs.filter(song => song.isFavorite);
      this.favoritesSubject.next(favorites);
    }
  }
}
