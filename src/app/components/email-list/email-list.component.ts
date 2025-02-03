import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.css']
})
export class EmailListComponent {
  @Input() emails: any[] = []; // Propiedad para recibir la lista de correos
  @Output() emailSelected = new EventEmitter<any>(); // Evento para emitir el correo seleccionado

  constructor() {}

  selectEmail(email: any) {
    this.emailSelected.emit(email); // Emitir el correo seleccionado al componente padre
  }

}