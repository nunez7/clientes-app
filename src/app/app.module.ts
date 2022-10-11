import { NgModule, LOCALE_ID } from '@angular/core';
import localeES from '@angular/common/locales/es';
import {registerLocaleData} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';
import { PaginatorComponent } from './paginator/paginator.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatMomentDateModule} from '@angular/material-moment-adapter';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginComponent } from './usuarios/login.component';
import {AuthGuard} from './usuarios/guards/auth.guard';
import {RoleGuard} from './usuarios/guards/role.guard';
import {TokenInterceptor} from './usuarios/interceptors/token.interceptor';
import {AuthInterceptor} from './usuarios/interceptors/auth.interceptor';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';

//Config del idioma
registerLocaleData(localeES, 'es');

const routes: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch: 'full'},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'clientes/form', component:FormComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'}},
  {path: 'clientes/form/:id', component:FormComponent, canActivate: [AuthGuard,  RoleGuard], data:{role: 'ROLE_ADMIN'}},
  {path: 'login', component:LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgbModule
  ],
  providers: [ClienteService,
    {provide: LOCALE_ID, useValue: 'es' },
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
