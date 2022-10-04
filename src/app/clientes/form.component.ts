import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  regiones: Region[];
  public titulo:string = "Crear Cliente";
  public errores: string[];
  clientForm!: FormGroup;

  constructor(private clienteService: ClienteService,
  private router: Router,
  private activatedRoute: ActivatedRoute,
  private fb: FormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.initForm();
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    });
  }

  initForm(): FormGroup{
      return this.fb.group({
        nombre: ['', [Validators.required, Validators.minLength(4)]],
        apellido: ['', [Validators.required]],
        region: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        createAt: ['', [Validators.required]],
      })
  }

  cargarCliente(): void{
    this.activatedRoute.params.subscribe(params => {
      let id:number = params['id']
      if(id){
        this.clienteService.getCliente(id).subscribe((cliente)=> {
          this.cliente = cliente
        });
      }
    });
  }

  create(): void{
    //console.log(this.cliente);
    this.clienteService.create(this.cliente)
    .subscribe(cliente =>{
      this.router.navigate(['/clientes'])
      Swal.fire('Nuevo cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success')
    },
    err => {
      this.errores = err.error.error as string[];
      console.error('Código del error: '+err.status);
    }
  );
  }

  update():void{
    this.clienteService.update(this.cliente)
    .subscribe(json =>{
      this.router.navigate(['/clientes'])
      Swal.fire('Cliente actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
    },
    err => {
      this.errores = err.error.error as string[];
      console.error('Código del error: '+err.status);
    }
  );
  }

  compararRegion(o1: Region, o2: Region): boolean{
    if(o1 === undefined && o2==undefined){
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false: o1.id === o2.id;
  }
}
