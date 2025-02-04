import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8081/api/contact';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const credentials = btoa(`${storedUsername}:${storedPassword}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest'
    });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8081/api/user/getUsers`, { headers: this.getAuthHeaders() });
  }

  addContact(contactUserId: string, selfUsername: string): Observable<any> {
    const body = { contactUserId, selfUsername };
    return this.http.post<any>(`${this.apiUrl}/add`, body, { headers: this.getAuthHeaders() });
  }

  getAllContacts(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/getAll?username=${username}`, { headers: this.getAuthHeaders() });
  }
}
