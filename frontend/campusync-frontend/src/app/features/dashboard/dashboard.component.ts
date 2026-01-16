import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EventService, CampusEvent } from '../../core/services/event.service'; 
import { Subscription, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  private userSub: Subscription = new Subscription();
  private destroy$ = new Subject<void>();
  
  // Display normalization for USN and Branch
  displayUsn: string = 'No USN';
  displayBranch: string = 'General';
  
  // Counters
  hostedCount: number = 0;
  registeredCount: number = 0; // Events Joined
  totalEventsCount: number = 0;
  hostedEvents: CampusEvent[] = [];
  
  // Next Event Tracker
  nextEvent: CampusEvent | null = null;

  constructor(
    private authService: AuthService, 
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userSub = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Normalize display fields from user data
      if (user) {
        this.displayUsn = user.studentId || user.usn || 'No USN';
        this.displayBranch = user.branch || user.major || 'General';
        const userId = user.id || user._id; 
        if (userId) {
          this.fetchDashboardStats(userId);
          // Auto-refresh stats every 30 seconds to sync with other tabs/windows
          interval(30000)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => this.fetchDashboardStats(userId));
        }
      } else {
        this.displayUsn = 'No USN';
        this.displayBranch = 'General';
      }
    });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  getEventId(event: any): string {
    return event ? (event.id || event._id) : '';
  }

  fetchDashboardStats(userId: string) {
    this.eventService.getEvents().subscribe({
      next: (res: any) => {
        if (res.success && Array.isArray(res.data)) {
          const allEvents: CampusEvent[] = res.data;
          
          // 1. Total Events (upcoming/active only - exclude archived/past)
          const upcomingEvents = allEvents.filter(e => this.eventService.isEventUpcoming(e.date));
          this.totalEventsCount = upcomingEvents.length;

          // 2. Hosted Events (all user's hosted events)
          this.hostedEvents = allEvents.filter((e: any) => {
            const orgId = (e.organizer && typeof e.organizer === 'object') 
                          ? e.organizer._id 
                          : e.organizer;
            return orgId === userId;
          });
          this.hostedCount = this.hostedEvents.length;

          // 3. Registered Events (Bottom Right Counter & Next Event)
          const registeredIds = this.currentUser?.registeredEvents || [];
          
          const registered = upcomingEvents.filter((e: any) => {
             const isRegistered = registeredIds.includes(e.id) || registeredIds.includes(e._id);
             const isAttendee = e.attendees && e.attendees.includes(userId);
             return isRegistered || isAttendee;
          });

          // Events Joined Count (only upcoming/active)
          this.registeredCount = registered.length;
          
          // Next Event Logic (from upcoming registered events only)
          this.nextEvent = registered
            .filter((e: any) => new Date(e.date).getTime() > Date.now()) 
            .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())[0] || null;
        }
      },
      error: (err) => {
        console.error('Failed to load stats', err);
        this.totalEventsCount = 0;
        this.hostedCount = 0;
        this.registeredCount = 0;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Bye!', { duration: 2000 });
  }
}