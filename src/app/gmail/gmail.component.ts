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
  type: string = 'Rec';
  selectedMail: any = null;
  selectedRecipients: string[] = [];


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
    this.type = folder
    this.emailService.getEmails(folder, this.user).subscribe(data => {
      // Map the email object and keep fechaAccion and horaAccion for formatting in InboxComponent
      this.emails = Object.entries(data).map(([sender, email]) => ({
        sender,
        subject: email.asunto, // Use 'asunto' for subject
        date:  email.fechaAccion.split("T")[0] + " " + email.horaAccion, // Keep original properties for time
        id : email.mensajePK.idMensaje
      }));
      console.log(this.emails);
    }); 
  }
  getSenderLabel(): string {
    if (this.type === 'Rec') {
      return 'Remitente';
    } else if (this.type === 'Env') {
      return 'Destinatario';
    } else if (this.type === 'Bor') {
      return 'ID Mensaje';  
    }
    return 'Sender'; // Default fallback label
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

  onEmailSelected(mail: any) {
    this.emailService.getMessage(mail.id, this.user, this.type).subscribe(
      (fullMail) => {
        // Extract key-value pairs from the map
        const entries = Object.entries(fullMail);
        
        if (entries.length === 0) {
          console.error("Empty response received.");
          return;
        }
  
        const [key, message] = entries[0]; // Extract the first (and only) key-value pair
  
        // Assign message object
        this.selectedMail = message;
  
        // Determine recipients based on the folder type
        if (this.type === 'Rec') {
          // 'Rec' folder: The key is the sender's email, so recipients are empty
          this.selectedRecipients = [key];
        } else if (this.type === 'Env') {
          // 'Env' folder: The key is an array of recipients
          this.selectedRecipients = Array.isArray(key) ? key : [key];
        } else if (this.type === 'Bor') {
          // 'Bor' folder: The key is just the messageId, no special recipient handling
          this.selectedRecipients = [];
        }
  
        console.log("Final selectedMail:", this.selectedMail);
        console.log("Final selectedRecipients:", this.selectedRecipients);
      },
      (error) => {
        console.error('Error fetching email:', error);
      }
    );
  }
  
  

  onContactSelected(contact:any ){
    
  }
}