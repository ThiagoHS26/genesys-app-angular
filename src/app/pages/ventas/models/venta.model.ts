export class VentaModel {
    constructor(
        public id:string,
        public num_factura:string,
        public fecha_emision:string,
        public fecha_validez:string,
        public ruc_emisor:string,
        public nombres_emisor:string,
        public razon_social:string,
        public direccion_emisor:string,
        public telf_emisor:string,
        public email_emisor:string,
        public ciudad_emisor:string,
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
        public cliente_id:string,
        public createdAt:string,
        public updatedAt:string
    ){}
}