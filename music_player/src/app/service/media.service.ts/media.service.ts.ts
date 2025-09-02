import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
//import {MediaService} from './services/media.service';
import { MediaFile } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class MediaService {
  private mediaList: MediaFile[] = [];
  private currentMedia: MediaFile | null = null;

  setMedia(list: MediaFile[]) {
    this.mediaList = list;
  }
  getMediaList(): MediaFile[] {
    return this.mediaList;
  }
  setCurrentMedia(media: MediaFile) {
    this.currentMedia = media;
  }
  getCurrentMedia(): MediaFile | null {
    return this.currentMedia;
  }
}

