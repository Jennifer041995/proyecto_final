import { Component } from '@angular/core';

export interface MediaFile {
  name: string;
  url: string;
  type: 'audio' | 'video';
  duracion?: number;
  cover?: string;
}
