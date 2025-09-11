import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-file',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './select-file.html',
  styleUrl: './select-file.css'
})
export class SelectFile {
  [x: string]: any;

  handleOption(option: string): void {
    console.log('Opción seleccionada:', option);
  }

  loadLocalFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      console.log('Archivo seleccionado:', file.name);
      // Aquí puedes agregar lógica para reproducir, validar o almacenar el archivo
    } else {
      console.warn('No se seleccionó ningún archivo');
    }
  }

  loadLocalFile(event: any): void {
    const file = event.target.files[0];
    if (file && this.audio) {
      const objectUrl = URL.createObjectURL(file);
      this.audio.src = objectUrl;
      this.audio.load();
      this.audio.play();
      this.isPlaying = true;

      this.songs.push({
        imagen: "",
        title: file.name,
       artist: 'Local',
       url: objectUrl
      });
      this.currentSongIndex = this.songs.length - 1;
    }
  }

}


