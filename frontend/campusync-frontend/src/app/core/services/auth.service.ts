import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<any>(
    JSON.parse(localStorage.getItem('currentUser') || 'null')
  );

  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    if (this.getToken()) {
      this.restoreSession();
    }
  }

  private restoreSession(): void {
    this.getProfile().subscribe({
      next: (res) => {
        if (!res?.data?.user) return;

        const backendUser = res.data.user;
        const localUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        const mergedUser = {
          ...backendUser,
          studentId: backendUser.studentId ?? localUser.studentId,
          branch: backendUser.branch ?? localUser.branch,
          semester: backendUser.semester ?? localUser.semester,
          usn: backendUser.studentId ?? localUser.usn
        };

        this.setUser(mergedUser);
      },
      error: () => this.logout()
    });
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError(() => of(null))
    );
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((res: any) => {
        const token = res.token || res.data?.token;
        const user = res.user || res.data?.user;

        if (!token || !user) return;

        localStorage.setItem('token', token);

        const finalUser = {
          ...user,
          usn: user.studentId
        };

        this.setUser(finalUser);
      })
    );
  }

  register(formData: any): Observable<any> {
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      studentId: formData.studentId,
      branch: formData.branch,
      semester: formData.semester
    };

    return this.http.post<any>(`${this.apiUrl}/register`, payload).pipe(
      tap(res => {
        if (res?.data?.user) {
          const user = {
            ...res.data.user,
            usn: payload.studentId
          };

          this.setUser(user);
        }
      })
    );
  }

  setUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateLocalUser(updatedUser: any): void {
    this.setUser(updatedUser);
  }

  updateProfile(payload: any) {
    const token = this.getToken();
    const headers = token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : undefined;

    return this.http.put<any>(`${this.apiUrl}/profile`, payload, { headers }).pipe(
      tap(res => {
        const returned = res?.data?.user;
        if (returned) {
          // Ensure frontend aliases are present
          const final = { ...returned, usn: returned.studentId ?? returned.usn };
          this.setUser(final);
        }
      }),
      catchError(err => of(err))
    );
  }

  logout(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
