import { Component, signal } from '@angular/core';
import { PlayerComponent } from './player/player';

@Component({
  selector: 'app-root',
  imports: [PlayerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('music_player');
}

