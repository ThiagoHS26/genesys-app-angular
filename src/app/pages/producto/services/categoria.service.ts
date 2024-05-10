import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { CategoriaModel } from '../models/categoria.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { CategoriaInterface } from '../interfaces/categoria.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  public token;

  constructor(private _authSvc: AuthService, private _http: HttpClient) {
    this.token = this._authSvc.checkAuthentication();  
  }

  //Obtener categorias
  obtenerCategorias(): Observable<CategoriaModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<CategoriaModel[]>(`${URL}categoria/get-all`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Crear categoria
  registrarCategoria(data: CategoriaInterface): Observable<CategoriaModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<CategoriaModel>(`${URL}categoria/create`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Obtener categoria por ID
  obtenerCategoriaXId(id: string): Observable<CategoriaModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<CategoriaModel>(`${URL}categoria/get-one/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Actualizar categoria
  actualizarCategoria(id: string, data: CategoriaInterface): Observable<CategoriaModel>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.put<CategoriaModel>(`${URL}categoria/update/${id}`,data,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  //Eliminar categoria
  eliminarCategoria(id: string): Observable<any>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.delete<any>(`${URL}categoria/delete/${id}`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
