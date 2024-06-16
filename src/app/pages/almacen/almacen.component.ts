import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AlmacenService } from './services/almacen.service';
import { AlmacenModel } from './models/almacen.model';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioModel } from '../usuarios/models/usuario.model';
import { UsuarioService } from '../usuarios/services/usuario.service';
import Swal from 'sweetalert2'; 

declare var $:any;

@Component({
  selector: 'app-almacen',
  templateUrl: './almacen.component.html',
  styleUrl: './almacen.component.css'
})
export class AlmacenComponent implements OnInit, OnDestroy{

  @ViewChild('modalTitle') modalRef!:ElementRef;

  public tipos:Array<string> = ['SUCURSAL','MATRIZ'];

  public modalTitulo!:string;
  public showRegisterBtn: Boolean = true;
  public showEditBtn: Boolean = true;

  public almacenes: AlmacenModel[] = [];
  public usuarios: UsuarioModel[] = [];

  public almacenForm: FormGroup;
  public almacenFormSubmitted: Boolean = false;

  constructor(private _almacenSvc: AlmacenService, private _fb: FormBuilder, private _userSvc: UsuarioService) {
    this.almacenForm = this._fb.group({
      nombre: ['', [Validators.required]],
      provincia: ['',[Validators.required]],
      ciudad: ['',[Validators.required]],
      direccion: ['',[Validators.required]],
      correo: ['',[Validators.required]],
      telefono: ['',[Validators.required]],
      tipo:['',[Validators.required]],
      usuario_id: ['',[Validators.required]]
    });
  }
  
  ngOnInit(): void {
    this.getAlmacenes();
    this.getUsuarios();
  }
  
  addRegisterTitle(){
    this.showRegisterBtn = true;
    this.showEditBtn = false;
    this.resetAlmacenForm();
    this.modalTitulo = "Agregar almacén";
    const headTitle = this.modalRef.nativeElement;
    headTitle.innerHTML = this.modalTitulo;
  }

  resetAlmacenForm(){
    this.almacenForm.reset({
      usuario_id: '',
      tipo: ''
    })
  }

  completeAlmacenForm(id:string){
    this.showRegisterBtn = false;
    this.showEditBtn = true;
    this.modalTitulo = "Editar almacén";
    const headTitle = this.modalRef.nativeElement;
    headTitle.innerHTML = this.modalTitulo;
    localStorage.setItem('idStore',id);
    this._almacenSvc.obtenerAlmacenXId(id)
      .subscribe(
        {
          next: (res: AlmacenModel) => {
            this.almacenForm.setValue({
              nombre: res['nombre'],
              provincia: res['provincia'],
              ciudad: res['ciudad'],
              direccion: res['direccion'],
              correo: res['correo'],
              telefono: res['telefono'],
              usuario_id: res['usuario_id'],
              tipo: res['tipo']
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  getAlmacenes(){
    this._almacenSvc.obtenerAlmacenes()
      .subscribe(
        {
          next: (res: AlmacenModel[]) => {
            this.almacenes = res;
          },
          error: (err: any)=>{
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'No hay almacenes registrados',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      )
  }

  getUsuarios(){
    this._userSvc.obtenerUsuarios()
      .subscribe(
        {
          next: (res: UsuarioModel[]) => {
            this.usuarios = res;
          },
          error: (err: any)=>{
            console.log(err);
          }
        }
      )
  }

  createAlmacen(){
    this.almacenFormSubmitted = true;
    if(this.almacenForm.invalid){
      return;
    }
    this._almacenSvc.crearAlmacen(this.almacenForm.value)
      .subscribe(
        {
          next: (res: AlmacenModel) => {
            Swal.fire({
              title: 'Almacén creado',
              text: 'El almacén ha sido creado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getAlmacenes();
                this.resetAlmacenForm();
                this.almacenFormSubmitted = false;
              }
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  updateAlmacen(){
    const idAlmacen = localStorage.getItem('idStore');
    this.almacenFormSubmitted = true;
    if(this.almacenForm.invalid){
      return;
    }
    this._almacenSvc.actualizarAlmacen(idAlmacen!, this.almacenForm.value)
      .subscribe(
        {
          next: (res: AlmacenModel) => {
            Swal.fire({
              title: 'Almacén actualizado',
              text: 'El almacén ha sido actualizado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getAlmacenes();
                this.almacenForm.reset();
                this.almacenFormSubmitted = false;
                localStorage.removeItem('idStore');
              }
            })
          }
        }
      )
  }

  deleteAlmacen(id: string){
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
          this._almacenSvc.eliminarAlmacen(id)
            .subscribe(
              {
                next: (res: any) => {
                  Swal.fire({
                    title: 'Eliminado!',
                    text: 'El almacén ha sido eliminado',
                    icon:'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                  this.getAlmacenes();
                },
                error: (err: any) => {
                  console.log(err);
                }
              }
            )
        }
    });
  }

  changeUser(evento:any){
    //console.log(evento);
  }

  campoNoValido(campo: string){
    if((this.almacenForm.get(campo)?.invalid && this.almacenFormSubmitted)) {
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
  }
}
