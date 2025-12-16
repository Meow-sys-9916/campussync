import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { EventService, CampusEvent } from '../../../core/services/event.service';
import { AuthService } from '../../../core/services/auth.service'; // ✅ Added Import

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    RouterModule
  ],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss'
})
export class EventListComponent implements OnInit {
  events: CampusEvent[] = [];
  isLoading = true;

  constructor(
    private eventService: EventService,
    private authService: AuthService, // ✅ Injected Auth Service
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe({
      next: (response: any) => {
        // Handle both response formats just in case
        this.events = response.data || response; 
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
        this.isLoading = false;
      }
    });
  }

  // ✅ Added Logout Function
  logout() {
    this.authService.logout();
  }
}