  import { Component, OnInit } from '@angular/core';
  import { UserService } from '../../services/User.service';
  import { ContactoService } from '../../services/contacto.service';
  import { ChangeDetectorRef } from '@angular/core';
  @Component({
    selector: 'app-contact-composer',
    templateUrl: './contact-composer.component.html',
    styleUrls: ['./contact-composer.component.css']
  })
  export class ContactComposerComponent implements OnInit {
    users: any[] = [];
    contacts: any[] = [];
    filteredUsers: any[] = [];
    selectedUser: string | null = null;
    showForm: boolean = false;

    constructor(private userService: UserService, private contactService: ContactoService, private cdRef: ChangeDetectorRef) {}

    ngOnInit(): void {
      this.loadUsersAndContacts();
    }

    loadUsersAndContacts(): void {
      const currentUser = localStorage.getItem('username');
      if (!currentUser) {
        console.error('No se encontró el usuario en el localStorage');
        return;
      }
    
      this.userService.getAllUsers().subscribe(users => {
        console.log('Usuarios recibidos:', users);
        this.users = users.filter(user => user.usuario !== currentUser); // Filtrar el usuario actual
        this.checkIfReadyToFilter();
      }, error => {
        console.error('Error al obtener usuarios:', error);
      });
    
      this.contactService.getContacts(currentUser).subscribe(contacts => {
        console.log('Contactos recibidos:', contacts);
        this.contacts = contacts;
        this.checkIfReadyToFilter();
      }, error => {
        console.error('Error al obtener contactos:', error);
      });
    }
    
    checkIfReadyToFilter(): void {
      if (this.users.length > 0 && this.contacts.length > 0) {
        this.filterUsers();
      }
    }
    

    filterUsers(): void {
      this.filteredUsers = this.users.filter(user => 
        !this.contacts.some(contact => {
          const contactUsername = contact.correoContacto.split('@')[0]?.trim().toLowerCase();
          const userUsername = user.usuario?.trim().toLowerCase();
    
          console.log(`Comparando usuario: '${userUsername}' con contacto: '${contactUsername}'`);
    
          return contactUsername === userUsername;
        })
      );
    
      console.log('Usuarios después de filtrar los contactos:', this.filteredUsers);
    
      // Forzar la detección de cambios en Angular
      this.cdRef.detectChanges();
    }
    

    addContact(): void {
      const username = localStorage.getItem('username');
      if (this.selectedUser && username) {
        this.userService.addContact(this.selectedUser, username).subscribe(() => {
          this.loadUsersAndContacts();
          this.selectedUser = null;
          this.showForm = false;
        });
      }
    }

    toggleForm(): void {
      this.showForm = !this.showForm;
      console.log('showForm:', this.showForm);
    }
  }