import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControlOptions, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {

  public registerForm: FormGroup;
  public registerFormSubmitted:Boolean = false;

  constructor (private _fb: FormBuilder, private _authSvc: AuthService, private _router: Router) {
    this.registerForm = this._fb.group({
      numero_documento: ['', [Validators.required]],
      nombres_completos: ['',[Validators.required]],
      direccion: ['Default'],
      ciudad: ['Default'],
      username: ['',[Validators.required]],
      email: ['',[Validators.required]],
      password: ['',[Validators.required]],
      password_verify: ['',[Validators.required]],
      role: ['ADMINISTRADOR'],
      movil: ['0999999999'],
      estado: ['ACTIVO']
    },{
      validators: this.comparePasswords('password','password_verify')
    } as FormControlOptions);

  }

  ngOnInit(): void {
    
  }

  createUser(){
    this.registerFormSubmitted = true;
    if(this.registerForm.invalid){
      return;
    }
    console.log(this.registerForm.value);
    this._authSvc.register(this.registerForm.value)
      .subscribe(
        {
          next: (res: any) => {
            Swal.fire({
              icon:'success',
              title: 'Usuario registrado',
              showConfirmButton: false,
              timer: 1500
            });
            this.registerFormSubmitted = false;
            this._router.navigate(['/login']);
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  comparePasswords(pass1: string, pass2: string){
    return(formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1);
      const pass2Control = formGroup.get(pass2);
      if(pass1Control!.value === pass2Control!.value){
        pass2Control!.setErrors(null);
      }else{
        pass2Control!.setErrors({noEsIgual:true});
      }
    }
  }

  campoNoValido(campo:string){

    if(this.registerForm.get(campo)?.invalid && this.registerFormSubmitted)  {
      return true;
    }else{
      return false;
    }

  }

  ngOnDestroy(): void {
    
  }


}
