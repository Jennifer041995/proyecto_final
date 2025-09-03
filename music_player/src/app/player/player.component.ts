import { Component, OnInit } from '@angular/core';
import { MediaFile } from '../../modelos/media.model';
import { MediaService } from '../../servicios/media.service';
import { NgModule } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {
  media: MediaFile | null = null;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    // Lista de prueba
    this.mediaService.setMedia([
      { name: 'Canción de prueba', url: 'assets/music/mandisa/stronger.mp3', type: 'audio' },
      { name: 'Video de prueba', url: 'assets/videos/TobyMac - Lights Shine Bright ft. Hollyn.mp4', type: 'video' }
    ]);

    this.mediaService.setCurrentMedia(this.mediaService.getMediaList()[0]);
    this.media = this.mediaService.getCurrentMedia();
  }

  isAudio(): boolean {
    return this.media?.type === 'audio';
  }

  isVideo(): boolean {
    return this.media?.type === 'video';
  }

  togglePlay() {
    // Lógica para alternar reproducción
    this.isPlaying = !this.isPlaying;
    //aqui se conectara con audio o video real
  }

}

@NgModule({
  declarations: [
    PlayerComponent,
    MiniPlayerComponent
  ],
})
export class PlayerModule {}

<router-outlet></router-outlet>
<app-mini-player></app-mini-player>

