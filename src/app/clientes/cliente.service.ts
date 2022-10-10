import { Injectable } from '@angular/core';
import {formatDate} from '@angular/common';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { Region } from './region';
import { Observable, map, catchError, throwError, tap } from 'rxjs';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {AuthService} from '../usuarios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8883/backend-apirest/api/clientes';

  private httpHeaders = new HttpHeaders({'Content-Type':'application/json'});

  //Establecemos la conexion
  constructor(private http: HttpClient, private router: Router,
  private authService: AuthService) { }

  //Método que se agrega donde se requiere autorizacion
  private agregarAuthorizationHeader(){
    let token = this.authService.token;
    if(token!=null){
      return this.httpHeaders.append('Authorization', 'Bearer '+token);
    }
    return this.httpHeaders;
  }

  //metodo para verificar  si esta logeado
  private isNoAutorizado(e): boolean{
    if(e.status==401){
      //cerrar sesion cuando el token expira
      if(this.authService.isAuthenticated()){
        this.authService.logout();
      }

      this.router.navigate(['/login']);
      return true;
    }
    if(e.status==403){
      Swal.fire('Acceso denegado', 'No tienes aceso a este recurso!', 'warning');
      this.router.navigate(['/clientes']);
      return true;
    }
    return false;
  }

  //regiones de los clientes
  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint+'/regiones', {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
  //Observable es patron que verifica cambios
  //Of convierte los datos
  getClientes(page: number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint+'/page/'+page).pipe(
      tap((response: any) => {
        console.log('ClienteService: tap 1');
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
        console.log('ClienteService: tap 2');
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
    return this.http.post<Cliente>(this.urlEndPoint, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
        map((response: any) => response.cliente as Cliente),
        catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(() => e);
          }

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
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(() => e);
          }
          this.router.navigate(['/clientes']);
          console.log(e.error.mensaje);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(() => e);
      })
    );
  }

  update(cliente: Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(() => e);
          }

          if(e.status==400){
            return throwError(() => e);
          }
          console.log(e.error.mensaje);
          Swal.fire('Error al editar', e.error.mensaje, 'error');
          return throwError(() => e);
      })
    );
  }
  //borrar cliente
  delete(id: number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError(e => {
          if(this.isNoAutorizado(e)){
            return throwError(() => e);
          }
          console.log(e.error.mensaje);
          Swal.fire('Error al eliminar', e.error.mensaje, 'error');
          return throwError(() => e);
      })
    );
  }
  //Subir la foto
  subirFoto(archivo: File, id: any): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("archivo", archivo);
    formData.append("id", id);

    let httpHeaders = new HttpHeaders();
    let token = this.authService.token;

    if(token!=null){
      httpHeaders = httpHeaders.append('Authorization', 'Bearer '+token);
    }

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true,
      headers: httpHeaders
    });

    return this.http.request(req).pipe(
      catchError(e => {
        this.isNoAutorizado(e);
        return throwError(e);
      })
    );
  }
}
