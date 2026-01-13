import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
// ✅ IMPORT SNACKBAR MODULE
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
    MatSnackBarModule // ✅ Add this
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit, AfterViewInit {
  events: CampusEvent[] = [];
  isLoading = true;
  
  @ViewChild('carouselContainer') carouselContainer?: ElementRef;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // ✅ Inject SnackBar
  ) {}

  ngOnInit(): void {
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
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }

  register(eventId: string) {
    // We removed 'confirm()' for a faster UI. 
    // If you misclick, you can just unregister later (if we built that feature).
    
    this.eventService.registerEvent(eventId).subscribe({
      next: () => {
        // ✅ PROFESSIONAL NOTIFICATION
        this.snackBar.open('🎉 Successfully Registered!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['success-snackbar'] // You can style this in global css
        });
        
        this.loadEvents(); 
      },
      error: (err) => {
        const msg = err.error?.message || 'Registration failed';
        // ❌ ERROR NOTIFICATION
        this.snackBar.open(`⚠️ ${msg}`, 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

}