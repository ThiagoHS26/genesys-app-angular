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
import { ProductoComponent } from './producto/producto.component';
import { ComprasComponent } from './compras/compras.component';
import { RegistrarCompraComponent } from './compras/registrar-compra/registrar-compra.component';
import { VentasComponent } from './ventas/ventas.component';
import { RegistrarDetalleComponent } from './ventas/registrar-detalle/registrar-detalle.component';


@NgModule({
  declarations: [
    PagesComponent,
    DashboardComponent,
    UsuariosComponent,
    AlmacenComponent,
    DistribuidorComponent,
    ClienteComponent,
    ProductoComponent,
    ComprasComponent,
    RegistrarCompraComponent,
    VentasComponent,
    RegistrarDetalleComponent
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
    ClienteComponent,
    ProductoComponent,
    ComprasComponent,
    RegistrarCompraComponent,
    VentasComponent,
    RegistrarDetalleComponent
  ],
})
export class PagesModule { }
