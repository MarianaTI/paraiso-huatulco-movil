class Rates {
    constructor(
      _id,
      rate_code,
      rate_title,
      rate_title_en,
      start_date,
      end_date,
      prepurchase_start,
      prepurchase_end,
      release_days,
      product_code,
      price_day,
      policy,
      policy_en,
      status,
      log,
      id_vehiculo,
      x_unidad,
      min_pasajeros,
      max_pasajeros,
      mercado,
      moneda,
      price_foreign,
      moneda_foreign,
      service_type,
      categoria_transporte,
      zona_transporte,
      tipo_viaje,
    ) {
      this._id = _id;
      this.rate_code = rate_code;
      this.rate_title = rate_title;
      this.rate_title_en = rate_title_en;
      this.start_date = start_date;
      this.end_date = end_date;
      this.prepurchase_start = prepurchase_start;
      this.prepurchase_end = prepurchase_end;
      this.release_days = release_days;
      this.price_day = price_day;
      this.product_code = product_code;
      this.policy = policy;
      this.policy_en = policy_en;
      this.status = status;
      this.log = log;
      this.id_vehiculo = id_vehiculo;
      this.x_unidad = x_unidad;
      this.min_pasajeros = min_pasajeros;
      this.max_pasajeros = max_pasajeros;
      this.mercado = mercado;
      this.moneda = moneda;
      this.price_foreign = price_foreign;
      this.moneda_foreign = moneda_foreign;
      this.service_type = service_type;
      this.categoria_transporte = categoria_transporte;
      this.zona_transporte = zona_transporte;
      this.tipo_viaje = tipo_viaje;
    }
  }
  
  export default Rates;
  