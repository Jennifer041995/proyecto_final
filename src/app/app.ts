import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from "./audio-player/audio-player";
import { OptionBar } from "./option-bar/option-bar";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Library } from './library/library';
import { Favorites } from './favorites/favorites';
import { Videos } from './videos/videos';
import { SelectFile } from './select-file/select-file';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStepBackward, faPlay, faPause, faStepForward, faVolumeHigh, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from './services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent, OptionBar, 
            CommonModule, Library, SelectFile, Videos, Favorites, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {
  // Iconos de Font Awesome
  faStepBackward = faStepBackward;
  faPlay = faPlay;
  faPause = faPause;
  faStepForward = faStepForward;
  faVolumeHigh = faVolumeHigh;
  faChevronDown = faChevronDown;

  currentView: string = 'player';
  title = 'musica';
  // Propiedad para controlar el estado del sidebar en el componente padre
  isSidebarCollapsed: boolean = this.getSidebarState();
  // Propiedad para controlar la clase "extend" en content-area
  isSidebarExtended: boolean = !this.getSidebarState(); // Basado en el estado real del sidebar
  // Propiedad para controlar la expansión del reproductor en móvil
  isPlayerExpanded: boolean = false;

  // Propiedades del reproductor de audio
  currentSong: any = null;
  isPlaying: boolean = false;
  progress: number = 0;
  volume: number = 1;
  currentSongIndex: number = 0;

  private subscription: Subscription = new Subscription();

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

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.playerService.setSongs(this.songs);
      this.subscribeToPlayerService();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private subscribeToPlayerService(): void {
    this.subscription.add(
      this.playerService.currentSong$.subscribe(song => {
        this.currentSong = song;
      })
    );

    this.subscription.add(
      this.playerService.isPlaying$.subscribe(playing => {
        this.isPlaying = playing;
      })
    );

    this.subscription.add(
      this.playerService.progress$.subscribe(progress => {
        this.progress = progress;
      })
    );

    this.subscription.add(
      this.playerService.volume$.subscribe(volume => {
        this.volume = volume;
      })
    );

    this.subscription.add(
      this.playerService.currentSongIndex$.subscribe(index => {
        this.currentSongIndex = index;
      })
    );
  }


  playPause(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.playerService.playPause();
  }

  next(): void {
    this.playerService.next();
  }

  previous(): void {
    this.playerService.previous();
  }

  seek(event: any): void {
    this.playerService.seek(event.target.value);
  }

  setVolume(event: any): void {
    this.playerService.setVolume(event.target.value);
  }

  formatTime(seconds: number): string {
    return this.playerService.formatTime(seconds);
  }

  get currentTime(): number {
    return this.playerService.currentTime;
  }

  get duration(): number {
    return this.playerService.duration;
  }

  handleOption(selectedOption: string): void {
    this.currentView = selectedOption;
    console.log('Opción seleccionada:', selectedOption);
  }

  toggleSidebar(isExtended: boolean) {
    this.isSidebarCollapsed = !isExtended;
    this.isSidebarExtended = isExtended;
  }

  // Métodos para manejar la expansión del reproductor en móvil
  togglePlayerExpansion(event: Event): void {
    // Solo expandir en dispositivos móviles (pantallas menores a 768px)
    if (window.innerWidth < 768) {
      this.isPlayerExpanded = !this.isPlayerExpanded;
    }
  }

  collapsePlayer(event: Event): void {
    event.stopPropagation(); // Evitar que se propague el evento de click
    this.isPlayerExpanded = false;
  }

  // Método para obtener el estado del sidebar desde localStorage
  private getSidebarState(): boolean {
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        return JSON.parse(savedState);
      }
    }
    // Estado por defecto: extendido (false)
    return false;
  }
}