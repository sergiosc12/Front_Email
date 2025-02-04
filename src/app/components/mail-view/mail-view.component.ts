import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { HttpErrorResponse, HttpHeaders, HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-mail-view',
  templateUrl: './mail-view.component.html',
  styleUrls: ['./mail-view.component.css']
})
export class MailViewComponent {
  @Input() mail: any;
  @Input() recipients: string[] = [];
  @Input() type: string = '';

  @Output() closeView = new EventEmitter<void>();

  isForwarding: boolean = false;
  contacts: any[] = []; // This should be populated from your service
  selectedRecipients: string[] = [];
  showWarning: boolean = false;
  showSuccessModal = false;
  isForwardingSuccess = false;

  constructor(private contactoService: ContactoService, private mailService: EmailService) {}

  downloadFile(archivo: any) {
    console.log(`Downloading file: ${archivo.nomArchivo}`);
    // Implement actual file download logic
  }

  toggleForwarding() {
    this.isForwarding = !this.isForwarding;
    if (this.isForwarding) {
      this.loadContacts(); // Load contacts when forwarding is enabled
    }
  }

  closeModal() {
    this.isForwardingSuccess = false;
    this.onClose(); // Assuming onClose() already exists to close the mail view
  }

  toggleSelection(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedRecipients = Array.from(selectElement.selectedOptions).map(option => option.value);
  }

  sendForwardedMessage(): void {
    const forwardRequest = {
      messageId: this.mail.mensajePK.idMensaje,
      senderUsername: localStorage.getItem('username'),
      mailContactos:  this.extractEmails(this.selectedRecipients),
      idType: 'CO',
      username: localStorage.getItem('username'),
      newBody: this.mail.cuerpoMensaje
    };

    this.mailService.forwardMessage(forwardRequest).subscribe(
      (response) => {
        console.log('Message forwarded:', response);
        this.showSuccessModal = true;
        this.isForwardingSuccess = true;
      },
      (error) => {
        console.error('Error forwarding message:', error);
      }
    );
  }

  extractEmails(contactos: string[]): string[] {
    return contactos.map(contacto => {
      const match = contacto.match(/[\w.-]+@[\w.-]+\.\w+/);  // Expresión regular para capturar solo el correo
      return match ? match[0] : contacto;  // Retorna solo el correo si se encuentra, sino retorna el valor original
    });
  }

  onClose(): void {
    this.showSuccessModal = false;
    this.isForwarding = false;
    this.closeView.emit();
  }

  validateSendButton() {
    const hasRecipients = this.selectedRecipients.length > 0 ;
    this.showWarning = !hasRecipients;
  }

  loadContacts() {
    const storedUsername = localStorage.getItem('username');

    if (!storedUsername) {
      console.error('No username found in localStorage');
      return;
    }

    this.contactoService.getContacts(storedUsername).subscribe({
      next: (data) => {
        this.contacts = data;
        console.log('Contacts loaded:', this.contacts);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching contacts:', error);
      }
    });
  }
}
