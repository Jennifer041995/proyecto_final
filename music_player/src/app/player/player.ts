import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.component.html',
  // styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  play() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.play();
    }
  }

  pause() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.pause();
    }
  }

  stop() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  }

  increaseVolume() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer && audioPlayer.volume < 1) {
      audioPlayer.volume = Math.min(1, audioPlayer.volume + 0.1);
    }
  }

  decreaseVolume() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer && audioPlayer.volume > 0) {
      audioPlayer.volume = Math.max(0, audioPlayer.volume - 0.1);
    }
  }

  next() {
    this.nextTrack();
  }

  previous() {
    this.prevTrack();
  }

  tracks = [
    {
      title: 'Canción 1',
      artist: 'Artista 1',
      album: 'Álbum 1',
      url: 'ruta/a/cancion1.mp3',
      captions: 'ruta/a/cancion1.vtt'
    },
    {
      title: 'Canción 2',
      artist: 'Artista 2',
      album: 'Álbum 2',
      url: 'ruta/a/cancion2.mp3',
      captions: 'ruta/a/cancion2.vtt'
    }
  ];
  currentTrackIndex = 0;

  get currentTrack() {
    return this.tracks[this.currentTrackIndex];
  }
  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
  }
  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
  }
}
