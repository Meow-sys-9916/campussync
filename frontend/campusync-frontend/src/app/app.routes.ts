import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';

export const routes: Routes = [
  // Redirect empty path to login
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  
  // Login Route
  { path: 'auth/login', component: LoginComponent },
  
  // We will add Dashboard and Profile later
];