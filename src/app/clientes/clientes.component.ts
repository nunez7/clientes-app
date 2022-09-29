import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import {ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute) { }

  //Asignamos los valores del array
  ngOnInit(): void {
    //Asigna el observador al array a traves de una funcion

    this.activatedRoute.paramMap.subscribe( params =>{
    let page : number = Number(params.get('page'));

    if(!page){
      page = 0;
    }
    this.clienteService.getClientes(page)
    .pipe(
      tap(response => {
        console.log('ClienteComponent: tap 3');
        (response.content as Cliente[]).forEach(
          cliente => {
            console.log(cliente.nombre);
          }
        );
      })
    ).subscribe(  (response) =>{
       this.clientes = response.content as Cliente[];
       this.paginador = response;
       //console.log("RESPONSE "+JSON.stringify (response.totalPages));
    });
  }
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
            //Enviamos el mensaje
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
