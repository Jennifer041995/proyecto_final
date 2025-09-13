import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { YouTubePlayerModule } from '@angular/youtube-player';

@Component({
  selector: 'app-videos',
  imports: [CommonModule, FormsModule, YouTubePlayerModule],
  standalone: true,
  templateUrl: './videos.html',
  styleUrl: './videos.css'
})
export class Videos {

}
