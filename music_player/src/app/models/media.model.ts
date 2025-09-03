import { Component, NgModule } from '@angular/core';
//import { MediaService } from './services/media.service';

export interface MediaFile {
  name: string;
  url: string;
  type: 'audio' | 'video';
  duracion?: number;
  cover?: string;
}
