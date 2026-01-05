import { Component, OnInit } from '@angular/core';
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
export class EventListComponent implements OnInit {
  events: CampusEvent[] = [];
  isLoading = true;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // ✅ Inject SnackBar
  ) {}

  ngOnInit(): void {
    this.loadEvents();
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

  logout() {
    this.authService.logout();
    this.snackBar.open('Logged out successfully', 'Bye!', { duration: 2000 });
  }
}