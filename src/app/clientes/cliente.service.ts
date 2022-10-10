import { Injectable } from '@angular/core';
import {formatDate} from '@angular/common';
import { Cliente } from './cliente';
import { Region } from './region';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8883/backend-apirest/api/clientes';

  //Establecemos la conexion
  constructor(private http: HttpClient, private router: Router) { }

  //regiones de los clientes
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones');
  }
  //Observable es patron que verifica cambios
  //Of convierte los datos
  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap((response: any) => {
        (response.content as Cliente[]).forEach(
          cliente => {
            console.log(cliente.nombre);
          }
        )
      }),
      map((response: any) => {
        //retorna el map de clientes
        (response.content as Cliente[]).map(cliente => {
          cliente.nombre = cliente.nombre.toUpperCase();
          cliente.apellido = cliente.apellido.toUpperCase();
          cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MM yyyy', 'es');
          //let datePipe = new DatePipe('en-US');
          //retorna el map de objeto modificado
          return cliente;
        });
        return response;
      }),
      tap(response => {
        (response.content as Cliente[]).forEach(
          cliente => {
            console.log(cliente.nombre);
          }
        )
      })
    );
  }

  //Implementando el guardar (create)
  create(cliente: Cliente): Observable<Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente).pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if(e.status==400){
            return throwError(() => e);
          }
          if( e.error.mensaje){
            console.log(e.error.mensaje);
          }
          return throwError(() => e);
        })
    );
  }

  getCliente(id: number): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
          if(e.status!=401 && e.error.mensaje){
            this.router.navigate(['/clientes']);
            console.log(e.error.mensaje);
          }
          return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {
          if(e.status==400){
            return throwError(() => e);
          }
          if( e.error.mensaje){
            console.log(e.error.mensaje);
          }
          return throwError(() => e);
      })
    );
  }
  //borrar cliente
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(e => {
          if(e.error.mensaje){
            console.log(e.error.mensaje);
          }
          return throwError(() => e);
      })
    );
  }
  //Subir la foto
  subirFoto(archivo: File, id: any): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
