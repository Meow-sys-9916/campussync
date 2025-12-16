import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { AuthGuard } from './core/guards/auth.guard';
import { EventListComponent } from './features/event/event-list/event-list.component';
import { CreateEventComponent } from './features/event/create-event/create-event.component';

export const routes: Routes = [
  // 1. Default route -> Go to Login
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  
  // 2. Public Route
  { path: 'auth/login', component: LoginComponent },
  
  // 3. Protected Routes (Must have 'canActivate: [AuthGuard]')
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'events', 
    component: EventListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'events/create', 
    component: CreateEventComponent, 
    canActivate: [AuthGuard] 
  }
];