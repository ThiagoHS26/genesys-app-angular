import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { AlmacenComponent } from './almacen/almacen.component';
import { DistribuidorComponent } from './distribuidor/distribuidor.component';
import { ClienteComponent } from './cliente/cliente.component';

const routes: Routes = [
  {path:'', component: PagesComponent, //canActivate: [AuthGuard],
    children:[
      {path:'dashboard', component: DashboardComponent, data:{titulo:'Dashboard'}},
      {path:'usuarios', component: UsuariosComponent, data:{titulo:'Usuarios'}},
      {path:'almacen', component: AlmacenComponent, data:{titulo:'Almacenes'}},
      {path:'proveedor',component: DistribuidorComponent, data:{titulo:'Proveedores'}},
      {path:'cliente', component: ClienteComponent, data:{titulo:'Clientes'}}
    ]
  },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
