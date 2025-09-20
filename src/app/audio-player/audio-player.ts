import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStepBackward, faPlay, faPause, faStepForward, faVolumeHigh, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { FavoritesService } from '../services/favorites.service';
import { PlayerService } from '../services/player.service';


@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule, YouTubePlayerModule, FontAwesomeModule],
  templateUrl: './audio-player.html',
  styleUrls: ['./audio-player.css']
})
export class AudioPlayerComponent implements OnInit{
  // Iconos de Font Awesome
  faStepBackward = faStepBackward;
  faPlay = faPlay;
  faPause = faPause;
  faStepForward = faStepForward;
  faVolumeHigh = faVolumeHigh;
  faHeartSolid = faHeart;
  faHeartRegular = faHeartRegular;

  audio: HTMLAudioElement | null = null;
  currentSongIndex: number = 0;
  isPlaying: boolean = false;
  progress: number = 0;
  volume: number = 1;
  //currentTime: number = 0; //tiempo actual en segundos
 // duration: number = 0; //duración total en segundos
  interval: any;

  songs: any[] = [
    { 
      image: 'assets/imagenes/mandisa.jpg',
      title: 'BleedTheSame', 
      artist: 'Mandisa ft. TobyMac, Kirk Franklin', 
      url: 'assets/ingles/MandisaBleedTheSameftTobyMacKirkFranklin.mp3',
      isFavorite: false
    },
    { 
      image: 'assets/imagenes/Francesca.jpg',
      title: 'HeKnowsMyName', 
      artist: 'Francesca Battistelli', 
      url: 'assets/ingles/FrancescaBattistelliHeKnowsMyName.mp3',
      isFavorite: false
    },
    { 
      image: 'assets/imagenes/mandisa.jpg',
      title: 'Overcomer', 
      artist: 'Mandisa', 
      url: 'assets/ingles/Mandisa-Overcomer.mp3',
      isFavorite: false
    },
  ];

  //this.progress=(this.audio.currentTime/this.audio.duration)*100 || 0;

  loadLocalFile(event: any): void {
  const file = event.target.files[0];
  if (file && this.audio) {
    const objectUrl = URL.createObjectURL(file);
    this.audio.src = objectUrl;
    this.audio.load();
    this.audio.play();
    this.isPlaying = true;

    this.songs.push({
      image: "",
      title: file.name,
      artist: 'Local',
      url: objectUrl,
      isFavorite: false
    });
    this.currentSongIndex = this.songs.length - 1;
  }
}

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private favoritesService: FavoritesService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadFavorites();
      this.updateFavoritesService();
      this.playerService.setSongs(this.songs);
    }
  }

  setupAudio(): void {
    if (!this.audio) return;
    
    this.audio.src = this.songs[this.currentSongIndex].url;
    this.audio.load();
    
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.progress = (this.audio.currentTime / this.audio.duration) * 100 || 0;
        if (this.audio.currentTime === this.audio.duration) {
          this.next();
        }
      }
    });
  }

  playPause(): void {
    if (!this.audio) return;
    
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  next(): void {
    this.currentSongIndex = (this.currentSongIndex + 1) % this.songs.length;
    this.changeSong(this.currentSongIndex);
  }

  previous(): void {
    this.currentSongIndex = (this.currentSongIndex - 1 + this.songs.length) % this.songs.length;
    this.changeSong(this.currentSongIndex);
  }

  changeSong(index: number): void {
    if (index >= 0 && index < this.songs.length) {
      this.playerService.playSong(this.songs[index], index);
    }
  }

  seek(event: any): void {
    if (!this.audio) return;
    
    const seekTime = (event.target.value / 100) * this.audio.duration;
    this.audio.currentTime = seekTime;
    this.progress = event.target.value;
  }

  setVolume(event: any): void {
    if (!this.audio) return;
    
    this.volume = event.target.value;
    this.audio.volume = this.volume;
  }

  get currentSong(): any {
    return this.songs[this.currentSongIndex];
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }

  get currentTime(): number {
    return this.audio ? this.audio.currentTime : 0;
  }

  get duration(): number {
    return this.audio ? this.audio.duration : 0;
  }

  get isAudioReady(): boolean {
    return this.audio !== null;
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isMobile(): boolean {
    return isPlatformBrowser(this.platformId) && window.innerWidth < 768;
  }

  // Métodos para manejar favoritos
  toggleFavorite(index: number, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click en la canción
    
    if (index >= 0 && index < this.songs.length) {
      this.songs[index].isFavorite = !this.songs[index].isFavorite;
      this.favoritesService.toggleFavorite(this.songs[index]);
      this.updateFavoritesService();
    }
  }

  getFavoriteSongs(): any[] {
    return this.songs.filter(song => song.isFavorite);
  }

  private saveFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const favorites = this.songs.map(song => ({
        title: song.title,
        artist: song.artist,
        url: song.url,
        image: song.image,
        isFavorite: song.isFavorite
      }));
      localStorage.setItem('favoriteSongs', JSON.stringify(favorites));
    }
  }

  private loadFavorites(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedFavorites = localStorage.getItem('favoriteSongs');
      if (savedFavorites) {
        const favorites = JSON.parse(savedFavorites);
        // Actualizar el estado de favoritos en las canciones actuales
        this.songs.forEach(song => {
          const savedSong = favorites.find((fav: any) => fav.title === song.title && fav.artist === song.artist);
          if (savedSong) {
            song.isFavorite = savedSong.isFavorite;
          }
        });
      }
    }
  }

  private updateFavoritesService(): void {
    this.favoritesService.updateSongsList(this.songs);
  }

}

