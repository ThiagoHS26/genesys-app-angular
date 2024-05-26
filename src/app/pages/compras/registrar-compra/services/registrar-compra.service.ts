import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { AuthService } from '../../../../auth/services/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { DetalleCompraInterface } from '../interfaces/detalle-compra.interface';
import { DetalleCompraModel } from '../models/registrar-compra.model';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class RegistrarCompraService {

  public token;

  constructor(private _authSvc: AuthService, private _http:HttpClient) {
    this.token = this._authSvc.checkAuthentication();
  }

  registrarDetCompra(id:string, data: DetalleCompraInterface[]): Observable<DetalleCompraModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<DetalleCompraModel[]>(`${URL}compra-producto/create/${id}`, data, {headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
