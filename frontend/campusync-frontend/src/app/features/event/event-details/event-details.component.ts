import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // ✅ Import
import { EventService, CampusEvent } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule, 
    RouterModule,
    MatSnackBarModule // ✅ Add Module
  ],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: CampusEvent | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private snackBar: MatSnackBar // ✅ Inject
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEvent(id);
    }
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (res: any) => {
        this.event = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  register() {
    if (!this.event?.id) return;

    this.eventService.registerEvent(this.event.id).subscribe({
      next: () => {
        // ✅ Success Pop-up
        this.snackBar.open('🎉 You are going!', 'Nice', {
          duration: 3000,
          verticalPosition: 'top'
        });
      },
      error: (err) => {
        // ❌ Error Pop-up
        this.snackBar.open('⚠️ ' + (err.error?.message || 'Failed'), 'Close', {
          duration: 3000
        });
      }
    });
  }
}