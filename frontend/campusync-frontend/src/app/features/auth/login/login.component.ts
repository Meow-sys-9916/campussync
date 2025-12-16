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
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  
  hidePassword = true;
  isRegistering = false;
  semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''], 
      lastName: [''],
      studentId: [''],
      semester: [''],
      branch: [''],
      phoneNumber: ['']
    });
  }

  toggleRegistration() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
    const fields = ['firstName', 'lastName', 'studentId', 'semester'];
    
    if (this.isRegistering) {
      fields.forEach(f => this.loginForm.get(f)?.setValidators([Validators.required]));
    } else {
      fields.forEach(f => this.loginForm.get(f)?.clearValidators());
    }
    fields.forEach(f => this.loginForm.get(f)?.updateValueAndValidity());
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) return 'This field is required';
    if (control?.hasError('email')) return 'Not a valid email';
    if (control?.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }

 onSubmit() {
    // 🔍 DEBUG: Check if form is blocked
    if (this.loginForm.invalid) {
      console.log('❌ SUBMIT BLOCKED: Form is Invalid');
      
      // Print exactly which fields are failing
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control?.invalid) {
          console.error(`⚠️ Invalid Field: '${key}'`, control.errors);
          alert(`Please fix the '${key}' field!`); // Alert the user directly
        }
      });

      this.loginForm.markAllAsTouched(); // Force red error lines to appear
      return;
    }

    // --- Normal Logic Below ---
    this.isLoading = true;
    this.errorMessage = '';
    const formData = this.loginForm.value;

    console.log('📤 Sending Registration Data:', formData); // See what we are sending

    let authObs;

    if (this.isRegistering) {
      authObs = this.authService.register(formData);
    } else {
      authObs = this.authService.login({
        email: formData.email,
        password: formData.password
      });
    }

    authObs.subscribe({
      next: (response) => {
        console.log('✅ Success:', response);
        this.isLoading = false;
        
        if (this.isRegistering) {
          alert('Account created successfully! Please Sign In.');
          this.toggleRegistration(); // Switch back to login view
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error) => {
        console.error('❌ Request Failed:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.message || 'Request failed. Check console for details.';
      }
    });
  }
}