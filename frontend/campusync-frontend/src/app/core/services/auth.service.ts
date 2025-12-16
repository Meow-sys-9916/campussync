import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (this.getToken()) {
      console.log('✅ Auth Service: Token found on startup');
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('📥 RAW Backend Response:', response);

        // 🔍 UNIVERSAL TOKEN FINDER
        // 1. Try finding token at the top level
        let token = response.token;
        let user = response.user;

        // 2. If not there, try finding it inside 'data' (Fix for your latest screenshot)
        if (!token && response.data) {
          console.log('🕵️ Token not at root, checking inside response.data...');
          token = response.data.token;
          user = response.data.user;
        }

        // 3. Save whatever we found
        if (token) {
          console.log('🔑 Token FOUND! Saving...');
          localStorage.setItem('token', token);
          this.currentUserSubject.next(user);
        } else {
          console.error('❌ CRITICAL: No token found in response!', response);
        }
      })
    );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}