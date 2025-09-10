import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from "./audio-player/audio-player";
import { OptionBar } from "./option-bar/option-bar";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent, OptionBar],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  currentView: string = 'player'; // ← AGREGA esta variable
  title = 'musica';

  // IMPLEMENTA esta función correctamente:
  handleOption(selectedOption: string): void {
    this.currentView = selectedOption;
    console.log('Opción seleccionada:', selectedOption);
  }
}