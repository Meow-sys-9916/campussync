import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
// ✅ Import path checks out: Up 3 levels -> core -> services
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.scss'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', Validators.required],
      venue: ['', Validators.required],
      category: ['General', Validators.required],
      capacity: [50, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        // ✅ Fixed implicit any error
        error: (err: any) => {
          console.error('Failed to create event', err);
          this.isSubmitting = false;
          alert('Failed to create event. Please try again.');
        }
      });
    }
  }
}