export class VentaDetalleModel {
    constructor(
        public id:string,
        public codigo_producto:string,
        public nombre_producto:string,
        public iva: number,
        public cantidad:string,
        public precio_venta:string,
        public descuento:string,
        public subtotal:string,
        public total:string,
        public venta_id:string,
        public producto_id:string,
        public createdAt:string,
        public updatedAt:string
    ){}
}