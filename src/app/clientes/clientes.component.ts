import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { DetalleComponent } from './detalle/detalle.component';
import { ModalService } from './detalle/modal.service';
import { tap } from 'rxjs';
import Swal from 'sweetalert2';
import {ActivatedRoute } from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AuthService} from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;
  closeResult:string = '';

  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute,
  private modalService: NgbModal,
  private serviceModal: ModalService,
  public authService: AuthService) { }

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
  });

  //Se subscribe al evento de cambio de imagen
  this.serviceModal.notificarUpload.subscribe(cliente => {
    //Recorremos la lista de los clientes y al que sea igual le cambiamos la imagen
    this.clientes = this.clientes.map(clienteOriginal => {
      if(cliente.id==clienteOriginal.id){
        clienteOriginal.foto = cliente.foto;
      }
      return clienteOriginal;
    })
  });
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

  //Abrir modal al seleccionar el cliente
  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    //Abre el modal del detalle component
    //this.modalService.open(DetalleComponent);
    const modalRef = this.modalService.open(DetalleComponent, {size: 'lg'});
    modalRef.componentInstance.cliente = this.clienteSeleccionado;
  }

}
