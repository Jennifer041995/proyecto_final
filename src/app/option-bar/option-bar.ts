import { Component, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faBars, faXmark, faGaugeHigh, faCalendar, faBell, faUsers, faChartSimple, faBookmark, faGear, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-option-bar',
  imports: [CommonModule, FontAwesomeModule],
  standalone: true,
  templateUrl: './option-bar.html',
  styleUrls: ['./option-bar.css']
})
export class OptionBar {
  // Define las propiedades para los iconos
  faChevronLeft = faChevronLeft;
  faBars = faBars;
  faXmark = faXmark;
  faGaugeHigh = faGaugeHigh;
  faCalendar = faCalendar;
  faBell = faBell;
  faUsers = faUsers;
  faChartSimple = faChartSimple;
  faBookmark = faBookmark;
  faGear = faGear;
  faUser = faUser;
  faRightFromBracket = faRightFromBracket;

  // Estado para controlar la clase 'collapsed' del sidebar
  isCollapsed: boolean = false;
  // Estado para controlar la clase 'menu-active'
  isMenuActive: boolean = false;

  selected: string = 'player';
  @Output() optionSelected = new EventEmitter<string>();
  @Output() sidebarToggled = new EventEmitter<boolean>();

  // Unir la clase 'collapsed' a la etiqueta host (<app-option-bar>)
  @HostBinding('class.collapsed')
  get collapsedClass() {
    return this.isCollapsed;
  }

  // Unir la clase 'menu-active' a la etiqueta host
  @HostBinding('class.menu-active')
  get menuActiveClass() {
    return this.isMenuActive;
  }

  // Escuchar el evento de redimensionamiento de la ventana para manejar el estado
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth >= 1024) {
      // Si la pantalla es grande, el menú no está activo y no está colapsado
      this.isMenuActive = false;
      this.isCollapsed = false;
    }
  }

  // Método para manejar la lógica de colapsar/expandir el sidebar
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Si el sidebar se colapsa, asegúrate de que el menú no esté activo
    if (this.isCollapsed) {
      this.isMenuActive = false;
    }
    // Emitir el evento para notificar al componente padre con el estado del sidebar
    // true = extendido, false = colapsado
    this.sidebarToggled.emit(!this.isCollapsed);
  }

  // Método para manejar la lógica del menú móvil
  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
    // Si el menú se activa, asegúrate de que el sidebar no esté colapsado
    if (this.isMenuActive) {
      this.isCollapsed = false;
    }
  }

  // Método para manejar la selección de opciones
  select(option: string): void {
    this.selected = option;
    this.optionSelected.emit(option);
    // Opcional: Cerrar el menú después de seleccionar una opción en móvil
    if (this.isMenuActive) {
      this.isMenuActive = false;
    }
  }
}