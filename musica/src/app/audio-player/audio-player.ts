import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule, YouTubePlayerModule],
  templateUrl: './audio-player.html',
  styleUrls: ['./audio-player.css']
})
export class AudioPlayerComponent implements OnInit{
  audio: HTMLAudioElement | null = null;
  currentSongIndex: number = 0;
  isPlaying: boolean = false;
  progress: number = 0;
  volume: number = 1;
  //currentTime: number = 0; //tiempo actual en segundos
 // duration: number = 0; //duración total en segundos
  interval: any;

  handleOption(option: string): void {
  console.log('Opción seleccionada:', option);
  // Aquí puedes mostrar u ocultar secciones según la opción
}

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
      imagen: "",
      title: file.name,
      artist: 'Local',
      url: objectUrl
    });
    this.currentSongIndex = this.songs.length - 1;
  }
}

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

  get isAudioReady(): boolean {
    return this.audio !== null;
  }

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get isMobile(): boolean {
    return isPlatformBrowser(this.platformId) && window.innerWidth < 768;
  }


}

// Módulo de declaración que incluye YoutubePlayerModule
@NgModule({
  imports: [YouTubePlayerModule]
})
export class AppModule {}
