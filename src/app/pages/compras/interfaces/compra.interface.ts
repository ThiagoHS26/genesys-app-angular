export interface CompraInterface {
    num_factura: string,
    fecha_emision: string,
    fecha_ingreso: string,
    total_compra: number,
    estado_compra: string,
    forma_pago: string,
    observaciones: string,
    usuario_id: string,
    sucursal_id: string,
    distribuidor_id: string
}