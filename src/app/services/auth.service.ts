import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  Auth
} from 'firebase/auth';
import { app } from '../config/firebase-config';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth!: Auth;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.auth = getAuth(app);
      this.initAuthState();
    }
  }

  private initAuthState(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    onAuthStateChanged(this.auth, (user) => {
      this.currentUserSubject.next(user);
    });
  }

  // Iniciar sesión con email y contraseña
  async login(email: string, password: string): Promise<void> {
    try {
      if (!isPlatformBrowser(this.platformId)) {
        throw new Error('La autenticación solo está disponible en el navegador');
      }
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Registrar nuevo usuario
  async register(email: string, password: string): Promise<void> {
    try {
      if (!isPlatformBrowser(this.platformId)) {
        throw new Error('La autenticación solo está disponible en el navegador');
      }
      await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw this.handleAuthError(error);
    }
  }

  // Obtener usuario actual
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  // Manejar errores de autenticación
  private handleAuthError(error: any): Error {
    let errorMessage = 'Ocurrió un error durante la autenticación';

    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No existe una cuenta con este correo electrónico';
        break;
      case 'auth/wrong-password':
        errorMessage = 'La contraseña es incorrecta';
        break;
      case 'auth/email-already-in-use':
        errorMessage = 'Este correo electrónico ya está registrado';
        break;
      case 'auth/weak-password':
        errorMessage = 'La contraseña es demasiado débil';
        break;
      case 'auth/invalid-email':
        errorMessage = 'El correo electrónico no es válido';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Error de conexión. Verifica tu internet';
        break;
      default:
        errorMessage = error.message || errorMessage;
    }

    return new Error(errorMessage);
  }
}

