import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';

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

  delete(cliente: Cliente): void {
    Swal.fire({
      title: 'Estás seguro?',
      text: "Borrarás el cliente",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar!',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        //Borramos tras confirmar
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            //Actualizamos la lista
            this.clientes = this.clientes.filter(cli => cli !== cliente)
            Swal.fire(
              'Cliente borrado!',
              'Cliente eliminado con éxito',
              'success'
            )
          }
        )
      }
    })
  }

}
