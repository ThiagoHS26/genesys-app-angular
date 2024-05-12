import { formatDate } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { UsuarioModel } from '../usuarios/models/usuario.model';
import { AuthService } from '../../auth/services/auth.service';
import { AlmacenService } from '../almacen/services/almacen.service';
import { AlmacenModel } from '../almacen/models/almacen.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ArticuloModel } from '../producto/models/articulo.model';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit {

  public cabeceraCompra:FormGroup;

  public listaArticulos:Array<any> = ['leche','queso','harina'];//Viene de la lista de articulos registrados
  public detalleCompra:Array<any> = [];//Se agrega la lista de productos a enviar 

  constructor(
    private _fb:FormBuilder
  ){
    this.cabeceraCompra = this._fb.group({
      num_factura:['', [Validators.required]],
      fecha_emision: ['',[Validators.required]],
      fecha_ingreso: ['',[Validators.required]],
      sucursal_id: ['',[Validators.required]],
      distribuidor_id:['',[Validators.required]],
      forma_pago:['',[Validators.required]],
      usuario_id:['',[Validators.required]],
      estado_compra:['',[Validators.required]],
      observaciones:['']
    });
  }

  ngOnInit(): void {
    
  }

  registrarCompra(){
    console.log(this.cabeceraCompra.value);
  }

  addArticulo(item:any){
    this.detalleCompra.push(item);
    console.log(this.detalleCompra);
  }

  deleteItem(item:any){
    this.detalleCompra.splice(this.detalleCompra.indexOf(item),1);
    console.log(this.detalleCompra);
  }

}
