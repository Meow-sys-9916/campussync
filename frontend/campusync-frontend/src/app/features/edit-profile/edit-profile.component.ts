import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  profileForm!: FormGroup;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      usn: ['', Validators.required],
      branch: ['', Validators.required],
      semester: ['', Validators.required]
    });

    // ✅ SINGLE SOURCE: AuthService only
    this.authService.currentUser$.subscribe(user => {
      if (!user) return;

      this.currentUser = user;
      this.populateForm(user);
    });
  }

  private populateForm(user: any): void {
    this.profileForm.patchValue({
      firstName: user.firstName ?? '',
      lastName: user.lastName ?? '',
      usn: user.usn ?? user.studentId ?? '',
      branch: user.branch ?? user.dept ?? user.major ?? '',
      semester: user.semester ?? ''
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    const formValue = this.profileForm.value;

    const updatedUser = {
      ...this.currentUser,

      // ✅ CANONICAL FIELDS
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      usn: formValue.usn,
      branch: formValue.branch,
      semester: formValue.semester
    };

    // Persist to backend and update app state
    const payload = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      studentId: updatedUser.usn,
      branch: updatedUser.branch,
      semester: updatedUser.semester
    };

    this.authService.updateProfile(payload).subscribe((res: any) => {
      // If backend returned a user object, authService already set it.
      // Otherwise fall back to local update to keep UX consistent.
      if (!res || !res.data || !res.data.user) {
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        this.authService.updateLocalUser(updatedUser);
      }

      this.router.navigate(['/dashboard']);
    });
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
