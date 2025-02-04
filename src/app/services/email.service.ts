import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EmailService {
  private apiUrl = 'http://localhost:8081/api/message'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  getEmails(folder: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${folder}`);
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