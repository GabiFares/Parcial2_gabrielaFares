import { inject, Injectable } from '@angular/core'; // Importa las funciones inject e Injectable de Angular
import { FetchService } from './fetch.service'; // Importa el servicio FetchService

// Decorador Injectable para permitir que este servicio sea inyectable en otros componentes o servicios
@Injectable({
  providedIn: 'root', // Provee el servicio en el nivel raíz de la aplicación, haciéndolo disponible en todas partes
})
export class CRUDUsuariosService {
  // Inyecta el servicio FetchService utilizando la función inject
  private apiService: FetchService = inject(FetchService);

  // Método para obtener un usuario por su ID
  async getUserById(id_usuario: string) {
    try {
      // Realiza una solicitud GET a la API para obtener el usuario por su ID
      const response = await this.apiService.get(
        `usuarios/_id_usuario/${id_usuario}`,
      );
      return response; // Retorna la respuesta de la API
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }

  async getUsers() {
    try {
      // Realiza una solicitud GET a la API para obtener el usuario por su ID
      const response = await this.apiService.get(`usuarios`);
      return response; // Retorna la respuesta de la API
    } catch (error) {
      console.log(error); // Maneja errores en la consola
    }
  }

  // Constructor del servicio
  constructor() {}
}
