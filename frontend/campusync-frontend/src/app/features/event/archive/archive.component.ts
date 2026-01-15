import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { EventService, CampusEvent } from '../../../core/services/event.service';

@Component({
  selector: 'app-archive',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './archive.component.html',
  styleUrl: './archive.component.scss'
})
export class ArchiveComponent implements OnInit, AfterViewInit {
  allEvents: CampusEvent[] = [];
  pastEvents: CampusEvent[] = [];
  isLoading = true;
  
  @ViewChild('carouselContainer') carouselContainer?: ElementRef;

  constructor(
    private eventService: EventService,
    private router: Router
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
        // Get all events from backend
        this.allEvents = response.data || response;
        
        // Filter to show only past events
        this.pastEvents = this.eventService.filterPastEvents(this.allEvents);
        
        // Sort by date descending (most recent first)
        this.pastEvents.sort((a, b) => {
          const dateA = new Date(a.date).getTime();
          const dateB = new Date(b.date).getTime();
          return dateB - dateA;
        });
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }

}
