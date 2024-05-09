export class ProveedorModel {
    constructor(
        public id: string,
        public tipo_documento: string,
        public numero_documento: string,
        public nombres_completos: string,
        public razon_social: string,
        public ciudad: string,
        public direccion: string,
        public telefono: string,
        public movil: string,
        public correo: string,
        public estado: string,
        public createdAt: string,
        public updatedAt: string
    ){}
}