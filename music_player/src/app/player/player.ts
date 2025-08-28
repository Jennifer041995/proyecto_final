import { Component } from '@angular/core';

@Component({
  selector: 'app-player',
  imports: [],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
pause() {
throw new Error('Method not implemented.');
}

    decreaseVolume(volume: number) {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.volume = Math.max(0, Math.min(1, volume));
    }
  }
  play() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.play();
    }
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
