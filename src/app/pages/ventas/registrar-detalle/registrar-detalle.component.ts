import { Component, OnDestroy, OnInit } from '@angular/core';
import { VentaDetalleService } from './services/venta-detalle.service';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../cliente/services/cliente.service';
import { ClienteModel } from '../../cliente/models/cliente.model';
import { AlmacenModel } from '../../almacen/models/almacen.model';
import { AlmacenService } from '../../almacen/services/almacen.service';
import Swal from 'sweetalert2';

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
  public cliente:any;

  public formaPagoVenta:Array<string> = ['EFECTIVO','TRANSFERENCIA'];
  public estadoVenta:Array<string> = ['PENDIENTE','PAGADO'];
  public consumidorFinal = {
    num_doc : '999999999999',
    nombres: 'CONSUMIDOR FINAL',
    direccion: 'Avenida Siempre Viva',
    telefono: '0968841791',
    email: 'genesyserp@facturacion.com'
  };
  public cabeceraVentaForm:FormGroup;

  constructor(
    private _detalleVentaSvc: VentaDetalleService, 
    private _fb:FormBuilder, 
    private _clienteSvc: ClienteService,
    private _almacenSvc: AlmacenService
  ){

    const user = localStorage.getItem('identity');
    if(user){
      this.currentUser = JSON.parse(user);
    }else{
      this.currentUser = null;
    }

   this.cabeceraVentaForm = this._fb.group({
    sucursal_id : ['', [Validators.required]],
    cliente_id: ['', [Validators.required]],
    estado_venta: ['',[Validators.required]],
    forma_pago: ['',[Validators.required]],
    observaciones:['']
   } as FormControlOptions);
  }

  ngOnInit(): void {
    this.generateNumFactura();
    this.generateDateFactura();
    this.getAlmacenes();
  }

  //Numeracion automatica de factura
  generateNumFactura(): void{
    this.invoiceNumber=this._detalleVentaSvc.getNextInvoiceNumber();
  }

  //Obtiene la fecha actual 
  generateDateFactura(): void {
    this.invoiceDate=this._detalleVentaSvc.getNextDate();
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

  onKeyDown(evento:any){
    let cedula = evento.target.value;
    if (evento.key === 'Tab') {
      evento.preventDefault();  // Esto evita el comportamiento predeterminado del tabulador.
      this.checkDNI(cedula);
    }
    
  }

  //Validar la cedula 
  checkDNI(cedula:string){
    this.isValid = this._detalleVentaSvc.checkDNICliente(cedula);
    if(cedula === '999999999999'){
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

  //]Buscar el cliente en la BD
  searchCliente(cedula:any){
    this._clienteSvc.obtenerClienteXDNI(cedula)
      .subscribe(
        {
          next: (res: ClienteModel) => {
            console.log(res);
            this.consumidorFinal = {
              num_doc : '0605016179',
              nombres: res.nombres_completos,
              direccion: res.direccion,
              telefono: res.telefono,
              email: res.correo
            };
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
                this.registrarCliente(cedula);
              }else{
                this.consumidorFinal = {
                  num_doc : '999999999999',
                  nombres: 'CONSUMIDOR FINAL',
                  direccion: 'Avenida Siempre Viva',
                  telefono: '0968841791',
                  email: 'genesyserp@facturacion.com'
                };
              }
            });
          }
        }
      )
  }

  registrarCliente(cedula:string){
    console.log(cedula);
  }

  registrarVenta(info:string){
    console.log(info);
  }
    

  ngOnDestroy(): void {
    
  }

}
