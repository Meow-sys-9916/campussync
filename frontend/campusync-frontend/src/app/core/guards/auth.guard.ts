import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // 1. Check if the "token" exists in the browser
    if (this.authService.isAuthenticated()) {
      return true; // ✅ Let them pass!
    }

    // 2. If no token, kick them back to login
    console.log('⛔ AuthGuard: Access Denied, Redirecting to Login');
    this.router.navigate(['/auth/login']);
    return false;
  }
}