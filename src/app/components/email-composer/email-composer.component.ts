import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { ContactoService } from '../../services/contacto.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EmailService } from '../../services/email.service';
import { ArchivoService } from '../../services/archivo.service';

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

  selectedRecipients: string[] = [];
  selectedCC: string[] = [];
  selectedBCC: string[] = [];
  
  @Output() emailSent = new EventEmitter<void>();
  
  subject: string = '';
  message: string = '';
  selectedCategory: string = 'PRI';
  contacts: any[] = [];
  attachments: { attachmentId: string; attachmentName: string }[] = [];
  showWarning: boolean = false;
  showAttachmentModal: boolean = false;
  filteredContacts: any[] = [];

  private updateSubjectSubject: Subject<string> = new Subject();
  private updateMessageSubject: Subject<string> = new Subject();

  currentField: string = '';
  showContacts: boolean = false;

  constructor(private contactoService: ContactoService, private emailService: EmailService, private archivoService: ArchivoService) {}

  ngOnInit() {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No se encontró el nombre de usuario en el localStorage');
      return;
    }

    // Obtener los contactos del usuario
    this.contactoService.getContacts(username)  // Pasa el nombre de usuario adecuado
      .subscribe(
        (data) => {
          this.contacts = data;  // Guarda los contactos obtenidos
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
  onCategoryChange() {
    console.log(`Categoría seleccionada: ${this.selectedCategory}`);
    // Actualiza el mensaje con la categoría seleccionada si es necesario
    this.updateMessage(this.message, 'cuerpo');
  }
  updateMessage(updatedValue: string, field: string) {
    const username = localStorage.getItem('username');
    if (!username) {
      console.error('No se encontró el nombre de usuario en el localStorage');
      return;
    }
    const messageId = localStorage.getItem('emailId');
    if (!messageId) {
      console.error('No se encontró el ID del mensaje en el localStorage');
      return;
    }
    
    const updateField = field === 'subject' ? { asunto: updatedValue } : { cuerpomensaje: updatedValue };
    
    // Añadir la categoría al objeto de actualización
    const updateCategory = { idCategoria: this.selectedCategory };
    const updatedData = { ...updateField, ...updateCategory };
    
    this.contactoService.updateMessage(messageId, username, updatedData).subscribe(
      (response) => {
        try {
          const jsonResponse = JSON.parse(response);
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
    localStorage.removeItem('emailId');
    this.updateMessage(this.subject, 'subject');
    this.updateMessage(this.message, 'message');
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
  
    const username = localStorage.getItem('username');  // Obtener el nombre de usuario del localStorage
    if (!username) {
      alert('No se encontró el nombre de usuario en el localStorage');
      return;
    }
  
    const attachmentDTO = {
      messageId: localStorage.getItem('emailId'),
      attachmentId: this.selectedFileId,
      attachmentName: this.attachmentName,
      username: username  // Añadir el username al attachmentDTO
    };
  
    this.archivoService.addAttachment(attachmentDTO).subscribe(
      (response) => {
        console.log('Archivo agregado:', response);
        this.attachments.push({
          attachmentId: this.selectedFileId,
          attachmentName: this.attachmentName
        });
        this.attachmentName = '';
        this.selectedFileId = '';
        this.showAttachmentMessage = true;
      },
      (error) => {
        console.error('Error al agregar archivo:', error);
        alert('Hubo un error al agregar el archivo.');
      }
    );
  }
  

  removeAttachment(index: number) {
  const attachmentToRemove = this.attachments[index];

  if (!attachmentToRemove) {
    console.error('El archivo no existe en la lista de adjuntos.');
    return;
  }

  const username = localStorage.getItem('username');
  const messageId = localStorage.getItem('emailId');

  if (!username || !messageId) {
    alert('No se encontró el usuario o el ID del mensaje en el localStorage.');
    return;
  }

  const attachmentDTO = {
    messageId: messageId,
    username: username,
    attachmentId: attachmentToRemove.attachmentId,
    attachmentName: attachmentToRemove.attachmentName
  };

  this.archivoService.removeAttachment(attachmentDTO).subscribe(
    () => {
      console.log('Archivo eliminado correctamente.');
      this.attachments.splice(index, 1); // Eliminar de la lista local
    },
    (error) => {
      console.error('Error al eliminar archivo:', error);
      alert('Hubo un error al eliminar el archivo.');
    }
  );
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
  
    // Crear el objeto de correo con los datos del formulario
    const emailData = {
      messageId: localStorage.getItem('emailId'),  // Asigna el ID del mensaje
      username: localStorage.getItem('username'),  // Nombre de usuario del remitente
      mailContactos: this.extractEmails([...this.selectedRecipients, ...this.selectedCC]),  // Extrae solo los correos de los destinatarios y CC
      idType: 'CO',  // Tipo CO por defecto (Destinatarios y CC)
    };
  
    // Si hay destinatarios en CCO, debes enviar los correos como tipo 'CCO'
    if (this.selectedBCC.length > 0) {
      emailData.mailContactos = this.extractEmails([...this.selectedBCC]);  // Extrae solo los correos de los CCO
      emailData.idType = 'CCO';  // Cambiar el tipo a 'CCO'
    }
  
    // Llamada al servicio para enviar el correo
    this.emailService.sendEmail(emailData).subscribe(
      (response) => {
        console.log('Correo enviado correctamente:', response);
        this.emailSent.emit();
        this.resetForm();  // Resetear el formulario después de enviar
      },
      (error) => {
        console.error('Error al enviar el correo:', error);
      }
    );
  }
  
  // Función para extraer solo los correos
  extractEmails(contactos: string[]): string[] {
    return contactos.map(contacto => {
      const match = contacto.match(/[\w.-]+@[\w.-]+\.\w+/);  // Expresión regular para capturar solo el correo
      return match ? match[0] : contacto;  // Retorna solo el correo si se encuentra, sino retorna el valor original
    });
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
  }

