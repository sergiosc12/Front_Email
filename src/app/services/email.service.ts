import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/message';

  constructor(private http: HttpClient) {}
  
  getEmails(idType: string, username: string): Observable<Map<any, any>> {
    const url = `${this.apiUrl}/inbox?idType=${idType}&username=${username}`;
  
    // Retrieve credentials from localStorage
    const authUsername = localStorage.getItem("username");
    const authPassword = localStorage.getItem("password");
  
    // Encode credentials in Base64 for Basic Auth
    const authHeader = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;
  
    const headers = new HttpHeaders({
      "Authorization": authHeader
    });
  
    return this.http.get<Map<any, any>>(url, { headers });
  }
  
  

  sendEmail(email: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/send`, email);
  }
}