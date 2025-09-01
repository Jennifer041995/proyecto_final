// ...existing code...
// Eliminado bloque fuera de lugar
import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TrackListComponent } from "../music-player/track-list/track-list";

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, TrackListComponent],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  public previous(): void {
    this.prevTrack();
  }
  public next(): void {
    this.nextTrack();
  }
  public toggleLoop(): void {
    this.isLooping = !this.isLooping;
  }
  
  // Propiedades para reproductor completo
  isPlaying = false;
  isShuffle = false;
  currentTime = 0;
  duration = 0;
  isLooping = false;

  // Musica con artista y album
  tracks = [
    {
      title: 'Overcomer',
      artist: 'Mandisa',
      album: 'english',
      url: 'assets/music/Mandisa/Overcomer.mp3',
      captions: '',
      cover: 'assets/music/Mandisa/cover.jpg'
    },
    {
      title: 'Stronger',
      artist: 'Mandisa',
      album: 'english',
      url: 'assets/music/Mandisa/Stronger.mp3',
      captions: '',
      cover: 'assets/music/Mandisa/cover.jpg'
    },
    {
      title: 'He Knows My Name',
      artist: 'Francesca Battistelli',
      album: 'english',
      url: 'assets/music/FrancescaBattistelli/HeKnowsMyName.mp3',
      captions: '',
      cover: 'assets/music/FrancescaBattistelli/cover.jpg'
    },
    {
      title: 'Feel It',
      artist: 'TobyMac',
      album: 'This Is Not A Test',
      url: 'assets/music/TobyMac/FeelIt.mp3',
      captions: '',
      cover: 'assets/music/TobyMac/cover.jpg'
    },
    {
      title: '',
      artist: '',
      album: '',
      url: '',
      captions: '',
      cover: 'assets/music/default-cover.png'
    }
  ];
  // Actualizar play/pause
  togglePlay() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (!audioPlayer) return;
    if (audioPlayer.paused) {
      audioPlayer.play();
      this.isPlaying = true;
    } else {
      audioPlayer.pause();
      this.isPlaying = false;
    }
  }

  play() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.loop = this.isLooping;
      audioPlayer.play();
      this.isPlaying = true;
    }
    this.playVideo();
  }

  stop() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
      this.isPlaying = false;
    }
    this.stopVideo();
  }

  playVideo() {
    const videoPlayer: HTMLVideoElement | null = document.querySelector('video');
    if (videoPlayer) {
      videoPlayer.play();
    }
  }

  stopVideo() {
    const videoPlayer: HTMLVideoElement | null = document.querySelector('video');
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }
  }

  // Barra de progreso
  updateProgress(event: any) {
    this.currentTime = event.target.currentTime;
    this.duration = event.target.duration;
  }

  seekAudio(event: any) {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.currentTime = event.target.value;
      this.currentTime = audioPlayer.currentTime;
    }
  }

  // Volumen
  setVolume(event: any) {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.volume = event.target.value;
    }
  }

  // Shuffle es decir, mezclar o reordenar aleatoriamente, reproducir en orden aleatorio
  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
  }

  nextTrack() {
    if (this.isShuffle && this.filteredTracks.length > 1) {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * this.filteredTracks.length);
      } while (nextIndex === this.currentTrackIndex);
      this.currentTrackIndex = nextIndex;
    } else if (this.filteredTracks.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.filteredTracks.length;
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    }
    this.play();
  }

  prevTrack() {
    if (this.filteredTracks.length > 0) {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.filteredTracks.length) % this.filteredTracks.length;
    } else {
      this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    }
    this.play();
  }

  filteredTracks = [...this.tracks];

  videoTracks = [
    {
      title: 'TobyMac - Light Shine Bright',
      url: 'assets/videos/video1.mp4',
      captions: 'assets/videos/video1.vtt'
    },
    {
      title: 'TobyMac - Feel It',
      url: 'assets/videos/video2.mp4',
      captions: 'assets/videos/video2.vtt'
    }
  ];

  currentTrackIndex = 0;

  get currentTrack() {
    return this.filteredTracks.length > 0
      ? this.filteredTracks[this.currentTrackIndex]
      : this.tracks[this.currentTrackIndex];
  }
  // ...implementación única de nextTrack y prevTrack ya está presente arriba...

  filterTracks(searchTerm: string) {
    if (!searchTerm) {
      this.filteredTracks = [...this.tracks];
    } else {
      this.filteredTracks = this.tracks.filter(track =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.album.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    this.currentTrackIndex = 0;
  }

  selectTrack(index: number) {
    this.currentTrackIndex = index;
    setTimeout(() => this.play(), 0);
  }
}
