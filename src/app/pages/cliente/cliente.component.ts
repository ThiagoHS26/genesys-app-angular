import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClienteService } from './services/cliente.service';
import { ClienteModel } from './models/cliente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrl: './cliente.component.css'
})
export class ClienteComponent implements OnInit, OnDestroy {

  @ViewChild('modalTitle') modalRef!:ElementRef;
  public modalTitulo!:string;
  public showRegisterBtn: Boolean = true;
  public showEditBtn: Boolean = true;

  public TipoDocumento: Array<string> = ['CEDULA','PASAPORTE','RUC'];
  public Estados: Array<string> = ['ACTIVO','INACTIVO'];
  public clientes: ClienteModel[] = [];

  //Forms
  public clienteForm: FormGroup;
  public clienteFormSubmitted: Boolean = false;

  constructor(private _clienteSvc: ClienteService, private _fb: FormBuilder){
    this.clienteForm = this._fb.group({
      numero_documento: ['', [Validators.required]],
      nombres_completos: ['', [Validators.required]],
      razon_social: ['', [Validators.required]],
      ciudad: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getClientes();
  }

  addRegisterTitle(){
    this.showRegisterBtn = true;
    this.showEditBtn = false;
    this.modalTitulo = "Agregar cliente";
    const headTitle = this.modalRef.nativeElement;
    headTitle.innerHTML = this.modalTitulo;
  }

  getClientes(){
    this._clienteSvc.obtenerClientes()
      .subscribe(
        {
          next: (res: ClienteModel[]) => {
            this.clientes = res;
          },
          error: (err: any) => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'No hay clientes registrados',
              showConfirmButton: false,
              timer: 1500
            });
          }
        }
      )
  }

  createCliente(){
    this.clienteFormSubmitted = true;
    if(this.clienteForm.invalid){
      return;
    }
    this._clienteSvc.registrarCliente(this.clienteForm.value)
      .subscribe(
        {
          next: (res: ClienteModel) => {
            Swal.fire({
              title: 'Cliente creado',
              text: 'El cliente ha sido creado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getClientes();
                this.clienteForm.reset({
                  status: ''
                });
                this.clienteFormSubmitted = false;
              }
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  completeClientForm(id: string){
    this.showRegisterBtn = false;
    this.showEditBtn = true;
    this.modalTitulo = "Editar cliente";
    const headTitle = this.modalRef.nativeElement;
    headTitle.innerHTML = this.modalTitulo;
    this._clienteSvc.obtenerClienteXId(id)
      .subscribe(
        {
          next: (res: ClienteModel) => {
            localStorage.setItem('idClient',id);
            this.clienteForm.setValue({
              numero_documento: res['numero_documento'],
              nombres_completos: res['nombres_completos'],
              razon_social: res['razon_social'],
              ciudad: res['ciudad'],
              direccion: res['direccion'],
              telefono: res['telefono'],
              correo: res['correo'],
              status: res['status']
            });
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  updateCliente(){
    const idClient = localStorage.getItem('idClient');
    this.clienteFormSubmitted = true;
    if(this.clienteForm.invalid){
      return;
    }
    this._clienteSvc.actualizarCliente(idClient!,this.clienteForm.value)
      .subscribe(
        {
          next: (res: ClienteModel) => {
            Swal.fire({
              title: 'Cliente actualizado',
              text: 'El cliente ha sido actualizado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getClientes();
                this.clienteForm.reset({
                  status: ''
                });
                localStorage.removeItem('idClient');
                this.clienteFormSubmitted = false;
                this.getClientes();
              }
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  deleteCliente(id: string){
    Swal.fire({
      title: '¿Estas seguro?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result)=>{
      if(result.isConfirmed){
        this._clienteSvc.eliminarCliente(id)
          .subscribe(
            {
              next: (res: any) => {
                Swal.fire({
                  title: 'Eliminado!',
                  text: 'El cliente ha sido eliminado',
                  icon:'success',
                  timer: 1500,
                  showConfirmButton: false
                });
                this.getClientes();
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
    if(this.clienteForm.get(campo)?.invalid && this.clienteFormSubmitted){
      return true;
    }else{
      return false;
    }
  }

  ngOnDestroy(): void {
    
  }

}
