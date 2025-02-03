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

  ngOnInit() {
    const storedUser = localStorage.getItem('username');
    console.log('Usuario recuperado del localStorage:', storedUser); // Verifica lo que se obtiene
    if (storedUser) {
      this.user = storedUser;
    } 
  }
  constructor(private emailService: EmailService) {}

  onFolderSelected(folder: string) {
    this.getEmails(folder); // Obtiene los correos de la carpeta seleccionada
    this.isComposerVisible = false; // Asegúrate de ocultar el compositor
  }

  getEmails(folder: string) {
    this.emailService.getEmails(folder, this.user).subscribe(data => {
      // Map the email object and keep fechaAccion and horaAccion for formatting in InboxComponent
      this.emails = Object.entries(data).map(([sender, email]) => ({
        sender,
        asunto: email.asunto, // Use 'asunto' for subject
        fechaAccion: email.fechaAccion, // Keep original properties for date formatting
        horaAccion: email.horaAccion, // Keep original properties for time
      }));
      
      console.log(this.emails);
    });
  }
  


  showComposer() {
    this.isComposerVisible = true; // Muestra el compositor
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
}