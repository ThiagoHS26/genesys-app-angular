import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable, map } from 'rxjs';
import { ProveedorModel } from '../models/proveedor.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProveedorInterface } from '../interfaces/proveedor.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  public token;
  constructor(private _authSvc: AuthService, private _http: HttpClient) {
     this.token = this._authSvc.checkAuthentication();
  }

  obtenerProveedores(): Observable<ProveedorModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<ProveedorModel[]>(`${URL}distribuidor/get-all`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  obtenerProveedorXId(id: string): Observable<ProveedorModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<ProveedorModel>(`${URL}distribuidor/get-one/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  registrarProveedor(data: ProveedorInterface): Observable<ProveedorModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<ProveedorModel>(`${URL}distribuidor/create`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  actualizarProveedor(id: string, data: ProveedorInterface): Observable<ProveedorModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.put<ProveedorModel>(`${URL}distribuidor/update/${id}`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  eliminarProveedor(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.delete<any>(`${URL}distribuidor/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
