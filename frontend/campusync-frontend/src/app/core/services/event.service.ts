import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ UPDATED INTERFACE: Added 'status', 'capacity', 'registeredCount'
export interface CampusEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image?: string;
  organizer?: string;
  attendees?: string[];
  
  // These were missing and causing errors:
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

  registerEvent(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/register`, {}, { headers: this.getHeaders() });
  }
}