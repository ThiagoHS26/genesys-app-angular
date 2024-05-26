import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from '../../usuarios/models/usuario.model';
import { AlmacenModel } from '../../almacen/models/almacen.model';
import { ProveedorModel } from '../../distribuidor/models/proveedor.model';
import { UsuarioService } from '../../usuarios/services/usuario.service';
import { AlmacenService } from '../../almacen/services/almacen.service';
import { ProveedorService } from '../../distribuidor/services/proveedor.service';
import { CompraService } from '../services/compra.service';
import { CompraModel } from '../models/compra.model';
import { ArticuloModel } from '../../producto/models/articulo.model';
import { ArticuloService } from '../../producto/services/articulo.service';
import Swal from 'sweetalert2';
import { RegistrarCompraService } from './services/registrar-compra.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registrar-compra',
  templateUrl: './registrar-compra.component.html',
  styleUrl: './registrar-compra.component.css'
})
export class RegistrarCompraComponent implements OnInit, OnDestroy {

  public cabeceraCompra:FormGroup;
  public cabeceraCompraSubmitted: Boolean = false;
  public btnDetalleCompra: Boolean = false;
  public btnGrabarCompra: Boolean = true;
  public idCompra:string = '';

  public usuarios:UsuarioModel[] =[];
  public almacenes:AlmacenModel[] = [];
  public proveedores: ProveedorModel[] = [];
  public articulos: ArticuloModel[] = [];//Lista de articulos
  public filterArticulos: ArticuloModel[] = []//lista filtrada de articulos
  public totalArticulos: number = 0;
  public currentUser:any;
  public totalCompra:number = 0;
  public subtotalCompra: number = 0;

  public formaPagoCompra:Array<string> = ['EFECTIVO','TRANSFERENCIA'];
  public estadoCompra:Array<string> = ['PENDIENTE','PAGADO'];

  public detalles:Array<any> = [];
  public detalleCompra:Array<any> = [];

  constructor(
    private _router:Router,
    private _fb:FormBuilder, 
    private _usuarioSvc: UsuarioService, 
    private _almacenSvc: AlmacenService,
    private _provSvc: ProveedorService,
    private _compraSvc: CompraService,
    private _articuloSvc: ArticuloService,
    private _detCompra: RegistrarCompraService
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

  //La funcion trae todos los almacenes registrados en la BD
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

  //La funcion trae todos los proveedores registrados en la BD
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

  //La funcion trae todos los articulos de la base de datos
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

  //La función obtiene el total de artículos en stock
  //Se implementa un condicional para no contar articulos que graban 0% de iva; ejemplo: servicios
  getTotalArticulos():number {
    let total = 0;
    this.articulos.forEach(element => {
      if(element.tipo_prod === "SERVICIO"){
        total = this.totalArticulos - 1;
      }
    });
    return total;
  }

  registrarCompra(){
    this.cabeceraCompraSubmitted = true;
    if(this.cabeceraCompra.invalid){
      return;
    }
    this.btnGrabarCompra = false;
    this.btnDetalleCompra = true;
    this._compraSvc.registrarCompra(this.cabeceraCompra.value)
      .subscribe(
        {
          next: (res: CompraModel) => {
            this.idCompra = res.id;
            Swal.fire({
              icon: 'success',
              title: 'Datos registrados',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });
            this.cabeceraCompraSubmitted = false;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  //La función recibe un objeto de tipo Producto se almacenan solo las porpiedades necesarias en un Array
  addArticulo(item:any){
    this.articulos.splice(this.articulos.indexOf(item),1);
    this.totalArticulos = this.totalArticulos - 1;

    let detalles = {
      id : item.id,
      codigo: item.codigo,
      nombre_producto: item.nombre_producto,
      producto_id: item.id,
      compra_id: this.idCompra,
      precio_compra: item.precio_compra,
      cantidad: 1,
      descuento: 0
    }
    this.detalleCompra.push(detalles);
  }

  //La funcion elimina de la lista Detalle de compras un item seleccionado por el usuario
  deleteItem(index: number, item:any){
    this.detalleCompra.splice(index, 1)
    this.articulos.push(item);
    this.totalArticulos = this.totalArticulos + 1;
  }

  //La funcion calcula el subtotal de la compra 
  getSubtotal(): number {
    return this.detalleCompra
      .reduce((acc, producto) => acc + ((producto.cantidad * producto.precio_compra) - ((producto.cantidad * producto.precio_compra)*(producto.descuento / 100))), 0);
  }

  //La funcion calcula el total de la compra
  getTotal(): number {
    const subtotal = this.getSubtotal();
    const iva = subtotal * 0.15;//Los impuestos cambian segun el pais
    return subtotal + iva;
  }

  //La funcion captura un evento (cantidad de productos)
  //Se controla que se capturen numeros enteros positivos
  capturaCantidad(evento:any,id:any){
    let cant = Math.round(evento.target.value);
    evento.target.value = cant;
    if(cant < 1 ){
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
    } else if(isNaN(cant)){
      evento.target.value = 1;
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Advertencia!',
        text: 'No se admiten caracteres',
        position: 'center-end',
        showConfirmButton: false,
        timer: 2500
      });
    }
    this.detalleCompra.forEach(element => {
      if(element.producto_id === id){
        element.cantidad = parseInt(evento.target.value);
      }
    });
  }

  //La funcion captura un evento (descuento  n/100)
  //Se controla que se capturen numeros enteros positivos
  capturaDescuento(evento:any, id:any){
    let desc = Math.round(evento.target.value);
    evento.target.value = desc;
    if(desc < 0){
      evento.target.value = 0;
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Advertencia!',
        text: 'Solo valores válidos',
        position: 'center-end',
        showConfirmButton: false,
        timer: 2500
      });
    }else if(isNaN(desc)){
      evento.target.value = 0;
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Advertencia!',
        text: 'No se admiten caracteres',
        position: 'center-end',
        showConfirmButton: false,
        timer: 2500
      });
    }
    this.detalleCompra.forEach(element => {
      if(element.producto_id === id){
        element.descuento = parseFloat(evento.target.value);
      }
    });
  }

  capturaPrecio(evento:any, id:string){
    let price:number = evento.target.value;
    evento.target.value = price;
    if(price < 0){
      evento.target.value = 0;
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Advertencia!',
        text: 'No se admiten negativos',
        position: 'center-end',
        showConfirmButton: false,
        timer: 2500
      });
    }else if(isNaN(price)){
      evento.target.value = 0;
      Swal.fire({
        toast: true,
        icon: 'warning',
        title: 'Advertencia!',
        text: 'No se admiten caracteres',
        position: 'center-end',
        showConfirmButton: false,
        timer: 2500
      });
    }
    this.detalleCompra.forEach(element => {
      if(element.producto_id === id){
        element.precio_compra = parseFloat(evento.target.value);
      }
    });
  }

  //Esta funcion llama al servicio Detalle de Compra para registrar los items capturados
  //La funcion recibe por parametro un array de items, y el ID de la compra anteriormente grabada
  anadirDetalleCompra(){
    if(!this.idCompra){
      Swal.fire({
        toast:true,
        icon:'warning',
        title:'Genera los datos de la compra',
        timer:2500,
        position:'center',
        showConfirmButton:false
      })
      return;
    }
    let data:Array<any> = [];
    this.detalleCompra.forEach(element => {
      data.push({
        cantidad:element.cantidad,
        descuento:element.descuento,
        precio_compra:element.precio_compra,
        compra_id:this.idCompra,
        producto_id:element.producto_id
      });
    });
    this._detCompra.registrarDetCompra(this.idCompra,data)
      .subscribe(
        {
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Compra Registrada',
              showConfirmButton: true,
            }).then((result)=>{
              if(result.isConfirmed){
                this._router.navigate(["/compras"]);
              }
            });
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  //Esta funcion verifica que el formulario reactivo no este vacio o cumpla con las validaciones correspondiente
  campoNoValido(campo:string){
    if(this.cabeceraCompra.get(campo)?.invalid && this.cabeceraCompraSubmitted){
      return true;
    }else {
      return false;
    }
  }

  //Esta funcion filtra la lista de articulos a medida que se ingresan valores
  filterOptions(evento:any){
    let searchTerm = evento.target.value;
    if(!searchTerm){
      this.filterArticulos = this.articulos;
    }else{
      this.filterArticulos = this.articulos.filter((op) => op.nombre_producto.includes(searchTerm))
    }
    console.log(this.filterArticulos);
  }
  ngOnDestroy(): void {
    
  }

}
