import { Component } from '@angular/core';
import { AuthService } from '../auth.service'; // Asegúrate de importar tu servicio de autenticación
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Guardamos el username en localStorage
        if (response.username && response.password) {
          this.authService.setUserCredentials(response.username,response.password); // Guardamos solo el username
          this.router.navigate(['/gmail']);
        } else {
          this.errorMessage = 'Error de inicio de sesión, intente nuevamente';
        }
      },
      (error) => {
        // Manejar error
        this.errorMessage = 'Error de inicio de sesión, intente nuevamente';
      }
    );
  }
}