import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventService, CampusEvent } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    RouterModule,
    MatSnackBarModule
  ],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  event: CampusEvent | null = null;
  loading = true;
  error: string | null = null;
  currentUserId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Get current user ID
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user?.id || user?._id) {
          this.currentUserId = user.id || user._id;
        }
      });

    const id = this.route.snapshot.paramMap.get('id');
    console.log('🔍 Event Details loaded with ID:', id);
    
    if (id) {
      this.loadEvent(id);
    } else {
      this.error = 'No event ID provided';
      this.loading = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvent(id: string) {
    console.log('📡 Fetching event details for ID:', id);
    
    this.eventService.getEventById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          console.log('✅ Event data received:', response);
          // Handle both { data: event } and { success, data: event } responses
          this.event = response?.data || response;
          this.loading = false;
          
          if (!this.event) {
            console.error('❌ Event object is null/undefined in response');
            this.error = 'Event data not found';
          } else {
            console.log('✅ Event object set:', this.event);
          }
        },
        error: (err: any) => {
          console.error('❌ Error loading event:', err);
          this.error = err?.error?.message || 'Failed to load event details';
          this.loading = false;
        }
      });
  }

  isUserRegistered(): boolean {
    if (!this.event || !this.currentUserId) {
      return false;
    }

    // Check if user is in attendees list
    if (this.event.attendees && Array.isArray(this.event.attendees)) {
      return this.event.attendees.some(attendee => {
        const attendeeId = typeof attendee === 'object' ? ((attendee as any).id || (attendee as any)._id) : attendee;
        return attendeeId === this.currentUserId;
      });
    }

    return false;
  }

  register() {
    if (!this.event?.id && !this.event?._id) {
      console.error('No event ID available for registration');
      return;
    }

    const eventId = (this.event.id || this.event._id) as string;
    console.log('📝 Registering for event:', eventId);

    this.eventService.registerEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Registration successful');
          this.snackBar.open('🎉 You are registered!', 'Nice', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // Reload event to update registration status
          if (this.event?.id || this.event?._id) {
            this.loadEvent((this.event.id || this.event._id) as string);
          }
        },
        error: (err: any) => {
          console.error('❌ Registration error:', err);
          const msg = err?.error?.message || 'Registration failed';
          this.snackBar.open('⚠️ ' + msg, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  unregister() {
    if (!this.event?.id && !this.event?._id) {
      console.error('No event ID available for unregistration');
      return;
    }

    const eventId = (this.event.id || this.event._id) as string;
    console.log('📝 Unregistering from event:', eventId);

    this.eventService.unregisterEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          console.log('✅ Unregistration successful');
          this.snackBar.open('✓ You have unregistered', 'Got it', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
          // Reload event to update registration status
          if (this.event?.id || this.event?._id) {
            this.loadEvent((this.event.id || this.event._id) as string);
          }
        },
        error: (err: any) => {
          console.error('❌ Unregistration error:', err);
          const msg = err?.error?.message || 'Unregistration failed';
          this.snackBar.open('⚠️ ' + msg, 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }
}