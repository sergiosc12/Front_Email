import { Component } from '@angular/core';
import { EmailService } from '../services/email.service';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-gmail',
  templateUrl: './gmail.component.html',
  styleUrls: ['./gmail.component.css']
})
export class GmailComponent  implements OnInit {
  currentDate: Date = new Date(); // Inicializa la fecha actual
  emails: any[] = [];
  isComposerVisible = false; // Inicializa como false
  user: string = '';
  isContactComposerVisible = false;
  ngOnInit() {
    const storedUser = localStorage.getItem('username');
    console.log('Usuario recuperado del localStorage:', storedUser); // Verifica lo que se obtiene
    if (storedUser) {
      this.user = storedUser;
    } 
  }
  constructor(private emailService: EmailService) {}

  onFolderSelected(folder: string) {
    if (folder === 'crearContactos') {
      this.isContactComposerVisible = true;  // Muestra el formulario de contactos
      this.isComposerVisible = false;  // Oculta el redactor de correos si está abierto
    } else {
      this.isContactComposerVisible = false;
      // Aquí puedes manejar otros cambios de vista
    }
  }
  

  getEmails(folder: string) {
    this.emailService.getEmails(folder).subscribe(data => {
      this.emails = data; // Actualiza la lista de correos
    });
  }

  showComposer() {
    this.isComposerVisible = true; // Muestra el compositor
  }

  onCreateContact() {
    console.log("✅ Evento createContact recibido en GmailComponent");
    this.isContactComposerVisible = true;
    this.isComposerVisible = false;
  }

  onComposeEmail() {
    this.showComposer(); // Llama al método para mostrar el compositor
  }

  onEmailSent() {
    this.isComposerVisible = false; // Oculta el compositor después de enviar
    this.getEmails('Recibidos'); // Actualiza la lista de correos
  }

  onEmailSelected(email: any) {
    // Aquí puedes manejar la lógica para mostrar el correo seleccionado
    console.log('Correo seleccionado:', email);
  }

  onContactSelected(contact:any ){
    
  }
}