import { Component, OnInit, Input } from '@angular/core';
import { Cliente} from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from '../detalle/modal.service';
import Swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  @Input() cliente: Cliente;
  titulo: string = "Detalle del cliente";
  public fotoSeleccionada: any;
  progreso: number = 0;

  constructor(private clienteService: ClienteService, public activeModal: NgbActiveModal,
    private modalService: ModalService) {}

  ngOnInit(): void {
  }

  seleccionarFoto(event: any){
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    //console.log(this.fotoSeleccionada);
    if(this.fotoSeleccionada.type.indexOf('image') <0 ){
      Swal.fire('Error al seleccionar imagen: ', 'El archivo debe ser imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto(){
    if(!this.fotoSeleccionada){
      Swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    }else{
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
      .subscribe(
        event => {
          //this.cliente = cliente;
          if(event.type=== HttpEventType.UploadProgress){
            this.progreso = event.total ? Math.round(100 * event.loaded / event.total) : 0;
          }else if(event.type === HttpEventType.Response){
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;
            //Eminitmos el cambio de la foto
            this.modalService.notificarUpload.emit(this.cliente);
            Swal.fire(
                'Foto subida!',
                response.mensaje,
                'success'
            )
          }
        }
      );
      }
  }
}
