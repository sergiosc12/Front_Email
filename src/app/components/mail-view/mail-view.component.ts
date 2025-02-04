import { Component, Input, Output, EventEmitter } from '@angular/core';

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

  onClose() {
    this.closeView.emit();
  }

  downloadFile(archivo: any) {
    console.log(`Downloading file: ${archivo.nomArchivo}`);
    // Implement actual file download logic
  }



}
