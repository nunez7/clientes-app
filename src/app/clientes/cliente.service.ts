import { Injectable } from '@angular/core';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Observable, map, catchError, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8883/backend-apirest/api/clientes';

  private HttpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  //Establecemos la conexion
  constructor(private http: HttpClient, private router: Router) { }
  //Observable es patron que verifica cambios
  //Of convierte los datos
  getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint).pipe(
      map((response) => response as Cliente[])
    );
  }

  //Implementando el guardar (create)
  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.HttpHeaders}).pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {

          if(e.status==400){
            return throwError(() => e);
          }

          console.log(e.error.mensaje);
          Swal.fire('Error al crear al cliente', e.error.mensaje, 'error');
          return throwError(() => e);
        })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.HttpHeaders}).pipe(
      catchError(e => {
          if(e.status==400){
            return throwError(() => e);
          }
          console.log(e.error.mensaje);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(() => e);
      })
    );
  }

  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.HttpHeaders}).pipe(
      catchError(e => {
          console.log(e.error.mensaje);
          Swal.fire('Error al eliminar', e.error.mensaje, 'error');
          return throwError(() => e);
      })
    );
  }

}
