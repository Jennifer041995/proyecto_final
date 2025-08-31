import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './player.component.html',
  // styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  isLooping = false;
  play() {
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.loop = this.isLooping;
      audioPlayer.play();
    }
  }

  // Removed erroneous nested class 'AudioComponent'

  toggleLoop() {
    this.isLooping = !this.isLooping;
    const audioPlayer: HTMLAudioElement | null = document.querySelector('audio');
    if (audioPlayer) {
      audioPlayer.loop = this.isLooping;
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
      title: 'Mandisa - Overcomer',
      artist: 'Mandisa',
      album: 'english',
      url: 'assets/music/Mandisa/Overcomer.mp3',
      captions: ''
    },
    {
      title: 'Mandisa - Stronger',
      artist: 'Mandisa',
      album: 'english',
      url: 'assets/music/Mandisa/Stronger.mp3',
      captions: ''
    },
    {
      title: 'Francesca Battistelli - He Knows My Name',
      artist: 'Francesca Battistelli',
      album: 'english',
      url: 'assets/music/FrancescaBattistelli/HeKnowsMyName.mp3',
      captions: ''
    },
    {
      title: 'TobyMac - Feel It',
      artist: 'TobyMac',
      album: 'This Is Not A Test',
      url: 'assets/music/TobyMac/FeelIt.mp3',
      captions: ''
    },
    {
      title: 'Luis Miguel - La Incondicional',
      artist: 'Luis Miguel',
      album: 'Busca Una Mujer',
      url: 'assets/music/LuisMiguel/LaIncondicional.mp3',
      captions: ''
    }
  ];

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
    return this.tracks[this.currentTrackIndex];
  }
  nextTrack() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
  }
  prevTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
  }
}
