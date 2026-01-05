import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  // 1. Inject dependencies (cannot use constructor here)
  const router = inject(Router);

  // 2. Check for token in LocalStorage
  const token = localStorage.getItem('token');

  if (token) {
    // ✅ User is logged in, allow access
    return true;
  } else {
    // ❌ No token, redirect to login page
    router.navigate(['/login']);
    return false;
  }
};