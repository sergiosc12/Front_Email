import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-email-composer',
  templateUrl: './email-composer.component.html',
  styleUrls: ['./email-composer.component.css']
})
export class EmailComposerComponent implements OnInit, OnDestroy {
  isModalOpen: boolean = false;
  selectedFileId: string = '';
  attachmentName: string = '';
  showAttachmentMessage: boolean = false;
  allowedFiles: { attachmentId: string; attachmentName: string }[] = [
    { attachmentId: 'PDF', attachmentName: 'PDF' },
    { attachmentId: 'DOC', attachmentName: 'DOC' },
    { attachmentId: 'XLS', attachmentName: 'XLS' },
    { attachmentId: 'GIF', attachmentName: 'GIF' },
    { attachmentId: 'BMP', attachmentName: 'BMP' },
    { attachmentId: 'MP4', attachmentName: 'MP4' },
    { attachmentId: 'AVI', attachmentName: 'AVI' },
    { attachmentId: 'MP3', attachmentName: 'MP3' },
    { attachmentId: 'EXE', attachmentName: 'EXE' }
  ];

  @Output() emailSent = new EventEmitter<void>();
  subject: string = '';
  message: string = '';
  selectedRecipients: string[] = [];
  selectedCC: string[] = [];
  selectedBCC: string[] = [];
  contacts: any[] = [];
  attachments: { attachmentId: string; attachmentName: string }[] = [];
  showWarning: boolean = false;
  showAttachmentModal: boolean = false;

  private updateSubjectSubject: Subject<string> = new Subject();
  private updateMessageSubject: Subject<string> = new Subject();

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
          selected: false
        }));
      },
      (error) => {
        console.error('Error al obtener los contactos:', error);
      }
    );

    // Setup debouncing for subject and message
    this.updateSubjectSubject.pipe(debounceTime(500)).subscribe((updatedSubject) => {
      this.updateMessage(updatedSubject, 'subject');
    });

    this.updateMessageSubject.pipe(debounceTime(500)).subscribe((updatedMessage) => {
      this.updateMessage(updatedMessage, 'message');
    });

    // Handle before leaving the page
    window.addEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
  }

  ngOnDestroy() {
    localStorage.removeItem('emailId');
    this.updateSubjectSubject.unsubscribe();
    this.updateMessageSubject.unsubscribe();
    window.removeEventListener('beforeunload', this.beforeUnloadHandler.bind(this));
  }

  onSubjectChange() {
    this.updateSubjectSubject.next(this.subject);
  }

  onMessageChange() {
    this.updateMessageSubject.next(this.message);
  }
  updateMessage(updatedValue: string, field: string) {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No se encontró el nombre de usuario en el localStorage');
      return;
    }
  
    // Obtener el messageId desde el localStorage
    const messageId = localStorage.getItem('emailId');  // Se asume que el 'emailId' es el ID del mensaje
  
    if (!messageId) {
      console.error('No se encontró el ID del mensaje en el localStorage');
      return;
    }
  
    // Asegurarse de que solo se actualice el campo específico
    const updateField = field === 'subject' ? { asunto: updatedValue } : { cuerpomensaje: updatedValue };
  
    // Llamada al servicio de actualización pasando los tres parámetros
    this.contactoService.updateMessage(messageId, username, updateField).subscribe(
      (response) => {
        try {
          const jsonResponse = JSON.parse(response);  // Asegúrate de que sea un JSON válido
          console.log(`Mensaje actualizado en el campo ${field}:`, jsonResponse);
        } catch (error) {
          console.error('Error al analizar la respuesta del servidor:', error);
        }
      },
      (error) => {
        console.error('Error al actualizar el mensaje:', error);
      }
    );
  }
  
  
  

  beforeUnloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = '';
  
    // Eliminar solo el emailId al cerrar la ventana de redacción
    localStorage.removeItem('emailId');
  
    // Asegurarse de que los campos del mensaje se actualicen antes de cerrar
    this.updateMessage(this.subject, 'subject');
    this.updateMessage(this.message, 'message');
  }

  toggleSelection(event: any, type: string) {
    const selectedOptions = event.target.selectedOptions;
    let selectedArray: string[] = [];
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
    this.validateSendButton();
  }

  validateSendButton() {
    const hasRecipients = this.selectedRecipients.length > 0 || this.selectedCC.length > 0 || this.selectedBCC.length > 0;
    this.showWarning = !hasRecipients;
  }

  openFileModal() {
    this.isModalOpen = true;
  }

  closeFileModal() {
    this.isModalOpen = false;
  }

  addAttachment() {
    if (!this.selectedFileId || !this.attachmentName) {
      alert('Debe seleccionar un archivo y agregar un nombre.');
      return;
    }

    const attachmentDTO = {
      messageId: 'I428q', // Este debería ser dinámico dependiendo del mensaje
      attachmentId: this.selectedFileId,
      attachmentName: this.attachmentName
    };

    // Agregar el archivo a la lista de archivos adjuntos
    this.attachments.push({
      attachmentId: this.selectedFileId,
      attachmentName: this.attachmentName
    });

    this.attachmentName = '';
    this.selectedFileId = '';
    this.closeFileModal();
    
    this.showAttachmentMessage = true;
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  sendEmail() {
    // Validación de campos
    if (
      !this.subject ||  // Asunto vacío
      !this.message ||  // Mensaje vacío
      (this.selectedRecipients.length === 0 &&  // Ningún destinatario seleccionado
      this.selectedCC.length === 0 && // Ningún CC seleccionado
      this.selectedBCC.length === 0)  // Ningún CCO seleccionado
    ) {
      alert('Llenar campos necesarios: Debes completar el asunto, el mensaje y seleccionar al menos un destinatario (CC o CCO).');
      return;
    }
  
    const emailData = {
      recipients: this.selectedRecipients,
      cc: this.selectedCC,
      bcc: this.selectedBCC,
      subject: this.subject,
      message: this.message,
      date: new Date(),
      sender: localStorage.getItem('username'),
      tipoCarpeta: 'Env',
      attachments: this.attachments
    };
  
    console.log('Correo enviado:', emailData);
    this.emailSent.emit();
    this.resetForm();
  }

  getAttachmentNames(): string {
    return this.attachments.map(attachment => attachment.attachmentName).join(', ');
  }

  resetForm() {
    this.subject = '';
    this.message = '';
    this.selectedRecipients = [];
    this.selectedCC = [];
    this.selectedBCC = [];
    this.attachments = [];
    this.validateSendButton();
  }

  canSendEmail() {
    return this.selectedRecipients.length > 0 || this.selectedCC.length > 0 || this.selectedBCC.length > 0;
  }
}