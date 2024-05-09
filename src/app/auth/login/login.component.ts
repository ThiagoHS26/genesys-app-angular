import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  @ViewChild('password') passwordRef!:ElementRef;
  @ViewChild('tooglePassword') tooglePasswordRef!:ElementRef;

  public user!: string;
  public password!: string;
  public identity!: Object;
  public token!: string;
  public formSubmited:Boolean = false;
  public loginForm!: FormGroup;

  constructor(
    public _authSvs: AuthService,
    public _router:Router
  ){
    this.loginForm = new FormGroup({
      username: new FormControl(localStorage.getItem('username')||'',[Validators.required]),
      password: new FormControl("",[Validators.required]),
      remember: new FormControl(false)
    });
  }

  onInit(): void{}

  onSubmit(){
  
    this.formSubmited = true;

    if(this.loginForm.invalid){
      return;
    }
    
    this._authSvs.login(this.loginForm.value)
      .subscribe(
        {
          next: res => {
            this.token = res.accessToken;
            this.identity = res.user;
            localStorage.setItem('token', this.token);
            localStorage.setItem('identity', JSON.stringify(this.identity));
            if(this.loginForm.get('remember')!.value){
              localStorage.setItem('username', this.loginForm.get('username')?.value);
            }else{
              localStorage.removeItem('username');
            }
            this._router.navigate(['/dashboard']);
          },
          error: err => {
            Swal.fire({
              title: "Error",
              icon:"error",
              text: "Usuario o contraseña incorrectos"
            });
          }
        }
      );

  }

  campoNoValido(campo: string):boolean {

    if(this.loginForm.get(campo)?.invalid && this.formSubmited){
      return true;
    }else{
      return false;
    }
  }

  showPass(){
    const inputPass = this.passwordRef.nativeElement;
    const iconEye = this.tooglePasswordRef.nativeElement;

    if(inputPass.getAttribute('type')==='password'){
      inputPass.setAttribute('type','text');
      iconEye.classList.remove('fa-eye-slash');
      iconEye.classList.add('fa-eye');
    }else{
      inputPass.setAttribute('type','password');
      iconEye.classList.remove('fa-eye');
      iconEye.classList.add('fa-eye-slash');
    }

  }
  
}
