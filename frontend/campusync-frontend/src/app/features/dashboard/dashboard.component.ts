import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import SnackBar
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
    MatSnackBarModule, // ✅ Add Module here
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  private userSub: Subscription = new Subscription();
  
  hostedCount = 0;
  totalEventsCount = 0;
  hostedEvents: CampusEvent[] = [];

  constructor(
    private authService: AuthService, 
    private eventService: EventService,
    private snackBar: MatSnackBar // ✅ Inject SnackBar
  ) {}

  ngOnInit() {
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
    // Keep confirm for safety (or remove if you want instant delete)
    if(!confirm('Are you sure you want to delete this event?')) return;

    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.hostedEvents = this.hostedEvents.filter(e => e.id !== eventId);
        this.hostedCount--;
        this.totalEventsCount--; 
        
        // ✅ Modern Notification instead of alert
        this.snackBar.open('🗑️ Event deleted successfully', 'Close', { 
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      },
      error: (err) => {
        this.snackBar.open('❌ Failed to delete event', 'Retry', { duration: 3000 });
      }
    });
  }

  logout() {
    this.authService.logout();
    // ✅ Optional: Show logout message
    this.snackBar.open('Logged out successfully', 'Bye!', { duration: 2000 });
  }
}