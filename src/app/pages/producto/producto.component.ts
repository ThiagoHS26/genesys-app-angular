import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CategoriaService } from './services/categoria.service';
import { CategoriaModel } from './models/categoria.model';
import { ArticuloService } from './services/articulo.service';
import { ArticuloModel } from './models/articulo.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css'
})
export class ProductoComponent implements OnInit {

  @ViewChild('modalCatTitle') modalCatRef!:ElementRef;
  @ViewChild('modalArtTitle') modalArtRef!:ElementRef;
  public btnAddCat: Boolean = false;
  public btnEditCat: Boolean = false;
  public btnAddArt: Boolean = false;
  public btnEditArt: Boolean = false;

  public tipoArticulo:Array<string> = ['BIEN','SERVICIO'];
  public estadoArticulo:Array<string> = ['ACTIVO','INACTIVO'];

  public categorias: CategoriaModel[] = [];
  public articulos: ArticuloModel[] = [];

  public categoriaForm: FormGroup;
  public categoriaFormSubmitted: Boolean = false;
  public articuloForm: FormGroup;
  public articuloFormSubmitted: Boolean = false;

  constructor(private _categoriaSvc: CategoriaService, private _articuloSvc: ArticuloService, 
    private _fb:FormBuilder
  ){
    this.categoriaForm = this._fb.group({
      nombre_categoria: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });

    this.articuloForm = this._fb.group({
      codigo: ['', [Validators.required]],
      nombre_producto: ['', [Validators.required]],
      tipo_prod: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      unidad: ['', [Validators.required]],
      precio_compra: [0, [Validators.required]],
      precio_base: [0, [Validators.required]],
      precio_venta: [0, [Validators.required]],
      stock_incial: [0, [Validators.required]],//corregir escritura en el back 
      stock_actual: [0, [Validators.required]],
      estado: ['', [Validators.required]],
      categoria_id: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.getCategorias();
    this.getArticulos();
  }

  addCatTitle(){
    this.btnAddCat = true;
    this.btnEditCat = false;
    this.categoriaForm.reset();
    const headTitle = this.modalCatRef.nativeElement;
    headTitle.innerHTML = "Agregar categoría";
  }

  //Obtener categorias
  getCategorias(){
    this._categoriaSvc.obtenerCategorias()
      .subscribe(
        {
          next: (res: CategoriaModel[]) => {
            this.categorias = res;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  //Crear categoria
  createCategoria(){
    this.categoriaFormSubmitted = true;
    if(this.categoriaForm.invalid){
      return;
    }
    this._categoriaSvc.registrarCategoria(this.categoriaForm.value)
      .subscribe(
        {
          next: (res: CategoriaModel) => {
            Swal.fire({
              title: 'Categoría creada',
              text: 'La categoría ha sido creada',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getCategorias();
                this.categoriaForm.reset();
                this.categoriaFormSubmitted = false;
              }
            })
          }
        }
      )

  }

  completeCatForm(id: string){
    this.btnAddCat = false;
    this.btnEditCat = true;
    const headTitle = this.modalCatRef.nativeElement;
    headTitle.innerHTML = "Editar categoría";
    this._categoriaSvc.obtenerCategoriaXId(id)
      .subscribe(
        {
          next: (res: CategoriaModel) => {
            localStorage.setItem('idCat',id);
            this.categoriaForm.setValue({
              nombre_categoria: res.nombre_categoria,
              descripcion: res.descripcion
            })
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  updateCategoria(){
    const idCat = localStorage.getItem('idCat');
    if(this.categoriaForm.invalid){
      return;
    }
    this._categoriaSvc.actualizarCategoria(idCat!, this.categoriaForm.value)
      .subscribe(
        {
          next: (res: CategoriaModel) => {
            Swal.fire({
              title: 'Categoría actualizada',
              text: 'La categoría ha sido actualizada',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                localStorage.removeItem('idCat');
                this.getCategorias();
                this.getArticulos();
                this.categoriaFormSubmitted = false;
              }
            });
          }
        }
      )
  }

  deleteCategoria(id: string){
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
          this._categoriaSvc.eliminarCategoria(id)
            .subscribe(
              {
                next: (res: any) => {
                  Swal.fire({
                    title: 'Eliminado!',
                    text: 'La categoría ha sido eliminada',
                    icon:'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                  this.getCategorias();
                  this.getArticulos();
                },
                error: (err: any) => {
                  console.log(err);
                }
              }
            )
        }
    });
  }

  /* ARTICULOS */

  addArtTitle(){
    this.btnAddArt = true;
    this.btnEditArt = false;
    this.articuloForm.reset({
      tipo_prod: '',
      estado: '',
      categoria_id: ''
    });
    const headTitle = this.modalArtRef.nativeElement;
    headTitle.innerHTML = "Agregar artículo";
  }

  //Obtener articulos
  getArticulos(){
    this._articuloSvc.obtenerArticulos()
      .subscribe(
        {
          next: (res: ArticuloModel[]) => {
            this.articulos = res;
          },
          error: (err: any) => {
            console.log(err);
          }
        }
      )
  }

  createArticulo(){
    this.articuloFormSubmitted = true;
    if(this.articuloForm.invalid){
      return;
    }
    this._articuloSvc.registrarArticulo(this.articuloForm.value)
      .subscribe(
        {
          next: (res: ArticuloModel) => {
            Swal.fire({
              title: 'Artículo creado',
              text: 'El artículo ha sido creado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                this.getArticulos();
                this.articuloForm.reset({
                  tipo_prod: '',
                  estado: '',
                  categoria_id: ''
                });
                this.articuloFormSubmitted = false;
              }
            })
          }
        }
      )
  }

  completeArtForm(id: string){
    const headTitle = this.modalArtRef.nativeElement;
    headTitle.innerHTML = "Editar artículo";
    this.btnAddArt = false;
    this.btnEditArt = true;
    this._articuloSvc.obtenerArticuloXId(id)
      .subscribe(
        {
          next: (res: ArticuloModel) => {
            localStorage.setItem('idArt',id);
            this.articuloForm.setValue({
              codigo: res['codigo'],
              nombre_producto: res['nombre_producto'],
              tipo_prod: res['tipo_prod'],
              descripcion: res['descripcion'],
              unidad: res['unidad'],
              precio_compra: res['precio_compra'],
              precio_base: res['precio_base'],
              precio_venta: res['precio_venta'],
              stock_incial: res['stock_incial'],//corregir escritura en el back 
              stock_actual: res['stock_actual'],
              estado: res['estado'],
              categoria_id: res['categoria_id']
            });
          }
        }
      )
  }

  updateArticulo(){
    const idArt = localStorage.getItem('idArt');
    this.articuloFormSubmitted = true;
    if(this.articuloForm.invalid){
      return;
    }
    this._articuloSvc.actualizarArticulo(idArt!, this.articuloForm.value)
      .subscribe(
        {
          next: (res: ArticuloModel) => {
            Swal.fire({
              title: 'Artículo actualizado',
              text: 'El artículo ha sido actualizado',
              icon:'success',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              cancelButtonColor: '#d33',
              confirmButtonText: 'Ok'
            }).then((result)=>{
              if(result.isConfirmed){
                localStorage.removeItem('idArt');
                this.getArticulos();
                this.articuloForm.reset({
                  tipo_prod: '',
                  estado: '',
                  categoria_id: ''
                });
                this.articuloFormSubmitted = false;
              }
            });
          }
        }
      )
  }

  deleteArticulo(id: string){
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
          this._articuloSvc.eliminarArticulo(id)
            .subscribe(
              {
                next: (res: any) => {
                  Swal.fire({
                    title: 'Eliminado!',
                    text: 'El artículo ha sido eliminado',
                    icon:'success',
                    timer: 1500,
                    showConfirmButton: false
                  });
                  this.getArticulos();
                },
                error: (err: any) => {
                  console.log(err);
                }
              }
            )
        }
    });

  }

  /*VALIDACION DE CAMPOS */
  campoNoValido(campo: string){
    if((this.categoriaForm.get(campo)?.invalid && this.categoriaFormSubmitted) ||
      (this.articuloForm.get(campo)?.invalid && this.articuloFormSubmitted)){
      return true;
    }else{
      return false;
    }
  }
  
}
