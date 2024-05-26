import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  constructor(
    private _router: Router
  ) {}

  public menuItems: any[] = [
    {
      titulo: 'Dashboard',
      icono:'nav-icon fas fa-tachometer-alt',
      url:'/dashboard'
    },
    {
      titulo: 'Usuarios',
      icono:'nav-icon fas fa-users',
      url:'usuarios'
    },
    {
      titulo: 'Almacen',
      icono:'nav-icon fas fa-warehouse',
      url:'almacen'
    },
    {
      titulo: 'Proveedores',
      icono:'nav-icon fas fa-truck',
      url:'proveedor'
    },
    {
      titulo: 'Clientes',
      icono:'nav-icon fas fa-users',
      url:'cliente'
    },
    {
      titulo: 'Productos',
      icono:'nav-icon fas fa-box',
      url:'producto'
    },
    {
      titulo: 'Compras',
      icono: 'nav-icon fas fa-shopping-cart',
      url: '/compras'
    }
    
  ];

  logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('identity');
    this._router.navigate(['login']);
  }
  

}
