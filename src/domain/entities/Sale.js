class Sale {
    constructor(
      id_venta,
      codigo_confirmación,
      fecha_venta,
      pasajero_titular,
      destino,
      descripcion,
      total,
      moneda,
      estatus,
      agente,
      agencia,
      estatus,
    ) {
      this.id_venta = id_venta;
      this.codigo_confirmación = codigo_confirmación;
      this.fecha_venta = fecha_venta;
      this.pasajero_titular = pasajero_titular;
      this.destino = destino;
      this.descripcion = descripcion;
      this.total = total;
      this.moneda = moneda;
      this.estatus = estatus;
      this.agente = agente;
      this.agencia = agencia;
      this.estatus = estatus;
    }
  }
  
  export default Sale;
  