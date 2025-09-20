import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faHeart as faHeartSolid, faMusic } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { FavoritesService } from '../services/favorites.service';
import { PlayerService } from '../services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './favorites.html',
  styleUrl: './favorites.css'
})
export class Favorites implements OnInit, OnDestroy {
  // Iconos de Font Awesome
  faPlay = faPlay;
  faHeartSolid = faHeartSolid;
  faHeartRegular = faHeartRegular;
  faMusic = faMusic;

  favoriteSongs: any[] = [];
  private subscription: Subscription = new Subscription();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private favoritesService: FavoritesService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.loadFavoriteSongs();
    this.subscribeToFavorites();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private loadFavoriteSongs(): void {
    this.favoriteSongs = this.favoritesService.getFavoriteSongs();
  }

  private subscribeToFavorites(): void {
    this.subscription.add(
      this.favoritesService.favorites$.subscribe(favorites => {
        this.favoriteSongs = favorites;
      })
    );
  }

  playFavorite(song: any): void {
    this.playerService.playSong(song);
  }

  removeFavorite(song: any, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click en el item
    this.favoritesService.removeFavorite(song);
  }

  goToLibrary(): void {
    // Aquí podrías implementar la navegación a la biblioteca
    console.log('Navegando a la biblioteca');
    // TODO: Implementar navegación al componente de biblioteca
  }
}
