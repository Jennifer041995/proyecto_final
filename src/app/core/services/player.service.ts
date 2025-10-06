import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Song } from '../models/song.interface';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private audio: HTMLAudioElement | null = null;
  private currentSongSubject = new BehaviorSubject<Song | null>(null);
  private isPlayingSubject = new BehaviorSubject<boolean>(false);
  private progressSubject = new BehaviorSubject<number>(0);
  private volumeSubject = new BehaviorSubject<number>(1);
  private currentSongIndexSubject = new BehaviorSubject<number>(0);
  private songsSubject = new BehaviorSubject<Song[]>([]);

  // Observables públicos
  public currentSong$ = this.currentSongSubject.asObservable();
  public isPlaying$ = this.isPlayingSubject.asObservable();
  public progress$ = this.progressSubject.asObservable();
  public volume$ = this.volumeSubject.asObservable();
  public currentSongIndex$ = this.currentSongIndexSubject.asObservable();
  public songs$ = this.songsSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeAudio();
    }
  }

  private initializeAudio(): void {
    this.audio = new Audio();
    this.setupAudioEvents();
  }

  private setupAudioEvents(): void {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        const progress = (this.audio.currentTime / this.audio.duration) * 100 || 0;
        this.progressSubject.next(progress);
      }
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('loadstart', () => {
      this.progressSubject.next(0);
    });
  }

  setSongs(songs: Song[]): void {
    this.songsSubject.next(songs);
  }

  playSong(song: Song, songIndex?: number): void {
    if (!this.audio || !song) return;

    // Buscar el índice de la canción si no se proporciona
    if (songIndex === undefined) {
      const songs = this.songsSubject.value;
      songIndex = songs.findIndex(s => s.title === song.title && s.artist === song.artist);
    }

    if (songIndex !== -1) {
      this.currentSongIndexSubject.next(songIndex);
      this.currentSongSubject.next(song);
      
      this.audio.src = song.url;
      this.audio.load();
      this.audio.play().then(() => {
        this.isPlayingSubject.next(true);
      }).catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
  }

  playPause(): void {
    if (!this.audio) return;

    if (this.isPlayingSubject.value) {
      this.audio.pause();
      this.isPlayingSubject.next(false);
    } else {
      this.audio.play().then(() => {
        this.isPlayingSubject.next(true);
      }).catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
  }

  next(): void {
    const songs = this.songsSubject.value;
    const currentIndex = this.currentSongIndexSubject.value;
    const nextIndex = (currentIndex + 1) % songs.length;
    
    if (songs[nextIndex]) {
      this.playSong(songs[nextIndex], nextIndex);
    }
  }

  previous(): void {
    const songs = this.songsSubject.value;
    const currentIndex = this.currentSongIndexSubject.value;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    
    if (songs[prevIndex]) {
      this.playSong(songs[prevIndex], prevIndex);
    }
  }

  seek(progress: number): void {
    if (!this.audio) return;
    
    const seekTime = (progress / 100) * this.audio.duration;
    this.audio.currentTime = seekTime;
    this.progressSubject.next(progress);
  }

  setVolume(volume: number): void {
    if (!this.audio) return;
    
    this.audio.volume = volume;
    this.volumeSubject.next(volume);
  }

  // Getters para obtener valores actuales
  get currentSong(): Song | null {
    return this.currentSongSubject.value;
  }

  get isPlaying(): boolean {
    return this.isPlayingSubject.value;
  }

  get progress(): number {
    return this.progressSubject.value;
  }

  get volume(): number {
    return this.volumeSubject.value;
  }

  get currentSongIndex(): number {
    return this.currentSongIndexSubject.value;
  }

  get songs(): Song[] {
    return this.songsSubject.value;
  }

  get currentTime(): number {
    return this.audio ? this.audio.currentTime : 0;
  }

  get duration(): number {
    return this.audio ? this.audio.duration : 0;
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }
}
