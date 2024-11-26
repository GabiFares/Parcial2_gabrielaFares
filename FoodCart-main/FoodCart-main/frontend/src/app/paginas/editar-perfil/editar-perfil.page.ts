import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../componentes/navbar/navbar.component';

@Component({
  selector: 'editar-perfil',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './editar-perfil.page.html',
})
export class EditarPerfilPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
