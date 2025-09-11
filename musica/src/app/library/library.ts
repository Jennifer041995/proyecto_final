import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-library',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './library.html',
  styleUrl: './library.css'
})
export class Library {

}
