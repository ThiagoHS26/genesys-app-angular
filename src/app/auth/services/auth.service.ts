import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginInterface } from '../interfaces/login.interface';
import { Observable, map, of } from 'rxjs';
import { UsuarioModel } from '../../pages/usuarios/models/usuario.model';
import { UsuarioInterface } from '../interfaces/register.interface';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public accessToken:any;
  public userIdentity:any;

  constructor(
    private _http:HttpClient
  ) {}

  login(data: LoginInterface): Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/json');
    return this._http.post(`${URL}login`, data, {headers: headers});
  }

  register(data: UsuarioInterface): Observable<any>{
    return this._http.post(`${URL}user/create`,data).pipe(
      map((response:any)=>response.data)
    );
  }

  checkAuthentication():Observable<any>{
    let token = localStorage.getItem('token');
    if(token){
      this.accessToken = token;
    }else{
      this.accessToken = null;
    }
    return this.accessToken;
  }

  getUserIdentity(): Observable<UsuarioModel>{

    let identity = localStorage.getItem('identity');
    if(identity){
      this.userIdentity = JSON.parse(identity);
    }else{
      this.userIdentity = null;
    }
    return this.userIdentity;
  }

}
