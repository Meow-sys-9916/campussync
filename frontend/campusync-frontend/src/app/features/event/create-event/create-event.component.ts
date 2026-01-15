import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
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
  minDate: Date; // Minimum selectable date (today)

  hostingClubs: string[] = [
    'BMSCE ACM STUDENT CHAPTER',
    'AQUILA AEROSPACE',
    'AUGMENT.AI',
    'CODE IO',
    'TEAM CODELOCKED',
    'FALCONS',
    'BULLZ RACING',
    'CHIRANTANA KANNADA CLUB',
    'DANZ ADDIX',
    'DSYNC',
    'EEE ASSOCIATION',
    'ELSOC',
    'FINE ARTS CLUB',
    'GDSC',
    'GRADIENT',
    'THE GROOVE HOUSE',
    'IEEE COMPUTER SOCIETY',
    'IEEE COMSOC',
    'IEEE PELS AND IES',
    'IEEE PELS AND SPONSORS COUNCIL',
    'BMSCE IEEE STUDENT BRANCH',
    'IEEE SSIT',
    'BMSCE IEEE WIE',
    'IIC',
    'INKSANITY',
    'LEO SATVA',
    'MANUSMARAN',
    'MELTON FOUNDATION',
    'MOUNTAINEERING CLUB',
    'BMS MUNSOC',
    'NINAAD',
    'NSS',
    'TEAM PANACHE',
    'PARAMVAH',
    'PENTAGRAM',
    'PROTOCOL',
    'PRAVRUTTHI CLUB',
    'QCAINE',
    'RESPAWN CLUB',
    'ROBOTICS',
    'ROCKETRY',
    'ROBOTICS CLUB',
    'SAMSKRUTHI SAMBHRAMA',
    'SENSORED',
    'SINGULARITY',
    'SYNAPSE',
    'UPAGRAHA',
    'BUSINESS INSIGHTS',
    'MECHANICAL ENGINEERING ASSOCIATION',
    'VARIANCE',
    'VAK',
    'IEEE SSCS',
    'IEEE SPS',
    'AEROBMSCE',
    'WAKAI OTAKU',
    'NCC',
    'CORTECHS'
  ];

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    // Set minimum date to today (prevent past dates)
    this.minDate = new Date();
    this.minDate.setHours(0, 0, 0, 0);

    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', [Validators.required, this.futureDateValidator.bind(this)]],
      venue: ['', Validators.required],
      category: ['General', Validators.required],
      hostingClub: ['', Validators.required],
      capacity: [50, [Validators.required, Validators.min(1)]]
    });
  }

  /**
   * ✅ VALIDATOR: Ensure selected date is not in the past
   */
  private futureDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const selectedDate = new Date(control.value);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If selected date is before today, return error
    if (selectedDate < today) {
      return { pastDate: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      this.isSubmitting = true;
      this.eventService.createEvent(this.eventForm.value).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err: any) => {
          console.error('Failed to create event', err);
          this.isSubmitting = false;
          alert('Failed to create event. Please try again.');
        }
      });
    }
  }
}