import { Injectable } from '@angular/core';
import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor() { }
  //Observable es patron que verifica cambios
  //Of convierte los datos
  getClientes(): Observable<Cliente[]>{
    return of(CLIENTES);
  }

}
