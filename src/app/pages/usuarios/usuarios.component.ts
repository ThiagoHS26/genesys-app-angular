import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from './services/usuario.service';
import { UsuarioModel } from './models/usuario.model';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { FormGroup, Validators, FormBuilder, FormControlOptions } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css'
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public dtOptions: ADTSettings = {};
  public dtTrigger = new Subject<ADTSettings>();
  public usuarios: UsuarioModel[]=[];
  public editUsuario: Array<any>=[];

  public Roles:Array<string>= ['ADMINISTRADOR','EDITOR','LECTOR'];
  public TipoDocumento:Array<string>= ['CEDULA','RUC','PASAPORTE'];
  public Estados:Array<string>= ['ACTIVO','INACTIVO'];

  public registerForm: FormGroup;
  public editForm: FormGroup;
  public passForm: FormGroup;
  public passFormSubmitted: Boolean = false;
  public editFormSubmitted:Boolean = false;
  public registerFormSubmitted:Boolean = false;

  constructor(
    private _userSvc: UsuarioService,
    private _fb: FormBuilder
  ){
    this.registerForm = this._fb.group({
      tipo_documento: ['',[Validators.required]],
      numero_documento: ['',[Validators.required]],
      nombres_completos: ['',[Validators.required]],
      username: ['',[Validators.required]],
      email: ['',[Validators.required]],
      password: ['',[Validators.required]],
      password_verify: ['',[Validators.required]],
      movil: ['',[Validators.required]],
      role: ['',[Validators.required]],
      estado: ['',[Validators.required]]
    },{
      validators: this.comparePasswords('password','password_verify')
    } as FormControlOptions);

    this.editForm = this._fb.group({
      tipo_documento: ['',[Validators.required]],
      numero_documento: ['',[Validators.required]],
      nombres_completos: ['',[Validators.required]],
      username: ['',[Validators.required]],
      email: ['',[Validators.required]],
      movil: ['',[Validators.required]],
      role: ['',[Validators.required]],
      estado: ['',[Validators.required]]
    });

    this.passForm = this._fb.group({
      newPass: ['',[Validators.required]],
      password_verify: ['',[Validators.required]]
    },{
      validators: this.comparePasswords('newPass','password_verify')
    } as FormControlOptions );
  }

  ngOnInit(): void {
    this.configDtOptions();
    this.getUsers();
    
  }

  configDtOptions(){
    this.dtOptions = {
      pagingType: 'simple',
      pageLength: 10,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'}
    };
  }

  getUsers(){
    this._userSvc.obtenerUsuarios()
     .subscribe(
      {
        next: (res: UsuarioModel[]) => {
          this.usuarios = res;
          this.dtTrigger;//check this out!!
        },
        error: (err: any) => {
          console.log(err);
        }
      }
     )
  }

  createUser(){
    this.registerFormSubmitted = true;
    if(this.registerForm.invalid){
      return;
    }
    this._userSvc.registrarUsuario(this.registerForm.value)
      .subscribe(
        {
          next: (res: UsuarioModel) => {
            Swal.fire({
              icon:'success',
              title: 'Usuario registrado',
              showConfirmButton: false,
              timer: 1500
            });
            this.registerForm.reset({
              tipo_documento: '',
              role: '',
              estado: ''
            });
            this.registerFormSubmitted = false;
            this.getUsers();
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  completeForm(id: string){
    this._userSvc.obtenerUsuarioXId(id)
     .subscribe(
        {
          next: (res: UsuarioModel) => {
            localStorage.setItem('idUser',id);
            this.editForm.setValue({
              tipo_documento: res['tipo_documento'],
              numero_documento: res['numero_documento'],
              nombres_completos: res['nombres_completos'],
              username: res['username'],
              email: res['email'],
              movil: res['movil'],
              role: res['role'],
              estado: res['estado']
            });
          },
          error: (err: any) => {
            console.log(err);
          }
        }
    )
  }

  updateUser(){
    const id = localStorage.getItem('idUser');
    this.editFormSubmitted = true;
    if(this.editForm.invalid){
      return;
    }
    this._userSvc.actualizarUsuario(id!,this.editForm.value)
      .subscribe(
        {
          next: (res: UsuarioModel) => {
            Swal.fire({
              icon:'success',
              title: 'Usuario actualizado',
              showConfirmButton: false,
              timer: 1500
            });
            this.editForm.reset({
              tipo_documento: '',
              role: '',
              estado: ''
            });
            localStorage.removeItem('idUser');
            this.editFormSubmitted = false;
            this.getUsers();
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  getUserId(id: string){
    localStorage.setItem('idUser',id);
  }

  updatePassword(){
    const identity = JSON.parse(localStorage.getItem('identity')!);
    const idUser = localStorage.getItem('idUser');
    this.passFormSubmitted = true;
    if(this.passForm.invalid){
      return;
    }
    this._userSvc.actualizarContraseña(idUser!, this.passForm.value)
      .subscribe(
        {
          next: (res: Object) => {
            if(identity.id === idUser){
              Swal.fire({
                icon: 'info',
                title: 'Contraseña actualizada',
                text: 'Inicia sesión nuevamente!',
                showConfirmButton: true
              }).then((result)=>{
                if(result.isConfirmed){
                  localStorage.removeItem('token');
                  localStorage.removeItem('identity');
                  location.href = "/login";
                }else {
                  localStorage.removeItem('token');
                  localStorage.removeItem('identity');
                  location.href = "/login";
                }
              })
            }else{
              Swal.fire({
                icon:'success',
                title: 'Contraseña actualizada',
                showConfirmButton: false,
                timer: 1500
              });
              this.passForm.reset();
              this.passFormSubmitted = false;
            }
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  deleteUser(id: string){
    const identity = JSON.parse(localStorage.getItem('identity')!);
    if(identity.id === id){
      Swal.fire({
        title: 'Acción no permitida',
        text: 'No puedes autoeliminarte',
        icon: 'error',
        timer: 2500,
        showConfirmButton: false
      });
    }else{
      Swal.fire({
        title: 'Estas seguro?',
        text: "No podrás revertir esto!",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, eliminar!'
      }).then((result)=>{
        if(result.isConfirmed){
          this._userSvc.elimnarUsuario(id)
            .subscribe(
              {
                next: (res:any) => {
                  Swal.fire({
                    title: 'Eliminado!',
                    text: 'El usuario ha sido eliminado',
                    icon:'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                  this.getUsers();
                }
              }
            )
        }
      });
    }

  }

  changeDoc(evento:any){
    //console.log(evento.target.value);
  }

  changeRole(evento:any){
    //console.log(evento.target.value);
  }

  changeEstado(evento:any){
    //console.log(evento.target.value);
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

    if((this.registerForm.get(campo)?.invalid && this.registerFormSubmitted) || 
        (this.editForm.get(campo)?.invalid && this.editFormSubmitted) || 
          this.passForm.get(campo)?.invalid && this.passFormSubmitted) {
      return true;
    }else{
      return false;
    }

  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }


}
