import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // Importa el archivo de entorno
import { map } from 'rxjs/operators';  // Asegúrate de importar el operador 'map'

@Injectable({
  providedIn: 'root'
})
export class CreateEmailService {

  constructor(private http: HttpClient) { }
  
  // Método para obtener el id del país por username
  getPaisByUsername(username: string, credentials: string): Observable<string> {
    // Añadir las cabeceras necesarias para la solicitud GET
    const headers = new HttpHeaders({
      'Authorization': `Basic ${credentials}`,
      'X-Requested-With': 'XMLHttpRequest'
    });

    // Realizar la solicitud GET al backend para obtener el id del país
    return this.http.get<string>(`http://localhost:8080/api/user/getPais?username=${username}`, { headers });
  }

  // Método para crear el correo
  createEmail(): Observable<any> {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');
    
    if (!storedUsername || !storedPassword) {
      throw new Error('No se encontraron las credenciales en el localStorage');
    }
  
    const credentials = btoa(`${storedUsername}:${storedPassword}`);
  
    return new Observable((observer) => {
      (async () => {
        try {
          const paisId = await this.getPaisByUsername(storedUsername, credentials).toPromise();
          
          const emailData = {
            asunto: 'Borrador',
            cuerpoMensaje: 'Borrador',
            tipoCarpeta: 'Bor',
            usuario: storedUsername,
            idPais: paisId || 249
          };
  
          const headers = new HttpHeaders({
            'Authorization': `Basic ${credentials}`,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json'
          });
  
          // Enviar la solicitud POST para crear el correo
          const response = await this.http.post<any>(`http://localhost:8080/api/message/create`, emailData, { headers }).toPromise();
          
          if (response?.mensajePK?.idMensaje) {
            localStorage.setItem('emailId', response.mensajePK.idMensaje); // Guardar el idMensaje en localStorage
            console.log('ID del correo guardado en localStorage:', response.mensajePK.idMensaje);
          }
  
          observer.next(response);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      })();
    });
  }
  
}