import { Component, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faBars, faXmark, faHome, faFolderOpen, faMusic, faPlay, faHeart, faBookmark, faGear, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

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
  faHome = faHome;
  faFolderOpen = faFolderOpen;
  faMusic = faMusic;
  faPlay = faPlay;
  faHeart = faHeart;
  faBookmark = faBookmark;
  faGear = faGear;
  faUser = faUser;
  faRightFromBracket = faRightFromBracket;

  // Estado para controlar la clase 'collapsed' del sidebar
  isCollapsed: boolean = this.getSidebarState();
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
      // Si la pantalla es grande, el menú no está activo
      this.isMenuActive = false;
      // Restaurar el estado guardado del sidebar (no forzar a extendido)
      this.isCollapsed = this.getSidebarState();
    }
  }

  // Método para manejar la lógica de colapsar/expandir el sidebar
  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    // Guardar el estado en localStorage
    this.saveSidebarState(this.isCollapsed);
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

  // Método para manejar el click en la imagen del logo en móvil
  toggleMenuOnMobile(event: Event): void {
    event.preventDefault();
    // Solo activar en dispositivos móviles (pantallas menores a 768px)
    if (window.innerWidth < 768) {
      this.isMenuActive = !this.isMenuActive;
      // Asegurar que el sidebar no se extienda, solo se muestre plegado
      this.isCollapsed = true;
    }
  }

  // Métodos para persistencia del estado del sidebar
  private getSidebarState(): boolean {
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedState = localStorage.getItem('sidebarCollapsed');
      if (savedState !== null) {
        return JSON.parse(savedState);
      }
    }
    // Estado por defecto: extendido (false)
    return false;
  }

  private saveSidebarState(collapsed: boolean): void {
    // Verificar si estamos en el navegador
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
    }
  }
}