import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProveedorService } from './services/proveedor.service';
import { ProveedorModel } from './models/proveedor.model';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-distribuidor',
  templateUrl: './distribuidor.component.html',
  styleUrl: './distribuidor.component.css'
})
export class DistribuidorComponent implements OnInit, OnDestroy {

  @ViewChild('modalTitle') modalRef!:ElementRef;
  public modalTitulo!:string;
  public showRegisterBtn: Boolean = true;
  public showEditBtn: Boolean = true;

  public TipoDocumento:Array<string>= ['CEDULA','RUC','PASAPORTE'];
  public Estados:Array<string>= ['ACTIVO','INACTIVO'];
  
  public proveedorForm: FormGroup;
  public proveedorFormSubmitted: Boolean = false;
  public proveedores: ProveedorModel[] = [];

  constructor(private _provSvc: ProveedorService, private _fb:FormBuilder){
    this.proveedorForm = this._fb.group({
      numero_documento: ['', [Validators.required]],
      nombres_completos: ['', [Validators.required]],
      razon_social: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      movil: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      estado: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getProveedores();
  }

  addRegisterTitle(){
    this.proveedorForm.reset({
      estado: ''
    });
    this.showRegisterBtn = true;
    this.showEditBtn = false;
    this.modalTitulo = "Agregar proveedor";
    const headTitle = this.modalRef.nativeElement;
    headTitle.innerHTML = this.modalTitulo;
  }

  getProveedores(){
    this._provSvc.obtenerProveedores()
      .subscribe(
        {
          next: (res: ProveedorModel[]) => {
            this.proveedores = res;
          },
          error: (err: any) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'No hay proveedores registrados',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      )
  }

  createProveedor(){
    this.proveedorFormSubmitted = true;
    if(this.proveedorForm.invalid){
      return;
    }
    this._provSvc.registrarProveedor(this.proveedorForm.value)
     .subscribe(
        {
          next: (res: ProveedorModel) => {
            Swal.fire({
              title: 'Proveedor creado',
              text: 'El proveedor ha sido creado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              this.getProveedores();
              if(result.isConfirmed){
                this.getProveedores();
                this.proveedorForm.reset({
                  estado: ''
                });
                this.proveedorFormSubmitted = false;
              }
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  completeProvForm(id: string){
    this.showRegisterBtn = false;
    this.showEditBtn = true;
    this.modalTitulo = "Editar proveedor";
    const headTitle = this.modalRef.nativeElement;
    headTitle.innerHTML = this.modalTitulo;
    localStorage.setItem('idProv',id);
    this._provSvc.obtenerProveedorXId(id)
      .subscribe(
        {
          next: (res: ProveedorModel) => {
            this.proveedorForm.setValue({
              numero_documento: res['numero_documento'],
              nombres_completos: res['nombres_completos'],
              razon_social: res['razon_social'],
              ciudad: res['ciudad'],
              direccion: res['direccion'],
              telefono: res['telefono'],
              movil: res['movil'],
              correo: res['correo'],
              estado: res['estado']
            });
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  updateProveedor(){
    const idProv = localStorage.getItem('idProv');
    this.proveedorFormSubmitted = true;
    if(this.proveedorForm.invalid){
      return;
    }
    this._provSvc.actualizarProveedor(idProv!,this.proveedorForm.value)
      .subscribe(
        {
          next: (res: ProveedorModel) =>{
            Swal.fire({
              title: 'Proveedor actualizado',
              text: 'El proveedor ha sido actualizado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getProveedores();
                this.proveedorForm.reset({
                  estado: ''
                });
                this.proveedorFormSubmitted = false;
                localStorage.removeItem('idProv');
              }
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  deleteProv(id: string){
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
          this._provSvc.eliminarProveedor(id)
            .subscribe(
              {
                next: (res: any) => {
                  Swal.fire({
                    title: 'Eliminado!',
                    text: 'El proveedor ha sido eliminado',
                    icon:'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                  this.getProveedores();
                },
                error: (err: any) => {
                  console.log(err);
                }
              }
            )
        }
    });
  }

  campoNoValido(campo:string){
    if((this.proveedorForm.get(campo)?.invalid && this.proveedorFormSubmitted)) {
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
  }

}
