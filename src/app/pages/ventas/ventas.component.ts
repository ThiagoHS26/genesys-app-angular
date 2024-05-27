import { Component, OnDestroy, OnInit } from '@angular/core';
import { VentaService } from './services/venta.service';
import { VentaModel } from './models/venta.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css'
})
export class VentasComponent implements OnInit, OnDestroy {

  public ventas:VentaModel[] = []

  constructor(
    private _ventaSvc: VentaService
  ){}

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
            console.log(this.ventas);
          },
          error: (err:any) => {
            console.log(err);
          }
        }
      )
  }

  //Funcion para eliminar una venta
  deleteVenta(id:string){
    console.log(id);
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


  ngOnDestroy(): void {
    
  }

}
