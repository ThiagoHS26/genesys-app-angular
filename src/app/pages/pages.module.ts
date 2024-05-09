import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';

import { PagesRoutingModule } from './pages-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { UsuariosComponent } from './usuarios/usuarios.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlmacenComponent } from './almacen/almacen.component';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { ClienteComponent } from './cliente/cliente.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    UsuariosComponent,
    AlmacenComponent,
    DistribuidorComponent,
    ClienteComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    DataTablesModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports:[
    DashboardComponent,
    UsuariosComponent,
    AlmacenComponent,
    DistribuidorComponent,
    ClienteComponent
  ],
})
export class PagesModule { }
