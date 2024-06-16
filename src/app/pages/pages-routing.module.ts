import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AlmacenComponent } from './almacen/almacen.component';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { ClienteComponent } from './cliente/cliente.component';
import { ProductoComponent } from './producto/producto.component';
import { ComprasComponent } from './compras/compras.component';
import { VentasComponent } from './ventas/ventas.component';
import { RegistrarCompraComponent } from './compras/registrar-compra/registrar-compra.component';
import { RegistrarDetalleComponent } from './ventas/registrar-detalle/registrar-detalle.component';
import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {path:'', component: PagesComponent, canActivate: [AuthGuard],
    children:[
      {path:'dashboard', component: DashboardComponent, data:{titulo:'Dashboard'}},
      {path:'usuarios', component: UsuariosComponent, data:{titulo:'Usuarios'}},
      {path:'almacen', component: AlmacenComponent, data:{titulo:'Almacenes'}},
      {path:'proveedor',component: DistribuidorComponent, data:{titulo:'Proveedores'}},
      {path:'cliente', component: ClienteComponent, data:{titulo:'Clientes'}},
      {path:'producto', component: ProductoComponent, data:{titulo:'Productos'}},
      {path:'compras', component: ComprasComponent, data:{titulo:'Compras'}},
      {path:'compras/registrar', component: RegistrarCompraComponent, data:{titulo:'Registrar compra'}},
      {path:'ventas', component: VentasComponent, data:{titulo:'Ventas'}},
      {path:'ventas/registrar', component: RegistrarDetalleComponent, data:{titulo:'Registrar venta'}}
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
