export class DetalleCompraModel {
    constructor(
        public id: string,
        public codigo_producto: string,
        public nombre_producto: string,
        public cantidad: number,
        public precio_compra: number,
        public descuento: number,
        public subtotal: number,
        public total: number,
        public createdAt:string,
        public updatedAt:string
    ){}
}