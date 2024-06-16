export class UsuarioModel {
    constructor(
        public id:string,
        public numero_documento: string,
        public nombres_completos: string,
        public username: string,
        public ciudad: string,
        public direccion: string,
        public email: string,
        public password: string,
        public movil: string,
        public role: string,
        public estado: string,
        public created_at: string,
        public updated_at: string,
    ){}
}
