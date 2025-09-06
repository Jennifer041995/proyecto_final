import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from "./audio-player/audio-player";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {  // Cambia de AppComponent a App
  title = 'musica';
}