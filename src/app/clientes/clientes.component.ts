import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService) { }

  //Asignamos los valores del array
  ngOnInit(): void {
   //Asigna el observador al array a traves de una funcion
   this.clienteService.getClientes().subscribe(
      (clientes) => this.clientes = clientes
   );
  }

}
