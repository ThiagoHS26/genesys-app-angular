import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../../auth/services/auth.service';
import { DetalleVentaInterface } from '../interfaces/venta-detalle.interface';
import { Observable, map } from 'rxjs';
import { VentaDetalleModel } from '../models/venta-detalle.model';

const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class VentaDetalleService {

  private prefix: string = '001-001-';
  private currentNumber: number = 1;
  private token;

  constructor(private _http: HttpClient, private _authSvc: AuthService) { 
    this.token = this._authSvc.checkAuthentication();
  }

  getNextInvoiceNumber(): string {
    const numberStr = this.currentNumber.toString().padStart(9, '0');
    const nextInvoiceNumber = `${this.prefix}${numberStr}`;
    this.currentNumber++;
    return nextInvoiceNumber;
  }

  getNextDate():string {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const fullDate = `${yyyy}/${mm}/${dd}`;
    return fullDate;
  }

  checkDNICliente(cedula: string): Boolean{

    if (cedula.length !== 10) {
      return false;
    }

    // Extraer los dígitos de la cédula
    const digitos = cedula.split('').map(d => parseInt(d, 10));
    // Verificar que los primeros dos dígitos correspondan a una provincia válida (01-24)
    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) {
      return false;
    }

    // Verificar que el tercer dígito sea menor a 6 (para personas naturales)
    const tercerDigito = digitos[2];
    if (tercerDigito >= 6) {
      return false;
    }

    // Aplicar el algoritmo de verificación
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < coeficientes.length; i++) {
      let producto = digitos[i] * coeficientes[i];
      if (producto >= 10) {
        producto -= 9;
      }
      suma += producto;
    }

    const digitoVerificador = digitos[9];
    const modulo = suma % 10;
    const digitoCalculado = modulo === 0 ? 0 : 10 - modulo;

    return digitoCalculado === digitoVerificador;
  }

  registrarDetVenta(id:string, data: DetalleVentaInterface[]): Observable<VentaDetalleModel[]>{
    let headers = new HttpHeaders({'Authorization':`Bearer ${this.token}`});
    return this._http.post<VentaDetalleModel[]>(`${URL}venta-producto/create/${id}`, data, {headers}).pipe(
      map((response:any)=>response.data)
    );
  }

}
