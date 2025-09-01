import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PreguntasComponent } from './pages/preguntas/preguntas.component';
import { InfoComponent } from './pages/info/info.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Ruta para la página de inicio
  { path: 'preguntas', component: PreguntasComponent }, // Ruta para test
  { path: 'info', component: InfoComponent }, // Ruta para info
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirección en caso de rutas inválidas
];
