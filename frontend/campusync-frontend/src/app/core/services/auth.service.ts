import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // ✅ Added HttpHeaders
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs'; // ✅ Added catchError, of
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // ✅ RESTORE SESSION: If token exists on startup, fetch user profile
    if (this.getToken()) {
      console.log('✅ Auth Service: Token found, restoring session...');
      this.getProfile().subscribe({
        next: (user) => {
          console.log('👤 User session restored:', user);
          this.currentUserSubject.next(user);
        },
        error: (err) => {
          console.error('❌ Session expired or invalid token', err);
          this.logout(); // Force logout if token is bad
        }
      });
    }
  }

  // ✅ NEW METHOD: Fetch Profile to restore user state
  getProfile(): Observable<any> {
    const token = this.getToken();
    // Create headers with the token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    // Call your backend profile endpoint
    return this.http.get<{success: boolean, data: {user: any}}>(`${this.apiUrl}/profile`, { headers }).pipe(
      tap(res => {
        // Assume backend returns { success: true, data: { user: {...} } }
        if (res.success && res.data && res.data.user) {
          this.currentUserSubject.next(res.data.user);
        }
      }),
      // Return the user object directly for the subscription in constructor
      tap((res: any) => res.data?.user || res.user), 
      catchError(err => {
        return of(null);
      })
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        console.log('📥 RAW Backend Response:', response);

        // 🔍 UNIVERSAL TOKEN FINDER
        let token = response.token;
        let user = response.user;

        if (!token && response.data) {
          console.log('🕵️ Token not at root, checking inside response.data...');
          token = response.data.token;
          user = response.data.user;
        }

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