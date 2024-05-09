import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject } from 'rxjs';
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

  //Data Table configuraciones
  public dtOptions: ADTSettings = {};
  public dtTrigger = new Subject<ADTSettings>();

  public TipoDocumento: Array<string> = ['CEDULA','PASAPORTE','RUC'];
  public Estados: Array<string> = ['ACTIVO','INACTIVO'];
  public clientes: ClienteModel[] = [];

  //Forms
  public clienteForm: FormGroup;
  public clienteFormSubmitted: Boolean = false;

  constructor(private _clienteSvc: ClienteService, private _fb: FormBuilder){
    this.clienteForm = this._fb.group({
      tipo_documento: ['', [Validators.required]],
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
    this.configOptions();
    this.getClientes();
  }

  configOptions(){
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language:{url:'//cdn.datatables.net/plug-ins/1.12.1/i18n/es-ES.json'},
      destroy: true
    };
  }

  addRegisterTitle(){
    this.clienteForm.reset({
      tipo_documento: '',
      status: ''
    });
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
            this.dtTrigger.next(this.dtOptions);
          },
          error: (err: any) => {
            console.log(err);
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
                  tipo_documento:'',
                  status: ''
                });
                this.clienteFormSubmitted = false;
                location.reload();
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
              tipo_documento: res['tipo_documento'],
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
                  tipo_documento:'',
                  status: ''
                });
                localStorage.removeItem('idClient');
                this.clienteFormSubmitted = false;
                location.reload();
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
                location.reload();
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
    this.dtTrigger?.unsubscribe();
  }

}
