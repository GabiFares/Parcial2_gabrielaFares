import { Component, inject } from '@angular/core'; // Importa Component e inject de Angular
import { Router } from '@angular/router'; // Importa Router de Angular para la navegación
import { ResetPassword } from '../../interfaces/usuario'; // Importa la interfaz ResetPassword
import { AuthService } from '../../servicios/auth.service'; // Importa el servicio AuthService
import { FormsModule } from '@angular/forms'; // Importa FormsModule para el manejo de formularios
import { NgClass, NgIf } from '@angular/common'; // Importa las directivas NgClass y NgIf de Angular

@Component({
  selector: 'app-restablecer-contrasena', // Define el selector del componente, que se utiliza en el HTML
  templateUrl: './reestablecer-contrasena.page.html', // Especifica la ubicación del archivo de plantilla HTML del componente
  standalone: true, // Indica que el componente es autónomo
  imports: [FormsModule, NgClass, NgIf], // Importa módulos necesarios
})
export class RestablecerContrasenaPage {
  user: ResetPassword = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  }; // Define un objeto para almacenar las contraseñas ingresadas por el usuario

  private authService: AuthService = inject(AuthService); // Inyecta el servicio AuthService
  private router: Router = inject(Router); // Inyecta el servicio Router

  // Método asincrónico que se ejecuta al enviar el formulario
  async onSubmit() {
    if (this.user.newPassword === this.user.confirmPassword) {
      // Verifica si las nuevas contraseñas coinciden
      const body = JSON.stringify({
        currentPassword: this.user.currentPassword,
        newPassword: this.user.newPassword,
      });
      try {
        await this.authService.resetPassword(body); // Llama al servicio para restablecer la contraseña
        this.router.navigate(['/login']); // Navega a la página de inicio de sesión si la contraseña se restablece con éxito
      } catch (error) {
        console.error('Error al restablecer la contraseña:', error); // Maneja errores en el restablecimiento de la contraseña
      }
    } else {
      console.error('Las contraseñas no coinciden'); // Muestra un error si las contraseñas no coinciden
    }
  }
}
