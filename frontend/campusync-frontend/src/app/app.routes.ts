import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EventListComponent } from './features/event/event-list/event-list.component';
import { CreateEventComponent } from './features/event/create-event/create-event.component';
import { EventDetailsComponent } from './features/event/event-details/event-details.component';

// ✅ IMPORT 'authGuard' (camelCase)
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  
  // ✅ APPLY [authGuard]
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'events', 
    component: EventListComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'events/create', 
    component: CreateEventComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'events/:id', 
    component: EventDetailsComponent, 
    canActivate: [authGuard] 
  }
];