import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  isRegistering = false;
  isLoading = false;
  hidePassword = true;
  errorMessage = '';

  semesters = ['1','2','3','4','5','6','7','8'];

  // 🔥 TWO FORMS (FINAL FIX)
  loginForm: FormGroup;
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      studentId: ['', Validators.required],
      branch: ['', Validators.required],
      semester: ['', Validators.required],
      phoneNumber: ['']
    });
  }

  toggleRegistration() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  getFieldError(fieldName: string): string {
  const form = this.isRegistering ? this.registerForm : this.loginForm;
  const control = form.get(fieldName);

  if (!control || !control.touched) return '';

  if (control.hasError('required')) return 'This field is required';
  if (control.hasError('email')) return 'Not a valid email';
  if (control.hasError('minlength')) return 'Password must be at least 6 characters';

  return '';
}


  onSubmit() {
    this.errorMessage = '';
    this.isLoading = true;

    if (this.isRegistering) {
      if (this.registerForm.invalid) {
        this.registerForm.markAllAsTouched();
        this.isLoading = false;
        return;
      }

      const v = this.registerForm.getRawValue();
      console.log('✅ FINAL REGISTER DATA:', v);

      this.authService.register(v).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Account created successfully! Please Sign In.');
          this.toggleRegistration();
        },
        error: err => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Registration failed';
        }
      });

    } else {
      if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        this.isLoading = false;
        return;
      }

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: err => {
          this.isLoading = false;
          this.errorMessage = err.error?.message || 'Login failed';
        }
      });
    }
  }
}
