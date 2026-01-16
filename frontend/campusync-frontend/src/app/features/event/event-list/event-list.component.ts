import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
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
  selector: 'app-event-list',
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
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit, AfterViewInit {
  events: CampusEvent[] = [];
  upcomingEvents: CampusEvent[] = [];
  isLoading = true;
  currentUserId: string | null = null;
  registeredEventIds: Set<string> = new Set();
  
  @ViewChild('carouselContainer') carouselContainer?: ElementRef;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Get current user ID from auth service
    this.authService.currentUser$.subscribe(user => {
      if (user && user._id) {
        this.currentUserId = user._id;
      }
    });
    
    this.loadEvents();
  }

  ngAfterViewInit(): void {
    // Defer layout measurement to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      this.updateCenterCard();
    });
  }

  onScroll(): void {
    this.updateCenterCard();
  }

  private updateCenterCard(): void {
    if (!this.carouselContainer) return;
    
    const carousel = this.carouselContainer.nativeElement;
    const cards = carousel.querySelectorAll('.event-card');
    
    if (cards.length === 0) return;
    
    const carouselCenter = carousel.scrollLeft + carousel.clientWidth / 2;
    
    cards.forEach((card: HTMLElement) => {
      const cardRect = card.getBoundingClientRect();
      const carouselRect = carousel.getBoundingClientRect();
      const cardCenter = card.offsetLeft + cardRect.width / 2 - carousel.scrollLeft;
      const distance = Math.abs(cardCenter - (carouselRect.width / 2));
      
      card.classList.remove('center-card');
      if (distance < cardRect.width / 2) {
        card.classList.add('center-card');
      }
    });
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        this.events = response.data || response;
        this.upcomingEvents = this.eventService.filterUpcomingEvents(this.events);
        this.buildRegisteredSet();
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }

  /**
   * Build a set of event IDs the current user has registered for
   */
  private buildRegisteredSet(): void {
    this.registeredEventIds.clear();
    if (!this.currentUserId) return;
    
    this.events.forEach(event => {
      if (this.eventService.hasUserRegistered(event, this.currentUserId!)) {
        this.registeredEventIds.add(event._id || event.id || '');
      }
    });
  }

  /**
   * Check if user has already registered for this event
   */
  hasRegistered(eventId: string): boolean {
    return this.registeredEventIds.has(eventId);
  }

  register(eventId: string): void {
    this.eventService.registerEvent(eventId).subscribe({
      next: () => {
        this.snackBar.open('Successfully Registered!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.registeredEventIds.add(eventId);
      },
      error: (err) => {
        const msg = err.error?.message || 'Registration failed';
        this.snackBar.open(`${msg}`, 'Close', {
          duration: 3000
        });
      }
    });
  }

}