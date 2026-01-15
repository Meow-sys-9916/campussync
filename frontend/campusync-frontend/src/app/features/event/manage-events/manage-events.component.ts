import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { EventService, CampusEvent } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss'
})
export class ManageEventsComponent implements OnInit {
  hostedEvents: CampusEvent[] = [];
  isLoading = true;
  currentUserId: string | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get current user ID
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserId = user.id || user._id;
        this.loadHostedEvents();
      }
    });
  }

  loadHostedEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        const allEvents = response.data || response;
        // Filter events where:
        // 1. The current user is the organizer
        // 2. The event is upcoming (not past/archived)
        this.hostedEvents = allEvents.filter((event: any) => {
          const orgId = (event.organizer && typeof event.organizer === 'object')
            ? event.organizer._id || event.organizer.id
            : event.organizer;
          // Only show active/upcoming events
          return orgId === this.currentUserId && this.eventService.isEventUpcoming(event.date);
        });
        // Sort by date (upcoming first)
        this.hostedEvents.sort((a: any, b: any) => {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }

  deleteEvent(eventId: string): void {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        this.snackBar.open('✅ Event deleted successfully', 'Close', {
          duration: 3000
        });
        this.loadHostedEvents();
      },
      error: (err) => {
        const msg = err?.error?.message || 'Failed to delete event';
        this.snackBar.open('❌ ' + msg, 'Close', {
          duration: 3000
        });
      }
    });
  }

  createEvent(): void {
    this.router.navigate(['/events/create']);
  }

  getEventId(event: any): string {
    return event.id || event._id || '';
  }
}
