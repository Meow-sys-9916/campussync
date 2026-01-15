import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EventListComponent } from './features/event/event-list/event-list.component';
import { CreateEventComponent } from './features/event/create-event/create-event.component';
import { EventDetailsComponent } from './features/event/event-details/event-details.component';
import { ManageEventsComponent } from './features/event/manage-events/manage-events.component';
import { MyRegisteredEventsComponent } from './features/event/my-registered-events/my-registered-events.component';
import { ArchiveComponent } from './features/event/archive/archive.component';
import { EditProfileComponent } from './features/edit-profile/edit-profile.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'edit-profile', 
    component: EditProfileComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'events', 
    component: EventListComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'archive', 
    component: ArchiveComponent, 
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
  },
  { 
    path: 'my-events', 
    component: ManageEventsComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'my-registered-events', 
    component: MyRegisteredEventsComponent, 
    canActivate: [authGuard] 
  }
];