export interface VentaInterface {
    num_factura:string,//interfaz
    fecha_emision:string,//interfaz
    fecha_validez:string,
    ndoc_cliente:string,//interfaz
    rs_cliente:string,//interfaz
    dir_cliente:string,//modal
    telf_cliente:string,//modal
    email_cliente:string,//modal
    total_venta:number,
    estado_venta:string,
    forma_pago:string,
    observaciones:string,
    user_id:string,
    sucursal_id:string,
    cliente_id:string
}