import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { ClienteModel } from '../models/cliente.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ClienteInterface } from '../interfaces/cliente.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  public token;

  constructor(private _authSvc: AuthService, private _http: HttpClient) {
    this.token = this._authSvc.checkAuthentication();
  }

  obtenerClientes(): Observable<ClienteModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<ClienteModel[]>(`${URL}cliente/get-all`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  registrarCliente(data: ClienteInterface): Observable<ClienteModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<ClienteModel>(`${URL}cliente/create`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  obtenerClienteXId(id: string): Observable<ClienteModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<ClienteModel>(`${URL}cliente/get-one/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  actualizarCliente(id: string, data: ClienteInterface): Observable<ClienteModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.put<ClienteModel>(`${URL}cliente/update/${id}`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  eliminarCliente(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.delete<any>(`${URL}cliente/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
