export class ArticuloModel {
    constructor(
        public id: string,
        public codigo: string,
        public nombre_producto: string,
        public tipo_prod: string,
        public descripcion: string,
        public unidad: string,
        public precio_compra: number,
        public precio_base: number,
        public precio_venta: number,
        public stock_incial: number,
        public stock_actual: number,
        public estado: string,
        public categoria_id: string,
        public createdAt: string,
        public updatedAt: string
    ){}
}