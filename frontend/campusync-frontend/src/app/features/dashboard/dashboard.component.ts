import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EventService, CampusEvent } from '../../core/services/event.service'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatToolbarModule,
    MatRippleModule,
    MatTooltipModule,
    MatListModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  // ✅ FIX 1: Defined the plain variable 'currentUser' that your HTML needs
  currentUser: any = null;
  private userSub: Subscription = new Subscription();
  
  hostedCount = 0;
  totalEventsCount = 0;
  
  hostedEvents: CampusEvent[] = [];

  constructor(
    private authService: AuthService, 
    private eventService: EventService 
  ) {}

  ngOnInit() {
    // ✅ FIX 2: Subscribe to the observable and store data in 'currentUser'
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.fetchDashboardStats(user.id || user._id);
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  fetchDashboardStats(userId: string) {
    this.eventService.getEvents().subscribe({
      next: (res: any) => {
        if (res.success) {
          // ✅ FIX 3: Explicitly typed 'events' as CampusEvent[]
          // This stops the "Parameter 'e' implicitly has an 'any' type" error
          const events: CampusEvent[] = res.data;
          
          this.totalEventsCount = events.length;

          if (userId) {
            this.hostedEvents = events.filter((e: CampusEvent) => e.organizer === userId);
            this.hostedCount = this.hostedEvents.length;
          }
        }
      },
      error: (err) => console.error('Failed to load stats', err)
    });
  }

  deleteEvent(eventId: string) {
    if(!confirm('Are you sure you want to delete this event?')) return;

    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.hostedEvents = this.hostedEvents.filter(e => e.id !== eventId);
        this.hostedCount--;
        this.totalEventsCount--; 
        alert('Event deleted!');
      },
      error: (err) => alert('Failed to delete event')
    });
  }

  logout() {
    this.authService.logout();
  }
}