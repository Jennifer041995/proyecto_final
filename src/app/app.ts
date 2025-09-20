import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from "./audio-player/audio-player";
import { OptionBar } from "./option-bar/option-bar";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Library } from './library/library';
import { Favorites } from './favorites/favorites';
import { Videos } from './videos/videos';
import { SelectFile } from './select-file/select-file';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStepBackward, faPlay, faPause, faStepForward, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent, OptionBar, 
            CommonModule, Library, SelectFile, Videos, Favorites, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  // Iconos de Font Awesome
  faStepBackward = faStepBackward;
  faPlay = faPlay;
  faPause = faPause;
  faStepForward = faStepForward;
  faVolumeHigh = faVolumeHigh;

  currentView: string = 'player';
  title = 'musica';
  // Propiedad para controlar el estado del sidebar en el componente padre
  isSidebarCollapsed: boolean = false;
  // Propiedad para controlar la clase "extend" en content-area
  isSidebarExtended: boolean = true; // Inicialmente extendido

  // Propiedades del reproductor de audio
  audio: HTMLAudioElement | null = null;
  currentSongIndex: number = 0;
  isPlaying: boolean = false;
  progress: number = 0;
  volume: number = 1;

  songs: any[] = [
    { 
      image: 'assets/imagenes/mandisa.jpg',
      title: 'BleedTheSame', 
      artist: 'Mandisa ft. TobyMac, Kirk Franklin', 
      url: 'assets/ingles/MandisaBleedTheSameftTobyMacKirkFranklin.mp3'
    },
    { 
      image: 'assets/imagenes/Francesca.jpg',
      title: 'HeKnowsMyName', 
      artist: 'Francesca Battistelli', 
      url: 'assets/ingles/FrancescaBattistelliHeKnowsMyName.mp3' 
    },
    { 
      image: 'assets/imagenes/mandisa.jpg',
      title: 'Overcomer', 
      artist: 'Mandisa', 
      url: 'assets/ingles/Mandisa-Overcomer.mp3' 
    },
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.audio = new Audio();
      this.setupAudio();
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
    if (!this.audio) return;
    
    this.currentSongIndex = index;
    this.audio.src = this.songs[index].url;
    this.audio.load();
    if (this.isPlaying) {
      this.audio.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
    this.progress = 0;
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

  handleOption(selectedOption: string): void {
    this.currentView = selectedOption;
    console.log('Opción seleccionada:', selectedOption);
  }

  toggleSidebar(isExtended: boolean) {
    this.isSidebarCollapsed = !isExtended;
    this.isSidebarExtended = isExtended;
  }
}