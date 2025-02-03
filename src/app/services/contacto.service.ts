// contacto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  constructor(private http: HttpClient) { }

  // Método para obtener los contactos con Basic Auth usando las credenciales del localStorage
  getContacts(username: string): Observable<any[]> {
    // Recuperar las credenciales del localStorage
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (!storedUsername || !storedPassword) {
      throw new Error('No se encontraron credenciales en el localStorage');
    }

    // Codifica el username y la contraseña en base64
    const credentials = btoa(`${storedUsername}:${storedPassword}`);  // Usamos las credenciales del localStorage

    // Añadir las cabeceras necesarias
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest'
    });

    // Realizar la solicitud GET con las cabeceras de autenticación
    return this.http.get<any[]>(`http://localhost:8081/api/contact/getAll?username=${username}`, { headers });
  }
}
