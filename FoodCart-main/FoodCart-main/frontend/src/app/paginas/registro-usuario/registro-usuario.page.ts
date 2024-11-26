import { Component, inject, OnInit } from '@angular/core'; // Importa las funciones Component, inject y OnInit de Angular
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { Router } from '@angular/router'; // Importa Router para la navegación de rutas
import { FormControl, FormsModule } from '@angular/forms'; // Importa FormControl y FormsModule para el manejo de formularios
import { NgClass, NgIf } from '@angular/common'; // Importa NgClass y NgIf para directivas de Angular
import { UsuarioRegister } from '../../interfaces/usuario'; // Importa la interfaz UsuarioRegister

@Component({
  selector: 'app-registro-usuario', // Define el selector del componente, que se utiliza en el HTML
  standalone: true, // Indica que el componente es autónomo
  imports: [FormsModule, NgIf, NgClass], // Importa módulos y directivas necesarias
  templateUrl: './registro-usuario.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
})
export class RegistroUsuarioPage implements OnInit {
  // Variables para almacenar los datos del formulario
  nombre: string = '';
  apellido: string = '';
  email: string = '';
  telefono: string = '';
  calle: string = '';
  numero: string = '';
  apto: string = '';
  password: string = '';
  foto: object = {};
  confirmarContrasena: string = '';
  contraigual: boolean = false;
  registerUser?: UsuarioRegister;

  // Inyecta los servicios AuthService y Router utilizando la función inject
  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);

  // Método que se ejecuta al inicializar el componente
  ngOnInit(): void {
    const queryString = window.location.search;
    if (queryString != null) {
      const UrlParams = new URLSearchParams(queryString);
      this.nombre = UrlParams.get('given_name') ?? '';
      this.apellido = UrlParams.get('family_name') ?? '';
      this.email = UrlParams.get('email') ?? '';
    }
  }

  // Método para manejar el envío del formulario
  async onSubmit() {
    this.registerUser = {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email,
      telefono: this.telefono,
      calle: this.calle,
      numero: this.numero,
      apto: this.apto,
      contraseña: this.password,
      repetirContraseña: this.confirmarContrasena,
      foto: this.foto,
    };
    let response = await this.authService.registro(
      JSON.stringify(this.registerUser),
    );
    if (response != null) {
      this.router.navigate(['auth/login']);
    } else {
      alert(
        'Hubo un error al intentar registrarlo, por favor pruebe con otros datos.',
      );
    }
  }

  // Método para verificar si las contraseñas coinciden
  checkInput() {
    if (this.confirmarContrasena == this.password) {
      this.contraigual = true;
    } else {
      this.contraigual = false;
    }
  }

  // Método para redirigir al usuario a la página de login
  redirectToLogin() {
    this.router.navigate(['auth/login']);
  }
}
