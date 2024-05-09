import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class loggerInterceptor implements HttpInterceptor {

  constructor(public _authSvc: AuthService, private _router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    const token = this._authSvc.checkAuthentication();
    let request = req;

    if(token){
      request = req.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((err:HttpErrorResponse) => {
        if(err.status === 401){
          this._router.navigateByUrl('/login');
          localStorage.removeItem('token');
          localStorage.removeItem('identity');
        }
        return throwError(()=>err);
      })
    );
  }

}
