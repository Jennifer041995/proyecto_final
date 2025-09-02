import { Component, EventEmitter, Input, Output } from "@angular/core";

//import { Component, Input, Output, EventEmitter } from '@angular/core';
//import { MatFormField } from "../../../../node_modules/@angular/material/form-field.d";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.html',
  styleUrls: ['./track-list.css'],
  imports: [MatIconModule, MatInputModule]
})
export class TrackListComponent {
  @Input() tracks: any[] = [];
  @Input() currentTrackIndex: number = 0;
  @Output() trackSelected = new EventEmitter<number>();

  filteredTracks: any[] = [];

  ngOnInit() {
    this.filteredTracks = [...this.tracks];
  }

  filterTracks(query: string) {
    const lowerQuery = query.toLowerCase();
    this.filteredTracks = this.tracks.filter(track =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery) ||
      track.album.toLowerCase().includes(lowerQuery)
    );
  }

  selectTrack(index: number) {
    this.trackSelected.emit(index);
  }
}
