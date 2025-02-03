import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, {
      username,
      password,
    });
  }

  register(userData: any) {
    return this.http.post('http://localhost:8080/api/user/register', userData, { 
      responseType: 'text' as 'json' 
    });
  }
  setUserCredentials(username: string, password: string): void {
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
  }

  getUserCredentials(): { username: string, password: string } {
    const username = localStorage.getItem('username') || '';
    const password = localStorage.getItem('password') || '';
    return { username, password };
  }

  deleteUserCredentials(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
  }
}