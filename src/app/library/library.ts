import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-library',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './library.html',
  styleUrl: './library.css'
})
export class Library {
  @Input() songs: { title: string; artist: string }[] = [];
  @Input() currentSongIndex: number = -1;
  @Output() songSelected = new EventEmitter<number>();

  changeSong(index: number): void {
    this.songSelected.emit(index);
  }
  audio = new Audio();
  isPlaying = false;

  playSong(index: number): void {
    this.currentSongIndex = index;
    const song = this.songs[index];
    if (song && (song as any).url) {
      this.audio.src = (song as any).url;
      this.audio.load();
      this.audio.play();
      this.isPlaying = true;
    }
  }

}