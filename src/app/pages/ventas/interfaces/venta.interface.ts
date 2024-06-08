export interface VentaInterface {
    num_factura:string,//interfaz
    fecha_emision:string,//interfaz
    fecha_validez:string,
    ruc_emisor:string,
    nombres_emisor:string,//interfaz
    razon_social:string,//interfaz
    direccion_emisor:string,
    telf_emisor:string,
    email_emisor:string,
    ciudad_emisor:string,
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