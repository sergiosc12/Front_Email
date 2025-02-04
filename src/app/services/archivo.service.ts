import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {

  private apiUrl = 'http://localhost:8081/api/message'; // Asegúrate de usar la URL correcta

  constructor(private http: HttpClient) {}

  // Método para agregar archivo adjunto
  addAttachment(attachmentDTO: any): Observable<any> {
    // Recuperar las credenciales del localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const credentials = btoa(`${storedUsername}:${storedPassword}`);  // Usamos las credenciales del localStorage

    // Añadir las cabeceras necesarias
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest'
    });
    return this.http.post<any>(`${this.apiUrl}/addAttachment`, attachmentDTO, { headers });
  }
  removeAttachment(attachmentDTO: any): Observable<any> {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    const credentials = btoa(`${storedUsername}:${storedPassword}`);
  
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest'
    });
  
    return this.http.delete(`${this.apiUrl}/removeAttachment`, { headers, body: attachmentDTO, responseType: 'text' });
  }
  
}


