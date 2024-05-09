import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginInterface } from '../interfaces/login.interface';
import { Observable, of } from 'rxjs';

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

  checkAuthentication():Observable<any>{
    let token = localStorage.getItem('token');
    if(token){
      this.accessToken = token;
    }else{
      this.accessToken = null;
    }
    return this.accessToken;
  }

  getUserIdentity(): Observable<Object | null>{

    let identity = localStorage.getItem('identity');
    if(identity){
      this.userIdentity = JSON.parse(identity);
    }else{
      this.userIdentity = null;
    }
    return this.userIdentity;
  }

}
