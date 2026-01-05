import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { CreateEventComponent } from './features/event/create-event/create-event.component';
import { EventListComponent } from './features/event/event-list/event-list.component';
import { EventDetailsComponent } from './features/event/event-details/event-details.component';

// ✅ IMPORT THE CONSTANT (not a class)
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // ✅ Usage is the same: canActivate: [authGuard]
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'events', component: EventListComponent, canActivate: [authGuard] },
  { path: 'events/create', component: CreateEventComponent, canActivate: [authGuard] },
  { path: 'events/:id', component: EventDetailsComponent, canActivate: [authGuard] }
];