import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profilePhoto?: string;
  studentId?: string;
  major?: string;
  phone?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token && this.isTokenValid(token)) {
      this.loadCurrentUser();
    }
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, { email, password })
      .pipe(
        tap((response: any) => {
          if (response.success) {
            this.setToken(response.data.token);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, userData)
      .pipe(
        tap((response: any) => {
          if (response.success) {
            this.setToken(response.data.token);
            this.currentUserSubject.next(response.data.user);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('campusync_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('campusync_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('campusync_token', token);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && this.isTokenValid(token);
  }

  private isTokenValid(token: string): boolean {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  public loadCurrentUser(): void {
    this.http.get<any>(`${this.API_URL}/profile`)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currentUserSubject.next(response.data.user);
          }
        },
        error: () => this.logout()
      });
  }
}