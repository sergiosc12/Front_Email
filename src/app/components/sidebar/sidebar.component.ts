import { Component, EventEmitter, Output } from '@angular/core';
import { CreateEmailService } from '../../services/create_email.service';  // Asegúrate de importar el servicio correcto

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() composeEmail = new EventEmitter<void>();
  @Output() folderSelected = new EventEmitter<string>();
  @Output() createContact = new EventEmitter<void>(); 

  isFolderMenuOpen = false;
  isContactComposerVisible = false;
  constructor(private createEmailService: CreateEmailService) { }  // Cambiar MessageService por CreateEmailService
  
  onComposeEmail() {
    this.createEmailService.createEmail().subscribe({
      next: (response: any) => {
        console.log('Correo creado', response);  // Verifica la respuesta que llega del backend

          this.composeEmail.emit();  // Emite evento para mostrar la vista de composición

      },
      error: (err: any) => {
        console.error('Error al crear el correo', err);  // Verifica el error recibido
      }
    });
  }
  onCreateContact() {
    this.isContactComposerVisible = true;
    console.log("📩 Botón Crear Contactos clickeado");
    this.createContact.emit();  // Emitimos el evento
  }
  toggleFolderMenu() {
    this.isFolderMenuOpen = !this.isFolderMenuOpen;
  }

  selectFolder(folder: string) {
    if (folder === 'crearContactos') {
      console.log("Evento createContact emitido");
      this.createContact.emit();  // Emitimos el evento
    } else {
      this.folderSelected.emit(folder);
    }
  }
}
