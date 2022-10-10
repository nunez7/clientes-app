import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from '../auth.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
  private router: Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      //Redirigimos al login
      if(!this.authService.isAuthenticated()){
        this.router.navigate(['/login']);
        return false;
      }
      //Solo para imprimir en consola
      let role = route.data['role'] as string;
      console.log('ROLE ACCESS '+ role);
      if(this.authService.hasRole(role)){
        return true;
      }
      //Mandamos mensaje de acceso denegado
      Swal.fire('Acceso denegado', 'No tienes aceso a este recurso!', 'warning');
      this.router.navigate(['/clientes']);
      return false;
  }

}
