import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/services/auth.service';
import { Observable, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private token;

  constructor(private _authSvc: AuthService, private _http: HttpClient) { 
    this.token = this._authSvc.checkAuthentication();
  }
  getSumCompras(): Observable<number>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<number>(`${URL}compra/final-compra`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  getSumVentas(): Observable<number>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<number>(`${URL}venta/get-sumatoria`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  getcountClientes(): Observable<number>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<number>(`${URL}cliente/countAll`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }

  getCountProducts(): Observable<number>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.get<number>(`${URL}producto/countAll`,{headers}).pipe(
      map((response:any)=>response.data)
    );
  }
}
