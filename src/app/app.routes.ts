import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about';
import { UsoCancionesComponent } from './pages/uso-canciones/uso-canciones';
import { UsoReproductorComponent } from './pages/uso-reproductor/uso-reproductor';
import { CancionesComponent } from './pages/canciones/canciones.component';
import { ReproductorMultimedia } from './pages/reproductor-multimedia/reproductor-multimedia';
import { LoginComponent } from './pages/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'uso-canciones', component: UsoCancionesComponent },
      { path: 'uso-reproductor', component: UsoReproductorComponent },
      { path: 'canciones', component: CancionesComponent },
      { path: 'reproductor', component: ReproductorMultimedia }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
