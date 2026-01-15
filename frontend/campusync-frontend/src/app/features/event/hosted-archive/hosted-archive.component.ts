import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { EventService, CampusEvent } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-hosted-archive',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './hosted-archive.component.html',
  styleUrl: './hosted-archive.component.scss'
})
export class HostedArchiveComponent implements OnInit, OnDestroy {
  archivedHostedEvents: CampusEvent[] = [];
  isLoading = true;
  currentUserId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get current user ID
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUserId = user.id || user._id;
          this.loadArchivedHostedEvents();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadArchivedHostedEvents(): void {
    this.eventService.getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          const allEvents = response.data || response;
          // Filter events where:
          // 1. The current user is the organizer
          // 2. The event is in the past (archived)
          this.archivedHostedEvents = allEvents.filter((event: any) => {
            const orgId = (event.organizer && typeof event.organizer === 'object')
              ? event.organizer._id || event.organizer.id
              : event.organizer;
            // Only show past/archived events
            return orgId === this.currentUserId && this.eventService.isEventPast(event.date);
          });
          // Sort by date descending (most recent first)
          this.archivedHostedEvents.sort((a: any, b: any) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching archived events:', error);
          this.isLoading = false;
        }
      });
  }

  goBackToManageEvents(): void {
    this.router.navigate(['/my-events']);
  }

  getEventId(event: CampusEvent): string {
    return event.id || event._id || '';
  }
}
