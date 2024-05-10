import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable, map } from 'rxjs';
import { ArticuloModel } from '../models/articulo.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArticuloInterface } from '../interfaces/articulo.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  public token;

  constructor(private _authSvc: AuthService, private _http: HttpClient) {
    this.token = this._authSvc.checkAuthentication();
  }

  //Obtener articulos
  obtenerArticulos(): Observable<ArticuloModel[]> {
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<ArticuloModel[]>(`${URL}producto/get-all`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Registrar articulos
  registrarArticulo(data: ArticuloInterface): Observable<ArticuloModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<ArticuloModel>(`${URL}producto/create`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Obtener articulo x Id
  obtenerArticuloXId(id: string): Observable<ArticuloModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<ArticuloModel>(`${URL}producto/get-one/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Actualizar Articulo
  actualizarArticulo(id: string, data: ArticuloInterface): Observable<ArticuloModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.put<ArticuloModel>(`${URL}producto/update/${id}`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Eliminar Articulo
  eliminarArticulo(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.delete(`${URL}producto/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
