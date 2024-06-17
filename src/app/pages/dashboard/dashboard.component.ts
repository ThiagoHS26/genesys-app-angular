import { Component, OnInit } from '@angular/core';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  public totalCompras!:number;
  public totalVentas!:number;
  public totalClientes!:number;
  public totalProductos!:number;
  constructor(private _dashSvc: DashboardService){}

  ngOnInit(): void {
    this.getSumCompras();
    this.getSumVentas();
    this.getCountClientes();
    this.getCountProducts();
  }

  //Obtener ventas totales
  getSumVentas(){
    this._dashSvc.getSumVentas()
      .subscribe(
        {
          next:(res:number)=>{
            this.totalVentas = res;
          },
          error:(err:any)=>{
            console.log(err);
          }
        }
      )
  }


  //Obtener compras totales
  getSumCompras(){
    this._dashSvc.getSumCompras()
      .subscribe(
        {
          next: (res:number) => {
            this.totalCompras=res;
          },
          error:(err:any) => {
            console.log(err);
          }
        }
      )
  }

  //Obtener numero de clientes registrados
  getCountClientes(){
    this._dashSvc.getcountClientes()
      .subscribe(
        {
          next:(res:number)=>{
            this.totalClientes = res;
          },
          error:(err:any)=>{
            console.log(err);
          }
        }
      )
  }

  //Obtener cantidad de bienes y servicios registrados
  getCountProducts(){
    this._dashSvc.getCountProducts()
      .subscribe(
        {
          next:(res:number)=>{
            this.totalProductos = res;
          },
          error:(err:any)=>{
            console.log(err);
          }
        }
      )
  }

}
