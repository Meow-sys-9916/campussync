import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ FIXED INTERFACE
export interface CampusEvent {
  id?: string;
  _id?: string; // ✅ Add this to handle MongoDB responses
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image?: string;
  organizer?: any; // ✅ Changed to any to handle populated objects
  attendees?: string[];
  status?: string; 
  capacity?: number;
  registeredCount?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = 'http://localhost:3000/api/events';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  getEventById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createEvent(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data, { headers: this.getHeaders() });
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  // ✅ REGISTER FUNCTION
  registerEvent(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/register`, {}, { headers: this.getHeaders() });
  }

  // ✅ UNREGISTER FUNCTION
  unregisterEvent(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/unregister`, {}, { headers: this.getHeaders() });
  }
}