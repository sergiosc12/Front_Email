import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
  })
  export class MessageService {
    constructor(private http: HttpClient) {}
  
    addAttachment(attachmentDTO: any) {
      return this.http.post('/addAttachment', attachmentDTO);
    }
  }