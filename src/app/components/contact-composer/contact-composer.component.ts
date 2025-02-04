import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/User.service';

@Component({
  selector: 'app-contact-composer',
  templateUrl: './contact-composer.component.html',
  styleUrls: ['./contact-composer.component.css']
})
export class ContactComposerComponent implements OnInit {
  users: any[] = [];
  selectedUser: string | null = null;
  showForm: boolean = false;
  username: string = 'fguer';

  constructor(private UserService: UserService) {}

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.UserService.getAllUsers().subscribe(users => {
      this.users = users;
    });
  }

  addContact(): void {
    if (this.selectedUser) {
      this.UserService.addContact(this.selectedUser, this.username).subscribe(() => {
        this.getUsers(); // Refrescar lista de usuarios
        this.selectedUser = null;
        this.showForm = false;
      });
    }
  }
  toggleForm(): void {
    this.showForm = !this.showForm;
  }
}