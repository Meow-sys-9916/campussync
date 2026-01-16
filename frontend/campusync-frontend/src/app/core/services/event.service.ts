import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CampusEvent {
  id?: string;
  _id?: string;
  title: string;
  description: string;
  date: string;
  venue: string;
  category: string;
  image?: string;
  organizer?: any;
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

  registerEvent(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/register`, {}, { headers: this.getHeaders() });
  }

  unregisterEvent(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/unregister`, {}, { headers: this.getHeaders() });
  }

  isEventPast(eventDate: string): boolean {
    const eventTime = new Date(eventDate).getTime();
    const nowTime = new Date().getTime();
    return eventTime < nowTime;
  }

  isEventUpcoming(eventDate: string): boolean {
    return !this.isEventPast(eventDate);
  }

  filterUpcomingEvents(events: CampusEvent[]): CampusEvent[] {
    return events.filter(event => this.isEventUpcoming(event.date));
  }

  filterPastEvents(events: CampusEvent[]): CampusEvent[] {
    return events.filter(event => this.isEventPast(event.date));
  }

  hasUserRegistered(event: CampusEvent, userId: string): boolean {
    if (!event.attendees || !userId) return false;
    return event.attendees.includes(userId);
  }

  filterActiveEvents(events: CampusEvent[]): CampusEvent[] {
    return this.filterUpcomingEvents(events);
  }
}