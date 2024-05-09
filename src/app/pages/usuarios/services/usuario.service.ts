import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UsuarioModel } from '../models/usuario.model';
import { Observable, map } from 'rxjs';
import { AuthService } from '../../../auth/services/auth.service';
import { UsuarioInterface } from '../interfaces/usuario.interface';
import { PassInterface } from '../interfaces/newPassword.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private _http: HttpClient, private _authSvc: AuthService) { }

  registrarUsuario(data: UsuarioInterface): Observable<UsuarioModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.post<UsuarioModel>(`${URL}user/create`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  obtenerUsuarios(): Observable<UsuarioModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.get<UsuarioModel[]>(`${URL}user/get-all`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  obtenerUsuarioXId(id:string): Observable<UsuarioModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.get<UsuarioModel>(`${URL}user/get-one/${id}`,{headers});
  }

  obtenerUsuarioxUsername(username:string): Observable<UsuarioModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.get<UsuarioModel>(`${URL}user/get-one-username/${username}`,{headers});
  }

  actualizarUsuario(id: string, data: UsuarioInterface): Observable<UsuarioModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.put<UsuarioModel>(`${URL}user/update/${id}`,data,{headers});
  }

  actualizarContraseña(id: string, data: PassInterface): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.patch(`${URL}user/change-pass/${id}`,data,{headers});
  }

  elimnarUsuario(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this._authSvc.checkAuthentication()}`});
    return this._http.delete(`${URL}user/delete/${id}`,{headers});
  }
}
