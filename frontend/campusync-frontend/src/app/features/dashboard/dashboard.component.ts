  import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRippleModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Observable } from 'rxjs';

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
    RouterModule
  ],
  template: `
    <div class="dashboard-layout">
      <mat-toolbar class="navbar">
        <div class="logo-container">
          
          <img src="/assets/images/logo.png" 
               alt="CampusSync Logo" 
               onerror="this.style.display='none'">
          
    
        </div>
        
        <span class="spacer"></span>
        
        <button mat-icon-button (click)="logout()" matTooltip="Logout">
          <mat-icon>logout</mat-icon>
        </button>
      </mat-toolbar>

      <div class="content-container">
        
        <div class="hero-section">
          <h1>Hello, {{ (currentUser$ | async)?.firstName || 'Student' }}! 👋</h1>
          <p>Your campus command center. Discover events, join clubs, and stay synchronized.</p>
        </div>

        <div class="action-grid">
          <div class="action-card" matRipple routerLink="/events">
            <div class="icon-circle neon-pink">
              <mat-icon>event_available</mat-icon>
            </div>
            <h3>Browse Feed</h3>
            <p>Explore upcoming workshops, hackathons, and cultural fests.</p>
            <span class="link-text">View Events →</span>
          </div>

          <div class="action-card" matRipple routerLink="/events/create">
            <div class="icon-circle neon-blue">
              <mat-icon>add_circle_outline</mat-icon>
            </div>
            <h3>Host Event</h3>
            <p>Organize your own activity and invite peers to join.</p>
            <span class="link-text">Create Now →</span>
          </div>

          <div class="action-card" matRipple>
            <div class="icon-circle neon-orange">
              <mat-icon>person_outline</mat-icon>
            </div>
            <h3>My Profile</h3>
            <p>Manage your registrations and account settings.</p>
            <span class="link-text">Coming Soon</span>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-number">0</div>
            <div class="stat-label">Events Joined</div>
          </div>
          <div class="stat-card">
            <div class="stat-number">0</div>
            <div class="stat-label">Events Hosted</div>
          </div>
        </div>

      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  currentUser$!: Observable<any>; 

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout() {
    this.authService.logout();
  }
}