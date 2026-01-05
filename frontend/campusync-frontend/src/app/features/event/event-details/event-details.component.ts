import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { EventService, CampusEvent } from '../../../core/services/event.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule, RouterModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event: CampusEvent | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadEvent(id);
  }

  loadEvent(id: string) {
    this.eventService.getEventById(id).subscribe({
      next: (res) => {
        this.event = res.data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  register() {
    if (!this.event?.id) return;
    if(!confirm('Confirm registration?')) return;

    this.eventService.registerEvent(this.event.id).subscribe({
      next: () => alert('✅ Successfully Registered!'),
      error: (err) => alert('❌ ' + (err.error?.message || 'Failed'))
    });
  }
}