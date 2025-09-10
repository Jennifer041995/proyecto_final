import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audio-controls',
  standalone: true,
  imports: [],
  templateUrl: './audio-controls.html',
  styleUrls: ['./audio-controls.css']
})
export class AudioControlsComponent {
  @Input() isPlaying: boolean = false;
  @Input() progress: number = 0;
  @Input() currentTime: number = 0;
  @Input() duration: number = 0;
  @Input() volume: number = 1;
  
  @Output() playPause = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
  @Output() seek = new EventEmitter<number>();
  @Output() volumeChange = new EventEmitter<number>();

  onSeek(event: any): void {
    this.seek.emit(event.target.value);
  }

  onVolumeChange(event: any): void {
    this.volumeChange.emit(event.target.value);
  }

  formatTime(seconds: number): string {
    if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
  }
}
