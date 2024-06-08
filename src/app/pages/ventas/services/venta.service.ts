import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { VentaModel } from '../models/venta.model';
import { Observable, map } from 'rxjs';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  public token;

  constructor(private _authSvc:AuthService, private _http:HttpClient) {
    this.token = this._authSvc.checkAuthentication();
  }

  obtenerVentas(): Observable<VentaModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<VentaModel[]>(`${URL}venta/get-all`, {headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  obtenerVentaDetalle(id:string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get(`${URL}venta-detalle/get-one/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  eliminarVenta(id:string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.delete(`${URL}venta/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
