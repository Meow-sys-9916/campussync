import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // ... (Paste the rest of the class code from the previous message) ...
  // If you need the full class code again, let me know!
  loginForm!: FormGroup;
  isLoading = false;
  isRegistering = false;
  errorMessage = '';
  returnUrl = '';
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.createLoginForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      lastName: ['', [Validators.minLength(2), Validators.maxLength(50)]],
      studentId: ['', [Validators.minLength(3), Validators.maxLength(20)]],
      major: [''],
      phone: ['']
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  toggleRegistration(): void {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    this.loginForm.reset();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    if (this.isRegistering) {
      this.register();
    } else {
      this.login();
    }
  }

  private login(): void {
    const credentials = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (response: any) => {
        console.log('Login successful:', response);
        this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.message || 'Login failed. Please try again';
        this.isLoading = false;
      }
    });
  }

  private register(): void {
    const userData = {
      firstName: this.loginForm.get('firstName')?.value,
      lastName: this.loginForm.get('lastName')?.value,
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value,
      studentId: this.loginForm.get('studentId')?.value,
      major: this.loginForm.get('major')?.value,
      phone: this.loginForm.get('phone')?.value
    };
    this.authService.register(userData).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.snackBar.open('Registration successful!', 'Close', { duration: 3000 });
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (error: any) => {
        console.error('Registration failed:', error);
        this.errorMessage = error.error?.message || 'Registration failed. Please try again';
        this.isLoading = false;
      }
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) {
        return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        return `${fieldName} cannot exceed ${field.errors['maxlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}