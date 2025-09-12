import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-file',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-file.html',
  styleUrls: ['./select-file.css']
})
export class SelectFile {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  songs: { title: string; url: string }[] = [];
  currentSongIndex = 0;
  isPlaying = false;
  volume = 1;

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files;

    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      this.songs.push({ title: file.name, url });
    }

    // Si no hay reproducción activa, inicia con la primera
    if (!this.isPlaying && this.songs.length > 0) {
      this.playSong(this.currentSongIndex);
    }
  }

  playSong(index: number): void {
    this.currentSongIndex = index;
    const song = this.songs[index];
    const audio = this.audioPlayer.nativeElement;
    audio.src = song.url;
    audio.load();
    audio.play();
    this.isPlaying = true;
  }

  playPause(): void {
    const audio = this.audioPlayer.nativeElement;
    if (this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  next(): void {
    if (this.currentSongIndex < this.songs.length - 1) {
      this.playSong(this.currentSongIndex + 1);
    }
  }

  previous(): void {
    if (this.currentSongIndex > 0) {
      this.playSong(this.currentSongIndex - 1);
    }
  }

  setVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.volume = parseFloat(input.value);
    this.audioPlayer.nativeElement.volume = this.volume;
  }
}
