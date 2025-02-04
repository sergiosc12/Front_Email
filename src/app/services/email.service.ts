import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/message';

  constructor(private http: HttpClient) {}
  
  private getAuthHeaders(): HttpHeaders {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (!username || !password) {
      throw new Error('No se encontraron credenciales en el localStorage');
    }
    const credentials = btoa(`${username}:${password}`);
    return new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json'
    });
  }

  forwardMessage(requestBody: any): Observable<Map<any, any>> {
    const headers = this.getAuthHeaders();
    return this.http.post<Map<any, any>>(`${this.apiUrl}/forward`, requestBody, { headers });
  }

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
  getMessage(messageId: string, username: string, idType: string): Observable<any> {
    const url = `${this.apiUrl}/get?messageId=${messageId}&username=${username}&idType=${idType}`;
  
    // Retrieve credentials from localStorage
    const authUsername = localStorage.getItem("username");
    const authPassword = localStorage.getItem("password");
  
    // Encode credentials in Base64 for Basic Auth
    const authHeader = `Basic ${btoa(`${authUsername}:${authPassword}`)}`;
  
    const headers = new HttpHeaders({
      "Authorization": authHeader
    });
  
    return this.http.get<any>(url, { headers });
  }
  
  

  sendEmail(email: any): Observable<any> {
    // Recuperar las credenciales del localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const credentials = btoa(`${storedUsername}:${storedPassword}`);  // Usamos las credenciales del localStorage

    // Añadir las cabeceras necesarias
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest'
    });
    if (!storedUsername || !storedPassword) {
      throw new Error('No se encontraron credenciales en el localStorage');
    }
    return this.http.post<any>(`${this.apiUrl}/send`, email, { headers });
  }
}