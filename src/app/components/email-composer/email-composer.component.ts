import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';

@Component({
  selector: 'app-email-composer',
  templateUrl: './email-composer.component.html',
  styleUrls: ['./email-composer.component.css']
})
export class EmailComposerComponent implements OnInit {
  @Output() emailSent = new EventEmitter<void>();
  recipient: string = '';
  subject: string = '';
  message: string = '';
  selectedRecipients: string[] = [];  // Este array mantiene los correos de los destinatarios seleccionados
  selectedCC: string[] = [];         // Este array mantiene los correos de los CC seleccionados
  selectedBCC: string[] = [];        // Este array mantiene los correos de los CCO seleccionados
  contacts: any[] = [];

  constructor(private contactoService: ContactoService) {}

  ngOnInit() {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No se encontró el nombre de usuario en el localStorage');
      return;
    }

    // Obtener los contactos del usuario
    this.contactoService.getContacts(username).subscribe(
      (contacts) => {
        this.contacts = contacts.map(contact => ({
          ...contact,
          selected: false // Inicializa el estado de selección de cada contacto
        }));
      },
      (error) => {
        console.error('Error al obtener los contactos:', error);
      }
    );
  }

  // Función para agregar o quitar contactos seleccionados
  toggleSelection(event: any, type: string) {
    const selectedOptions = event.target.selectedOptions;  // Accedemos a los elementos seleccionados
    let selectedArray: string[] = [];

    // Dependiendo del tipo de campo (Destinatarios, CC, CCO), se actualiza el array correspondiente
    for (let option of selectedOptions) {
      selectedArray.push(option.value);
    }

    if (type === 'recipients') {
      this.selectedRecipients = selectedArray;
    } else if (type === 'cc') {
      this.selectedCC = selectedArray;
    } else if (type === 'bcc') {
      this.selectedBCC = selectedArray;
    }
  }

  createDraft() {
    const emailData = {
      recipients: this.selectedRecipients,
      cc: this.selectedCC,
      bcc: this.selectedBCC,
      subject: this.subject,
      message: this.message,
      date: new Date(),
      sender: localStorage.getItem('username'),
      tipoCarpeta: "Bor"  // Este es el estado de borrador
    };

    console.log('Borrador creado:', emailData);

    // Aquí puedes hacer una solicitud HTTP para guardar el borrador
    // this.messageService.createDraft(emailData).subscribe(...);

    this.emailSent.emit();
    this.resetForm();
  }

  sendEmail() {
    const emailData = {
      recipients: this.selectedRecipients,
      cc: this.selectedCC,
      bcc: this.selectedBCC,
      subject: this.subject,
      message: this.message,
      date: new Date(),
      sender: localStorage.getItem('username'),
      tipoCarpeta: "Env"  // Este es el estado de "Enviado"
    };

    console.log('Correo enviado:', emailData);

    // Aquí puedes hacer una solicitud HTTP para enviar el correo
    // this.messageService.sendMessage(emailData).subscribe(...);

    this.emailSent.emit();
    this.resetForm();
  }

  resetForm() {
    this.recipient = '';
    this.subject = '';
    this.message = '';
    this.selectedRecipients = [];
    this.selectedCC = [];
    this.selectedBCC = [];
    this.contacts.forEach(contact => contact.selected = false);
  }
}
