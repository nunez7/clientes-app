import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import {AuthService} from '../auth.service';
import Swal from 'sweetalert2';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
  private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
      return next.handle(req).pipe(
        catchError(e => {
          if(e.status==401){
            //cerrar sesion cuando el token expira
            if(this.authService.isAuthenticated()){
              this.authService.logout();
            }
            this.router.navigate(['/login']);
          }
          if(e.status==403){
            Swal.fire('Acceso denegado', 'No tienes aceso a este recurso!', 'warning');
            this.router.navigate(['/clientes']);
          }
          return throwError(() => e);
        })
      );
  }
}
