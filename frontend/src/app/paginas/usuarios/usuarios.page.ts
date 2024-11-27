import { Component, inject, OnInit, signal } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';
import { NgFor, NgIf } from '@angular/common';
import { VerPedido } from '../../interfaces/pedido';
import { AuthService } from '../../servicios/auth.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import { WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { Router } from '@angular/router';
import { CRUDUsuariosService } from '../../servicios/crud-usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [NavbarComponent, NgFor],
  templateUrl: './usuarios.page.html',
})
export class UsuariosPage implements OnInit {
  pedidos = signal<VerPedido[]>([]);
  pedidosFiltrados = signal<VerPedido[]>([]);
  detalle_pedidos: any[] = [];
  usuarios: any[] = [];
  authService: AuthService = inject(AuthService);
  usuariosService: CRUDUsuariosService = inject(CRUDUsuariosService);
  getPedidos: GetPedidosService = inject(GetPedidosService);
  getDetalle_Pedido: GetDetallePedidosService = inject(
    GetDetallePedidosService,
  );
  router: Router = inject(Router);
  private wsSubject: WebSocketSubject<string>;

  constructor() {
    const config: WebSocketSubjectConfig<string> = {
      url: 'wss://localhost/backend/websocket',
      deserializer: (event: MessageEvent) => event.data,
    };

    this.wsSubject = new WebSocketSubject(config);
  }

  async ngOnInit() {
    await this.listadoUsuarios();
    this.cargarPedidos();
    this.setupWebSocket();
  }

  setupWebSocket() {
    this.wsSubject.subscribe((message) => {
      if (message === 'Actualizacion_pedido') {
        this.cargarPedidos();
      }
    });
  }

  async cargarPedidos() {
    this.usuarios.forEach(async (usuario) => {
      let pedidossinfiltrar = await this.getPedidos.getPedidoById(usuario.id);
      pedidossinfiltrar = pedidossinfiltrar.map(
        (pedido: VerPedido, index: number) => {
          return { ...pedido, nombre: 'Pedido ' + index };
        },
      );

      this.pedidos.set(
        pedidossinfiltrar.filter(
          (pedido: any) => !['PENDIENTE'].includes(pedido.estado),
        ),
      );
      this.pedidosFiltrados.set(this.pedidos());
    });
  }

  actualizarFiltroDePedidos(searchValue: string) {
    const filtrados = this.pedidos().filter((pedido: VerPedido) =>
      pedido.nombre.toLowerCase().includes(searchValue.toLowerCase()),
    );
    this.pedidosFiltrados.set(filtrados);
  }

  async listadoUsuarios() {
    this.usuarios = await this.usuariosService.getUsers();
    console.log('listado usuarios', JSON.stringify(this.usuarios, null, 2));
  }

  async verDetalles(userId: number) {
    this.router.navigate(['pedidos/pedidosUsuario/'], {
      queryParams: { id_usuario: userId },
    });
  }
}
