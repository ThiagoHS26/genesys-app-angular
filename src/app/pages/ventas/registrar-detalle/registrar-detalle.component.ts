import { Component, OnDestroy, OnInit } from '@angular/core';
import { VentaDetalleService } from './services/venta-detalle.service';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../cliente/services/cliente.service';
import { ClienteModel } from '../../cliente/models/cliente.model';
import { AlmacenModel } from '../../almacen/models/almacen.model';
import { AlmacenService } from '../../almacen/services/almacen.service';
import Swal from 'sweetalert2';
import { ArticuloModel } from '../../producto/models/articulo.model';
import { ArticuloService } from '../../producto/services/articulo.service';
import { VentaModel } from '../models/venta.model';
import { VentaService } from '../services/venta.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-detalle',
  templateUrl: './registrar-detalle.component.html',
  styleUrl: './registrar-detalle.component.css'
})
export class RegistrarDetalleComponent implements OnInit, OnDestroy {

  public currentUser;
  public invoiceNumber!:string;
  public invoiceDate!:string;
  public isValid:any;

  public almacenes:AlmacenModel[] = [];
  public articulos: ArticuloModel[] = [];//Lista de articulos
  public totalArticulos: number = 0;

  public cliente = {//CONSUMIDOR FINAL
    id : 'e74c8bfa-0d7a-4026-884e-733034a9cb2a',
    dni:'9999999999999',
    razon_social:'CONSUMIDOR FINAL',
    direccion:'...',
    telefono:'...',
    correo:'...',
  }

  public idVenta:string = '';
  public detalleVenta: Array<any> = [];
  
  public formaPagoVenta:Array<string> = ['EFECTIVO','TRANSFERENCIA'];
  public estadoVenta:Array<string> = ['PENDIENTE','PAGADO'];

  public cabeceraVentaForm:FormGroup;
  public cabeceraVentaSubmitted: Boolean = false;
  public btnDetalleVenta: Boolean = false;
  public btnGrabarVenta: Boolean = true;

  public total:number=0;
  public subTotal:number=0;
  public subTotalSvc:number=0;
  public iva:number=0;

  constructor(
    private _router: Router,
    private _detalleVentaSvc: VentaDetalleService, 
    private _fb:FormBuilder, 
    private _clienteSvc: ClienteService,
    private _almacenSvc: AlmacenService,
    private _articulosSvc: ArticuloService,
    private _ventaSvc: VentaService
  ){

    this.invoiceNumber=this._detalleVentaSvc.getNextInvoiceNumber();
    this.invoiceDate=this._detalleVentaSvc.getNextDate();

    const user = localStorage.getItem('identity');
    if(user){
      this.currentUser = JSON.parse(user);
    }else{
      this.currentUser = null;
    }
    this.cabeceraVentaForm = this._fb.group({
      num_factura:[this.invoiceNumber, [Validators.required]],//
      fecha_emision:[this.invoiceDate, [Validators.required]],//
      fecha_validez:[this.invoiceDate, [Validators.required]],
      ndoc_cliente:[this.cliente.dni, [Validators.required]],//
      rs_cliente:[this.cliente.razon_social, [Validators.required]],//
      dir_cliente:[this.cliente.direccion, [Validators.required]],//
      telf_cliente:[this.cliente.telefono, [Validators.required]],//
      email_cliente:[this.cliente.correo, [Validators.required]],//
      total_venta:[0],
      estado_venta:['', [Validators.required]],//
      forma_pago:['', [Validators.required]],//
      observaciones:[''],
      user_id:['', [Validators.required]],//
      sucursal_id:['', [Validators.required]],//
      cliente_id:[this.cliente.id , [Validators.required]]//
    } as FormControlOptions);
  }

  ngOnInit(): void {
    this.getAlmacenes();
    this.getArticulos();
    this.getClientes();
  }

  getClientes(): void {
    this._clienteSvc.obtenerClientes()
      .subscribe(
        {
          next: (res: any)=>{
          },
          error: (err: any)=> {
            console.log(err);
          }
        }
      )
  }

  //Lista los almacenes almacenados
  getAlmacenes(): void {
    this._almacenSvc.obtenerAlmacenes()
      .subscribe(
        {
          next: (res: AlmacenModel[]) => {
            this.almacenes = res;
          },
          error: (err:any) => {
            console.log(err);
          }
        }
      )
  }

  //Captura la cedula ingresada
  onKeyDown(evento:any){
    let cedula = evento.target.value;
    if (evento.key === 'Tab') {
      evento.preventDefault();  // Esto evita el comportamiento predeterminado del tabulador.
      this.checkDNI(cedula);
    } 
  }

  //Doble click
  //Regresar los valores a consumidor final
  dblClick(evento:any): void {
    this.cabeceraVentaForm.get('cliente_id')?.setValue(this.cliente.id);
    this.cabeceraVentaForm.get('ndoc_cliente')?.setValue(this.cliente.dni);
    this.cabeceraVentaForm.get('rs_cliente')?.setValue(this.cliente.razon_social);
    this.cabeceraVentaForm.get('dir_cliente')?.setValue(this.cliente.direccion);
    this.cabeceraVentaForm.get('email_cliente')?.setValue(this.cliente.correo);
    this.cabeceraVentaForm.get('telf_cliente')?.setValue(this.cliente.telefono);
  }

  //Validar la cedula 
  checkDNI(cedula:string){
    this.isValid = this._detalleVentaSvc.checkDNICliente(cedula);
    if(cedula === '9999999999999'){
      Swal.fire({
        icon: 'info',
        title: 'Consumidor final',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000
      });
    }else if (!this.isValid){
      Swal.fire({
        icon: 'error',
        title: 'Cédula incorrecta',
        toast: true,
        position: 'center',
        showConfirmButton: false,
        timer: 2000
      });
    }else{
      this.searchCliente(cedula);
    }
  }

  //Buscar el cliente en la BD
  searchCliente(cedula:any){
    this._clienteSvc.obtenerClienteXDNI(cedula)
      .subscribe(
        {
          next: (res: ClienteModel) => {
           this.cabeceraVentaForm.get('cliente_id')?.setValue(res.id);
           this.cabeceraVentaForm.get('ndoc_cliente')?.setValue(res.numero_documento);
           this.cabeceraVentaForm.get('rs_cliente')?.setValue(res.razon_social);
           this.cabeceraVentaForm.get('dir_cliente')?.setValue(res.direccion);
           this.cabeceraVentaForm.get('email_cliente')?.setValue(res.correo);
           this.cabeceraVentaForm.get('telf_cliente')?.setValue(res.telefono);
          },
          error: (err:any) => {
            Swal.fire({
              icon:'question',
              title: 'Cliente no encontrado',
              text: '¿Deseas registrarlo?',
              showCancelButton: true,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
            }).then((result)=>{
              if(result.isConfirmed){
                this._router.navigate(['../../cliente']);
              }else {
                this.cabeceraVentaForm.get('cliente_id')?.setValue(this.cliente.id);
                this.cabeceraVentaForm.get('ndoc_cliente')?.setValue(this.cliente.dni);
                this.cabeceraVentaForm.get('rs_cliente')?.setValue(this.cliente.razon_social);
                this.cabeceraVentaForm.get('dir_cliente')?.setValue(this.cliente.direccion);
                this.cabeceraVentaForm.get('email_cliente')?.setValue(this.cliente.correo);
                this.cabeceraVentaForm.get('telf_cliente')?.setValue(this.cliente.telefono);
              }
            });
          }
        }
      )
  }

  registrarVenta(): void {
    this.cabeceraVentaSubmitted = true;
    if(this.cabeceraVentaForm.invalid){
      return;
    }
    this.btnGrabarVenta = false;
    this.btnDetalleVenta = true;
    this._ventaSvc.registrarVenta(this.cabeceraVentaForm.value)
      .subscribe(
        {
          next: (res: VentaModel) => {
            this.idVenta = res.id;
            Swal.fire({
              icon: 'success',
              title: 'Datos registrados',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 2000
            });
            this.cabeceraVentaSubmitted= false;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  getArticulos(): void {
    this._articulosSvc.obtenerArticulos()
      .subscribe(
        {
          next: (res: ArticuloModel[]) => {
            this.articulos = res;
            this.totalArticulos = this.articulos.length;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  //Agregar articulos a la lista
  addArticulo(item:any){
    this.articulos.splice(this.articulos.indexOf(item),1);
    this.totalArticulos = this.totalArticulos - 1;

    let detalles = {
      id : item.id,
      codigo: item.codigo,
      tipo: item.tipo_prod,
      iva: item.iva,
      nombre_producto: item.nombre_producto,
      producto_id: item.id,
      venta_id: this.idVenta,
      precio_venta: item.precio_venta,
      cantidad: 1,
      descuento: 0
    }
    this.detalleVenta.push(detalles);
  }

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
    this.detalleVenta.forEach(element => {
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
    this.detalleVenta.forEach(element => {
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
    this.detalleVenta.forEach(element => {
      if(element.producto_id === id){
        element.precio_venta = parseFloat(evento.target.value);
      }
    });
  }

  //La funcion elimina de la lista Detalle de compras un item seleccionado por el usuario
  deleteItem(index: number, item:any){
    this.detalleVenta.splice(index, 1)
    this.articulos.push(item);
    this.totalArticulos = this.totalArticulos + 1;
  }

  getSubtotal(): number {
    return this.detalleVenta
      .reduce((acc, producto) => 
        acc+((producto.cantidad * producto.precio_venta)
      -((producto.cantidad * producto.precio_venta)*(producto.descuento / 100))), 0);
  }

   // Métodos para calcular subtotal, IVA y total

  getIva(): number {
    let iva=0;
    this.detalleVenta.forEach(e=>{
      iva = iva + ((e.cantidad * e.precio_venta) * (e.iva / 100));
    });
    return iva;
  }

  //Calcular total servicios
  getTotalServicios(): number {
    let total=0;
    this.detalleVenta.forEach(e=>{
      if(e.iva === 0){
        total = total + (e.cantidad * e.precio_venta) - ((e.cantidad * e.precio_venta)*(e.descuento/100))
      }
    });
    return total;
  }
  //Calcular total bienes
  getTotalBienes(): number {
    let total=0;
    this.detalleVenta.forEach(e=>{
      if(e.iva !== 0){
        total = total + (e.cantidad * e.precio_venta) - ((e.cantidad * e.precio_venta)*(e.descuento/100))
      }
    });
    return total;
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const iva = this.getIva();
    return subtotal + iva;
  }

  registrarDetVenta(): void {
    if(!this.idVenta){
      Swal.fire({
        toast:true,
        icon:'warning',
        title:'Genera los datos de la venta',
        timer:2500,
        position:'center',
        showConfirmButton:false
      })
      return;
    }
    let data:Array<any> = [];
    this.detalleVenta.forEach(element => {
      data.push({
        cantidad:element.cantidad,
        descuento:element.descuento,
        precio_venta:element.precio_venta,
        venta_id:this.idVenta,
        producto_id:element.producto_id
      });
    });
    this._detalleVentaSvc.registrarDetVenta(this.idVenta,data)
      .subscribe(
        {
          next: (res: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada',
              showConfirmButton: true,
            }).then((result)=>{
              if(result.isConfirmed){
                this._router.navigate(["/ventas"]);
              }
            });
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }


  registrarCliente(cedula:string){
    console.log(cedula);
  }

  filterOptions(evento:any){
    console.log(evento.target.value);
  }

  //Esta funcion verifica que el formulario reactivo no este vacio o cumpla con las validaciones correspondiente
  campoNoValido(campo:string){
    if(this.cabeceraVentaForm.get(campo)?.invalid && this.cabeceraVentaSubmitted){
      return true;
    }else {
      return false;
    }
  }
    

  ngOnDestroy(): void {
    
  }

}
