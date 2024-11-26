import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { GetDetallePedidosService } from '../../servicios/pedidos/get-detalle-pedidos.service';
import GetPedidosService from '../../servicios/pedidos/get-pedidos.service';
import { NgFor, NgIf } from '@angular/common';
import { CRUDdireccionesService } from '../../servicios/direcciones/cruddirecciones.service';
import { Router } from '@angular/router';
import { PutPedidoService } from '../../servicios/pedidos/put-pedido.service';

@Component({
  selector: 'confirm-order',
  templateUrl: './confirm-order.component.html',
  standalone: true,
  imports: [NgIf, NgFor],
})
export class ConfirmOrderComponent implements OnInit {
  authService: AuthService = inject(AuthService);
  getDetallePedido: GetDetallePedidosService = inject(GetDetallePedidosService);
  getPedidoService: GetPedidosService = inject(GetPedidosService);
  putPedido: PutPedidoService = inject(PutPedidoService);
  getDireccionesUser: CRUDdireccionesService = inject(CRUDdireccionesService);
  router: Router = inject(Router);
  direccionBool: boolean = false;
  id_direccion: string = '';
  @Input() isOpen: boolean = false;
  @Input() pedido: any;
  @Input() importe_total: number = 0;
  @Output() closeModal = new EventEmitter<void>();

  userId: string = this.authService.getUserId();

  direcciones = signal<any[]>([]);

  onCambiarDireccion(evento: Event) {
    this.id_direccion = (evento.target as HTMLSelectElement).value;
    this.direccionBool = true;
  }

  async confirmarPedido() {
    console.log(JSON.stringify(this.pedido));
    this.pedido.estado = 'CONFIRMADO';
    this.pedido.id_direccion = this.id_direccion;
    this.pedido.importe_total = this.importe_total;
    this.putPedido.put(
      JSON.stringify(this.pedido),
      this.pedido.id_pedido.toString(),
    );
    this.router.navigate(['/pedidos/ver']);
    this.closeModal.emit();
  }

  close() {
    this.closeModal.emit();
  }
  async cargarDirecciones() {
    const response = await this.getDireccionesUser.getDireccionesByUserID(
      this.userId,
    );
    this.direcciones.set(response.direcciones);
  }
  constructor() {}
  ngOnInit(): void {
    this.cargarDirecciones();
  }
}
