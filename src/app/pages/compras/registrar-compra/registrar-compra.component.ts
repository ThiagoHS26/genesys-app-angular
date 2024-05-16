import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from '../../usuarios/models/usuario.model';
import { AlmacenModel } from '../../almacen/models/almacen.model';
import { ProveedorModel } from '../../distribuidor/models/proveedor.model';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { AlmacenService } from '../../almacen/services/almacen.service';
import { ProveedorService } from '../../distribuidor/services/proveedor.service';
import { CompraService } from '../services/compra.service';
import { CompraModel } from '../models/compra.model';
import Swal from 'sweetalert2';
import { ArticuloModel } from '../../producto/models/articulo.model';
import { ArticuloService } from '../../producto/services/articulo.service';

declare var $:any;

@Component({
  selector: 'app-registrar-compra',
  templateUrl: './registrar-compra.component.html',
  styleUrl: './registrar-compra.component.css'
})
export class RegistrarCompraComponent {

  public cabeceraCompra:FormGroup;
  public cabeceraCompraSubmitted: Boolean = false;

  public usuarios:UsuarioModel[] =[];
  public almacenes:AlmacenModel[] = [];
  public proveedores: ProveedorModel[] = [];
  public articulos: ArticuloModel[] = [];
  public totalArticulos: number = 0;
  public currentUser:any;

  public formaPagoCompra:Array<string> = ['EFECTIVO','TRANSFERENCIA'];
  public estadoCompra:Array<string> = ['PENDIENTE','PAGADO'];

  public detalles:Array<any> = [];
  public detalleCompra:Array<any> = [];

  constructor(
    private _fb:FormBuilder, 
    private _usuarioSvc: UsuarioService, 
    private _almacenSvc: AlmacenService,
    private _provSvc: ProveedorService,
    private _compraSvc: CompraService,
    private _articuloSvc: ArticuloService
  ){
   
    const user = localStorage.getItem('identity');
    if(user){
      this.currentUser = JSON.parse(user);
    }else{
      this.currentUser = null;
    }

    this.cabeceraCompra = this._fb.group({
      num_factura:['', [Validators.required]],
      fecha_emision: ['',[Validators.required]],
      fecha_ingreso: ['',[Validators.required]],
      sucursal_id: ['',[Validators.required]],
      distribuidor_id:['',[Validators.required]],
      forma_pago:['',[Validators.required]],
      usuario_id:[this.currentUser.id],
      estado_compra:['',[Validators.required]],
      observaciones:[''],
      total_compra:[0]
    });
  }

  ngOnInit(): void {
    this.getArticulos();
    this.getProveedores();
    this.getAlmacenes();
    this.getUsuarios();
  }

  getUsuarios(){
    this._usuarioSvc.obtenerUsuarios()
      .subscribe(
        {
          next: (res:UsuarioModel[]) => {
            this.usuarios = res;
          },
          error: (err:any) => {
            console.log(err);
          }
        }
      )
  }

  getAlmacenes(){
    this._almacenSvc.obtenerAlmacenes()
      .subscribe(
        {
          next: (res: AlmacenModel[]) => {
            this.almacenes = res;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
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

  getArticulos(){
    this._articuloSvc.obtenerArticulos()
      .subscribe(
        {
          next: (res: ArticuloModel[]) => {
            this.articulos = res;
            this.totalArticulos = res.length;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }


  registrarCompra(){
    this.cabeceraCompraSubmitted = true;
    if(this.cabeceraCompra.invalid){
      return;
    }
    this._compraSvc.registrarCompra(this.cabeceraCompra.value)
      .subscribe(
        {
          next: (res: CompraModel) => {
            localStorage.setItem('idCompra',res.id)
            Swal.fire({
              icon: 'success',
              title: 'Datos registrados',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  addArticulo(item:any){
    this.articulos.splice(this.articulos.indexOf(item),1);
    this.totalArticulos = this.totalArticulos - 1;
    let idCompra = localStorage.getItem('idCompra');
    localStorage.setItem('idProd',JSON.stringify(item));

    let detalles = {
      codigo: item.codigo,
      nombre_producto: item.nombre_producto,
      producto_id: item.id,
      compra_id: idCompra,
      precio_compra: item.precio_compra,
      cantidad: 1,
      descuento: 0
    }

    this.detalleCompra.push(detalles);
   
  }

  capturaCantidad(evento:any){
    let idProd = JSON.parse(localStorage.getItem('idProd')!);
    let cant:number = evento.target.value;
    cant = Math.round(cant);
    evento.target.value = cant;
    if(cant < 1){
      evento.target.value = 1;
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Advertencia!',
        text: 'Números enteros mayores a 0',
        position: 'center-end',
        showConfirmButton: false,
        timer: 2500
      });
    }
    this.detalleCompra.forEach(element => {
      if(element.producto_id == idProd.id){
        element.cantidad = parseInt(evento.target.value);
      }
    });
    console.log(this.detalleCompra);
  }

  capturaDescuento(evento:any){
    let idProd = JSON.parse(localStorage.getItem('idProd')!);
    this.detalleCompra.forEach(element => {
      if(element.producto_id == idProd.id){
        element.descuento = parseFloat(evento.target.value);
      }
    });
    console.log(this.detalleCompra);
  }

  deleteItem(item:any){
    this.detalleCompra.splice(this.detalleCompra.indexOf(item),1);
    this.articulos.push(item);
    this.totalArticulos = this.totalArticulos + 1;
    console.log(this.detalleCompra);
  }

  campoNoValido(campo:string){
    if(this.cabeceraCompra.get(campo)?.invalid && this.cabeceraCompraSubmitted){
      return true;
    }else {
      return false;
    }
  }
}
