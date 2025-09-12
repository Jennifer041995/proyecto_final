import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AudioPlayerComponent } from "./audio-player/audio-player";
import { OptionBar } from "./option-bar/option-bar";
import { CommonModule } from '@angular/common';
import { Library } from './library/library';
import { Favorites } from './favorites/favorites';
import { Videos } from './videos/videos';
import { SelectFile } from './select-file/select-file';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AudioPlayerComponent, OptionBar, 
            CommonModule, Library, SelectFile, Videos, Favorites],
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