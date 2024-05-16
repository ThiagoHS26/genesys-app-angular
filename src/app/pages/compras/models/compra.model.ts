export class CompraModel {
    constructor(
        public id: string,
        public num_factura: string,
        public fecha_emision: string,
        public fecha_ingreso: string,
        public total_compra: number,
        public estado_compra: string,
        public forma_pago: string,
        public observaciones: string,
        public usuario_id: string,
        public sucursal_id: string,
        public distribuidor_id: string,
        public createdAt: string,
        public updatedAt: string
    ){}
}