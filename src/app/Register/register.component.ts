import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formulario: FormGroup;
  errorMessage = '';
  successMessage = '';
  showSuccessModal = false; // Controla la visibilidad del modal

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.formulario = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      celular: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', [Validators.required]],
      pais: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onRegister(): void {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched(); // Muestra los errores si hay campos vacíos
      return;
    }
    if (this.formulario.valid) {
      const userData = {
        nombre: this.formulario.value.nombre,
        apellido: this.formulario.value.apellido,
        correoAlterno: this.formulario.value.correo,
        celular: this.formulario.value.celular,
        fechaNacimiento: this.formulario.value.fechaNacimiento,
        password: this.formulario.value.password,
        idPais: this.formulario.value.pais,
        idEstado: "Act"
      };
  
      this.authService.register(userData).subscribe(
        (response) => {
          console.log("Respuesta del backend:", response);
          this.successMessage = 'Registro exitoso!';
          this.errorMessage = '';
          this.showSuccessModal = true;  // Mostrar el modal de éxito
  
          // Opcionalmente, resetear el formulario:
          this.formulario.reset(); // Resetear el formulario si es necesario
        },
        (error) => {
          this.errorMessage = 'Error en el registro';
          this.successMessage = '';
        }
      );
    }
  }

  onCloseModal(): void {
    this.showSuccessModal = false; // Cerrar el modal
    this.router.navigate(['/login']); // Redirigir al login
  }
}
