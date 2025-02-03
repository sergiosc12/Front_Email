import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() composeEmail = new EventEmitter<void>();
  @Output() folderSelected = new EventEmitter<string>();
  isFolderMenuOpen = false;
  onComposeEmail() {
    this.composeEmail.emit(); // Emitir el evento al hacer clic en "Redactar Correo"
  }
  toggleFolderMenu() {
    this.isFolderMenuOpen = !this.isFolderMenuOpen;
  }
  selectFolder(folder: string) {
    this.folderSelected.emit(folder); // Emitir el evento al seleccionar una carpeta
  }
}