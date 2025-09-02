import { Component } from "@angular/core";
import { OnInit } from "@angular/core";
import { MediaFile } from "../models/models";
import { MediaService } from '../../services/media.service';

@Component({
  selector: "app-player",
  templateUrl: "./player.component.html",
  styleUrls: ["./player.component.css"]
})
export class PlayerComponent implements OnInit {
  media: MediaFile | null = null;

  constructor(private mediaService: MediaService) {}

  ngOnInit() {
    this.media = this.mediaService.getCurrentMedia();
     this.mediaService.setMediaList([
    {name: "Canción de prueba", 
    url: "assets/music/mandisa/stronger.mp3", 
    type: "audio"
    },
    {name: "Video de prueba", 
    url: "assets/videos/TobyMac - Lights Shine Bright ft. Hollyn.mp4", 
    type: "video"
    },
  ]);
  this.mediaService.setCurrentMedia(this.mediaService.getMediaList()[0]);
  this.media = this.mediaService.getCurrentMedia();
  }

  isAudio(): boolean {
    return this.media?.type === "audio";
  }
  isVideo(): boolean {
    return this.media?.type === "video";
  }

 
}