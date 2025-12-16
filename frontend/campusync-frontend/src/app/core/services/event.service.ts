import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// ✅ Added 'export' so other files can see this
export interface CampusEvent {
  id?: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  capacity: number;
  registeredCount?: number;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

@Injectable({
  providedIn: 'root'
})
// ✅ Added 'export' so the Injector can find it
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

  getEvents(): Observable<{ success: boolean; data: CampusEvent[] }> {
    return this.http.get<{ success: boolean; data: CampusEvent[] }>(
      this.apiUrl, 
      { headers: this.getHeaders() }
    );
  }

  getEventById(id: string): Observable<{ success: boolean; data: CampusEvent }> {
    return this.http.get<{ success: boolean; data: CampusEvent }>(
      `${this.apiUrl}/${id}`, 
      { headers: this.getHeaders() }
    );
  }

  createEvent(eventData: any): Observable<any> {
    return this.http.post(
      this.apiUrl, 
      eventData, 
      { headers: this.getHeaders() }
    );
  }
}