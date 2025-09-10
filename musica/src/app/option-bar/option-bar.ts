import { CommonModule } from '@angular/common';
import { Component,  Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-option-bar',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './option-bar.html',
  styleUrls: ['./option-bar.css']
})
export class OptionBar {
handleOption($event: string) {
throw new Error('Method not implemented.');
}
  selected: string = 'player';

  @Output() optionSelected = new EventEmitter<string>();

  select(option: string): void {
    this.selected = option;
    this.optionSelected.emit(option);
  }

}
