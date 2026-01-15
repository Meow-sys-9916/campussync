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

  // ============================================================
  // ✅ EVENT LIFECYCLE HELPERS
  // ============================================================

  /**
   * Check if an event date has passed (is in the past)
   */
  isEventPast(eventDate: string): boolean {
    const eventTime = new Date(eventDate).getTime();
    const nowTime = new Date().getTime();
    return eventTime < nowTime;
  }

  /**
   * Check if an event date is in the future
   */
  isEventUpcoming(eventDate: string): boolean {
    return !this.isEventPast(eventDate);
  }

  /**
   * Filter events: return only upcoming events (future dates)
   */
  filterUpcomingEvents(events: CampusEvent[]): CampusEvent[] {
    return events.filter(event => this.isEventUpcoming(event.date));
  }

  /**
   * Filter events: return only past events (past dates)
   */
  filterPastEvents(events: CampusEvent[]): CampusEvent[] {
    return events.filter(event => this.isEventPast(event.date));
  }

  /**
   * Check if current user has registered for an event
   */
  hasUserRegistered(event: CampusEvent, userId: string): boolean {
    if (!event.attendees || !userId) return false;
    return event.attendees.includes(userId);
  }
}