import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { EventService, CampusEvent } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-my-registered-events',
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
  templateUrl: './my-registered-events.component.html',
  styleUrl: './my-registered-events.component.scss'
})
export class MyRegisteredEventsComponent implements OnInit, OnDestroy {
  allEvents: CampusEvent[] = [];
  registeredEvents: CampusEvent[] = [];
  isLoading = true;
  currentUserId: string = '';
  viewMode: 'upcoming' | 'archived' = 'upcoming';
  private destroy$ = new Subject<void>();

  constructor(
    public eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user?.id || user?._id) {
          this.currentUserId = user.id || user._id;
          this.loadEvents();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    this.eventService.getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.allEvents = response.data || response;
          this.filterRegisteredEvents();
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching events:', error);
          this.isLoading = false;
          this.snackBar.open('Failed to load events', 'Close', { duration: 3000 });
        }
      });
  }

  private filterRegisteredEvents(): void {
    let allRegisteredEvents = this.allEvents.filter(event => {
      if (event.attendees && Array.isArray(event.attendees)) {
        const isRegistered = event.attendees.some(attendee => {
          const attendeeId = typeof attendee === 'object' ? ((attendee as any).id || (attendee as any)._id) : attendee;
          return attendeeId === this.currentUserId;
        });
        return isRegistered;
      }
      return false;
    });

    if (this.viewMode === 'upcoming') {
      this.registeredEvents = allRegisteredEvents.filter(event => 
        this.eventService.isEventUpcoming(event.date)
      );
    } else {
      this.registeredEvents = allRegisteredEvents.filter(event => 
        !this.eventService.isEventUpcoming(event.date)
      );
    }

    this.registeredEvents.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return this.viewMode === 'upcoming' 
        ? dateA - dateB
        : dateB - dateA;
    });
  }

  getEventId(event: CampusEvent): string {
    return event.id || event._id || '';
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'upcoming' ? 'archived' : 'upcoming';
    this.filterRegisteredEvents();
  }

  unregisterEvent(eventId: string): void {
    console.log('Unregistering from event:', eventId);

    this.eventService.unregisterEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('Unregistration successful');
          this.snackBar.open('✓ You have unregistered', 'Got it', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // Remove event from the list
          this.registeredEvents = this.registeredEvents.filter(event => 
            (event.id || event._id) !== eventId
          );
        },
        error: (err: any) => {
          console.error('Unregistration error:', err);
          const msg = err?.error?.message || 'Unregistration failed';
          this.snackBar.open(msg, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}
