import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent {
  @Input() emails: any[] = [];
  @Output() emailSelected = new EventEmitter<any>();

  // Format date with checks for missing or invalid values
  formatDate(email: any): string {
    // Log for debugging
    console.log('fechaAccion:', email.date);

    // Simply return the already formatted date string from 'fechaAccion'
    if (!email.date) {
      return 'Missing Date';  // Fallback if fechaAccion is missing
    }
  
    return email.date;  // Return the already formatted date
  }

  // Emit the selected email
  selectEmail(email: any) {
    this.emailSelected.emit(email);
  }
}
