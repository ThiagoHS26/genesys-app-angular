import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { CompraModel } from '../models/compra.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CompraInterface } from '../interfaces/compra.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  public token;

  constructor(private _authAvc:  AuthService, private _http: HttpClient) {
    this.token = this._authAvc.checkAuthentication();
  }

  obtenerCompras(): Observable<CompraModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<CompraModel[]>(`${URL}compra/get-all`, {headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Realiza una peticion enviando el id para obtener la compra y sus detalles
  obtenerCompraDetalle(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get(`${URL}compra-detalle/get-one/${id}`, {headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  registrarCompra(data: CompraInterface): Observable<CompraModel> {
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<CompraModel>(`${URL}compra/create`, data, {headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  eliminarCompra(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.delete(`${URL}compra/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
