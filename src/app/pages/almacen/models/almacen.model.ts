export class AlmacenModel {
    constructor(
        public id: string,
        public nombre: string,
        public provincia: string,
        public ciudad: string,
        public direccion: string,
        public correo: string,
        public movil: string,
        public telefono: string,
        public email: string,
        public estado: string,
        public usuario_id: string,
        public createdAt: string,
        public updatedAt: string
    ) {
    }
}
