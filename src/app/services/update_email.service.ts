// contacto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactoService {

  private apiUrl = 'http://localhost:{{port}}/api/message';

  constructor(private http: HttpClient) {}

  // Método para actualizar el mensaje
  updateMessage(messageId: string, username: string, updatedField: any): Observable<any> {
    const url = `${this.apiUrl}/update`;
    const body = { messageId, username, updatedField };
    return this.http.put<any>(url, body);
  }
}
