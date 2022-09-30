import { Component, OnInit } from '@angular/core';
import { Cliente} from '../cliente';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {
  cliente: Cliente;
  titulo: string = "Detalle del cliente";
  public fotoSeleccionada: any;

  constructor(private clienteService: ClienteService,
  private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log("FOTO "+this.fotoSeleccionada);
    this.activatedRoute.paramMap.subscribe(
      params =>{
        let id:number = Number(params.get('id'));
        if(id){
          this.clienteService.getCliente(id).subscribe(
           cliente =>{
               this.cliente = cliente;
           })
        }
      }
    );
  }

  seleccionarFoto(event: any){
    this.fotoSeleccionada = event.target.files[0];
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
        cliente => {
          this.cliente = cliente;
          Swal.fire(
            'Foto subida!',
            `Foto del cliente actualizada con éxito ${this.cliente.foto} `,
            'success'
          )
        }
      );
      }
  }
}
