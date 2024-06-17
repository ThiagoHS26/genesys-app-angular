import { Component, OnDestroy, OnInit } from '@angular/core';
import { VentaService } from './services/venta.service';
import { VentaModel } from './models/venta.model';
import Swal from 'sweetalert2';
import { Subject, forkJoin, map, mergeMap, takeUntil } from 'rxjs';
import { ClienteService } from '../cliente/services/cliente.service';
import { formatDate } from '@angular/common';
import { ArticuloService } from '../producto/services/articulo.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  public currentUser;
  public ventas:VentaModel[] = [];
  public cliente={
    razon_social:'',
    numero_documento:'',
    direccion:'',
    telefono:'',
    correo:''
  };
  public ventaDetalle = {
    num_factura: '',
    createdAt:'',
    detVentas: [{
      codigo_producto:'',
      nombre_producto:'',
      cantidad:0,
      precio_venta:0,
      descuento:0,
      subtotal:0
    }]
  };
  public productos:Array<any> = [];
  public total:number = 0;
  public fechaEmision;
  public subtotalServicios: number = 0;

  constructor(
    private _ventaSvc: VentaService,
    private _clienteSvc: ClienteService,
    private _prodSvc: ArticuloService
  ){
    this.currentUser = JSON.parse(localStorage.getItem('identity')!);
    this.fechaEmision = formatDate(new Date(), 'yyyy/MM/dd', 'en-US');
  }

  ngOnInit(): void {
    this.getAllVentas();
  }

  //Esta funcion obtiene todas las ventas registradas en el BD
  getAllVentas(){
    this._ventaSvc.obtenerVentas()
      .subscribe(
        {
          next: (res: VentaModel[]) => {
            this.ventas = res
          },
          error: (err:any) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'No hay ventas registradas',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      )
  }

  //Funcion para eliminar una venta
  deleteVenta(id:string){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        this._ventaSvc.eliminarVenta(id)
          .subscribe(
            {
              next: (res: any) => {
                Swal.fire({
                  title: 'Eliminado!',
                  text: 'La venta ha sido eliminada',
                  icon:'success',
                  timer: 1500,
                  showConfirmButton: false
                });
                this.getAllVentas();
              },
              error: (err: any) => {
                console.log(err);
              }
            }
          )
      }
    });
  }

  //Obtener venta y detalle de venta para completar la factura
  getVentaDetalle(id: string): void {
    this._ventaSvc.obtenerVentaDetalle(id).pipe(
      mergeMap((venta: any) => {
        this.total = venta.total_venta;
        this.ventaDetalle = venta;
        const cliente$ = this._clienteSvc.obtenerClienteXId(venta.cliente_id);

        // Crear un array de observables para cada producto
        const productos$ = venta.detVentas.map((p: any) => 
          this._prodSvc.obtenerArticuloXId(p.producto_id)
        );

        // Usar forkJoin para esperar a que todas las solicitudes de productos se completen
        return forkJoin([cliente$, ...productos$]).pipe(
          map(([cliente, ...productos]) => ({
            cliente,
            productos
          }))
        );
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe({
      next: ({ cliente, productos }) => {
        this.cliente = cliente;
        this.productos = productos;
        this.productos.forEach(element => {
          if(element.tipo_prod === "SERVICIO"){
            this.subtotalServicios += element.precio_venta;
          }
        });
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }


  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
