import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AlmacenModel } from '../models/almacen.model';
import { AuthService } from '../../../auth/services/auth.service';
import { AlmacenInterface } from '../interfaces/almacen.interface';
import { environment } from '../../../../environments/environment';

const URL = environment.urlServer

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private _http: HttpClient, private _authSvc: AuthService) { }

  obtenerAlmacenes(): Observable<AlmacenModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.get<AlmacenModel[]>(`${URL}sucursal/get-all`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  crearAlmacen(data: AlmacenInterface): Observable<AlmacenModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.post<AlmacenModel>(`${URL}sucursal/create`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  obtenerAlmacenXId(id: string): Observable<AlmacenModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.get<AlmacenModel>(`${URL}sucursal/get-one/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  actualizarAlmacen(id: string, data: AlmacenInterface): Observable<AlmacenModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.put<AlmacenModel>(`${URL}sucursal/update/${id}`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  eliminarAlmacen(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.delete<any>(`${URL}sucursal/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  } 
}
