import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:3000/emails'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  getEmails(folder: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${folder}`);
  }

  sendEmail(email: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, email);
  }
}