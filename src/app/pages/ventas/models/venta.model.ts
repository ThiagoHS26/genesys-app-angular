export class VentaModel {
    constructor(
        public id:string,
        public num_factura:string,
        public fecha_emision:string,
        public fecha_validez:string,
        public ndoc_cliente:string,
        public rs_cliente:string,
        public dir_cliente:string,
        public telf_cliente:string,
        public email_cliente:string,
        public total_venta:number,
        public estado_venta:string,
        public forma_pago:string,
        public observaciones:string,
        public user_id:string,
        public sucursal_id:string,
        public detVentas:[],
        public cliente_id:string,
        public createdAt:string,
        public updatedAt:string
    ){}
}