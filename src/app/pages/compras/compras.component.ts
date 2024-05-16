import { Component, OnInit } from '@angular/core';
import { CompraModel } from './models/compra.model';
import { CompraService } from './services/compra.service';
import { ProveedorModel } from '../distribuidor/models/proveedor.model';
import { ProveedorService } from '../distribuidor/services/proveedor.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {

  public compras:CompraModel[] = [];
  public proveedores: ProveedorModel[] = [];

  constructor(private _compraSvc: CompraService, private _provSvc: ProveedorService){}

  ngOnInit(): void {
    this.getCompras();
  }

  getProveedores(){
    this._provSvc.obtenerProveedores()
     .subscribe(
      {
        next: (res: ProveedorModel[]) => {
          this.proveedores = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      }
     )
  }

  getCompras(){
    this._compraSvc.obtenerCompras()
     .subscribe(
      {
        next: (res: CompraModel[]) => {
          this.compras = res;
        },
        error: (err: any) => {
          console.log(err);
        }
      }
     )
  }

}
