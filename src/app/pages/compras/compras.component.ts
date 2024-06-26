import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompraModel } from './models/compra.model';
import { CompraService } from './services/compra.service';
import { ProveedorService } from '../distribuidor/services/proveedor.service';
import Swal from 'sweetalert2';
import { Subject, forkJoin, map, mergeMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrl: './compras.component.css'
})
export class ComprasComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject<void>();

  public compras:Array<CompraModel> = [];
  public proveedor = {
    ciudad:"",
    direccion:"",
    razon_social:"",
    correo:""
  };
  public facturaCompra:Array<any>=[];
  public usuario;
  public total:number = 0;

  constructor(
    private _compraSvc: CompraService, 
    private _provSvc: ProveedorService
  ){
    this.usuario = JSON.parse(localStorage.getItem('identity')!);
  }

  ngOnInit(): void {
    this.getCompras();
  }

  getCompras(){
    this._compraSvc.obtenerCompras()
     .subscribe(
      {
        next: (res: CompraModel[]) => {
          this.compras = res;
        },
        error: (err: any) => {
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: 'No hay compras registradas',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }
     )
  }

  getCompraDetalle(id:string){//Factura
    this._compraSvc.obtenerCompraDetalle(id).pipe(
      mergeMap((compra:any) => {
        this.total = compra.total_compra;
        this.facturaCompra = Object.values(compra);
        return this._provSvc.obtenerProveedorXId(compra.distribuidor_id);
      }),
      takeUntil(this.unsubscribe$)
    ).subscribe(
      {
        next:(prov: any)=>{
          this.proveedor = prov;
        },
        error: (err:any)=>{
          console.log(err);
        }
      }
    );
    

  }

  deleteCompra(id:string){
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
        this._compraSvc.eliminarCompra(id)
          .subscribe(
            {
              next: (res: any) => {
                Swal.fire({
                  title: 'Eliminado!',
                  text: 'La compra ha sido eliminada',
                  icon:'success',
                  timer: 1500,
                  showConfirmButton: false
                });
                this.getCompras();
              },
              error: (err: any) => {
                console.log(err);
              }
            }
          )
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
