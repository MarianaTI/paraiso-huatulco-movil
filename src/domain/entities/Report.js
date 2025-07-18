class Report {
  constructor(
    dealer_code,
    agente,
    id_usuario,
    folio,
    fecha,
    adultos,
    menores,
    infantes,
    product_code,
    rate_code,
    servicio,
    tipoServicio,
    id_ventaservicio,
    comision_agente,
    comision_agencia,
    comision_agencia_pesos,
    comision,
    comision_pesos,
    total,
    fechaServicio,
    observaciones,
    rates,
    pagos,
  ) {
    this.dealer_code = dealer_code;
    this.agente = agente;
    this.id_usuario = id_usuario;
    this.folio = folio;
    this.fecha = fecha;
    this.adultos = adultos;
    this.menores = menores;
    this.infantes = infantes;
    this.product_code = product_code;
    this.rate_code = rate_code;
    this.servicio = servicio;
    this.tipoServicio = tipoServicio;
    this.id_ventaservicio = id_ventaservicio;
    this.comision_agente = comision_agente;
    this.comision_agencia = comision_agencia;
    this.comision_agencia_pesos = comision_agencia_pesos;
    this.comision = comision;
    this.comision_pesos = comision_pesos;
    this.total = total;
    this.fechaServicio = fechaServicio;
    this.observaciones = observaciones;
    this.rates = rates;
    this.pagos = pagos;
  }
}

export default Report;
