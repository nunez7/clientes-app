import { Component } from '@angular/core';
import {AuthService} from '../usuarios/auth.service';
import {Router} from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent{
  title: string = 'App Angular'
  public authService = null;

  constructor(authService: AuthService, private router: Router){
    this.authService = authService;
  }

  logout(): void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    Swal.fire('Logout', `${username} has cerrado sesión con éxito!`, 'success');
    this.router.navigate(['/login']);
  }
}
