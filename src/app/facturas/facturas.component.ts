import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import { mergeMap, map} from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ItemFactura } from './models/item-factura';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html'
})
export class FacturasComponent implements OnInit {

  titulo:string = "Nueva factura";
  factura: Factura = new Factura();
  autoCompleteControl = new FormControl();
  productosFiltrados: Observable<Producto[]>;

  constructor(private clienteService: ClienteService,
    private activatedRoute: ActivatedRoute,
    private facturaService: FacturaService,
    private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = Number(params.get('clienteId'));
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    //Convertimos el valor del objeto para poder buscar los datos
    this.productosFiltrados = this.autoCompleteControl.valueChanges
    .pipe(
      map(value => typeof value === 'string'? value: value.nombre),
      mergeMap(value => value ? this._filter(value): []),
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  //Metodo para agregar el nombre en el campo
  mostrarNombre(producto?: Producto): string | undefined{
    return producto? producto.nombre: undefined;
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void{
    let producto = event.option.value as Producto;
    //Se verifica si existe el producto
    if(this.existeItem(producto.id)){
      this.incrementaCantidad(producto.id);
    }else{
      //Agregamos el item a la factura
      let nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }
    //limpiamos el autocomplete
    this.autoCompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarcantidad(id:number, event:any): void{
    //Buscamos la cantidad a traves del evento
    let cantidad: number = event.target.value as number;
    if(cantidad == 0){
      return this.eliminarItemfactura(id);
    }
    //Reasignamos el valor en el array
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      //Buscamos el producto en el array y asignamos la nueva cantidad
      if(id === item.producto.id){
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id:number): boolean{
    let existe = false;
    this.factura.items.forEach((item: ItemFactura)=> {
      if(id===item.producto.id){
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id:number): void{
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      //Buscamos el producto en el array y asignamos la nueva cantidad
      if(id === item.producto.id){
        ++item.cantidad;
      }
      return item;
    });
  }
  //Eliminamos el item
  eliminarItemfactura(id:number): void{
    this.factura.items = this.factura.items.filter((item:ItemFactura)=> id !== item.producto.id);
  }

  create():void{
    console.log(this.factura);
    this.facturaService.create(this.factura).subscribe(factura => {
      Swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito!`, 'success');
      this.router.navigate(['/clientes']);
    });
  }

}
