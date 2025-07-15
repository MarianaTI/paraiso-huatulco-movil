import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { saveOfflineBooking } from "@/utils/offlineBooking";
import { sendBooking } from "@/utils/sendBooking";
import useRatesPrice from "@/hooks/useRatesPrice";
import { useSelector } from "react-redux";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";

export default function Booking() {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const userId = useSelector((state) => state.user._id);

  const [step, setStep] = useState(1);
  const [rent, setRent] = useState([]);
  const [product, setProduct] = useState([]);
  const [rate, setRate] = useState(null);
  const [adultos, setAdultos] = useState(2);
  const [menores, setMenores] = useState(0);
  const [editarTotal, setEditarTotal] = useState(false);
  const [clients, setClients] = useState([]);
  const [hotel, setHotel] = useState([]);

  const ratesData = useRatesPrice(rate, adultos, menores);

  // console.log("Código de producto", product);

  const [data, setData] = useState({
    alias: "",
    categoria_transporte: "1",
    categoria_traslado: "",
    client_lastname: "",
    client_mail: "",
    client_name: "",
    client_phone: "",
    codigo: "",
    comments: "",
    currency: "MXN",
    destino: "HX",
    end_date: "",
    habitacion: "",
    hora: product?.horario ? product.horario.slice(0, 5) : '',
    hora_llegada: "",
    hora_salida: "",
    hotel: "Bahía Huatulco",
    id_dealer: "",
    id_proveedor: "",
    id_servicio: "",
    id_usuario: "",
    infantes: "0",
    limit_customer: "2025-04-22",
    limit_payment: "INMEDIATO",
    nombre_producto: "",
    numero_vuelo: "",
    numero_vuelo_salida: "",
    pagado: "0",
    pax_adults: "2",
    pax_menor: "0",
    pickup: "",
    pickup_salida: "",
    plataforma: "movil",
    product_code: "",
    rate_code: "",
    start_date: new Date().toISOString().split("T")[0],
    tipo_viaje: "HA",
    total: "",
    vendedor_referenciado: "",
    zona_hotel: "",
  });

  useEffect(() => {
    if (product?.horario) {
      setData((prev) => ({
        ...prev,
        hora: product.horario.slice(0, 5),
      }));
    }
  }, [product]);  

  useEffect(() => {
    const storedRate = localStorage.getItem("selectedRate");
    const storedProduct = localStorage.getItem("selectedProduct");
    const storedClients = localStorage.getItem("clients");
    const storedHotel = localStorage.getItem("hoteles");
    if (storedRate && storedProduct && storedClients && storedHotel) {
      setRate(JSON.parse(storedRate));
      setProduct(JSON.parse(storedProduct));
      setClients(JSON.parse(storedClients));
      setHotel(JSON.parse(storedHotel));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (selectedDates, dateStr, name) => {
    setData((prev) => ({ ...prev, [name]: dateStr }));
  };

  function handleNumericChange(e, setter) {
    const value = e.target.value;
    if (value === "") {
      setter("");
    } else {
      const num = Number(value);
      if (!isNaN(num) && num >= 0) {
        setter(num);
      }
    }
  }

  useEffect(() => {
    if (rate) {
      // console.log("Rate cargada desde localStorage ->", rate);
    }
  }, [rate]);

  useEffect(() => {
    if (ratesData) {
      // console.log("Resultado de tarifas ->", ratesData);
    }
  }, [ratesData]);

  const onSubmit = async (e) => {
    e.preventDefault();

    let categoria_traslado = "";

    if (rate.service_type == 1) {
      categoria_traslado = "compartido";
    } else if (rate.service_type == 2) {
      categoria_traslado = "privado";
    } else if (rate.service_type == 3) {
      categoria_traslado = "semiprivado";
    }

    const startDate = new Date(data.start_date);
    const today = new Date();

    const tentativeLimit = new Date(startDate);
    tentativeLimit.setDate(startDate.getDate() - 7);

    const formatDate = (date) => {
      return date.toISOString().split("T")[0];
    };

    let limit_payment = "";
    let limit_customer = "";

    if (tentativeLimit < today) {
      limit_payment = formatDate(today);
      limit_customer = formatDate(today);
    } else {
      limit_payment = formatDate(tentativeLimit);
      limit_customer = formatDate(tentativeLimit);
    }

    let notas = {
      metodo_pago: data.method_payment,
      referencia_pago: data.referenciaPago,
      referencia_ota: data.referencia_cliente,
    };

    const bookingData = {
      ...data,
      categoria_traslado,
      product_code: product.product_code,
      destino: product.codigo_destino,
      id_servicio: product.id_servicio,
      limit_payment,
      limit_customer,
      pax_adults: String(adultos),
      pax_menor: String(menores),
      id_usuario: userId,
      rate_code: rate.rate_code,
      hora: data.hora ? `${data.hora}:00` : product.horario,
      total: editarTotal ? String(data.total) : String(ratesData.total),
      notas: notas,
    };

    if ("Notification" in window && Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("❌ Usuario no permitió las notificaciones.");
      }
    }

    if (!navigator.onLine) {
      console.log("Estado de conexión en navigator.onLine:", navigator.onLine);

      console.log("Offline detected, saving to IndexedDB");
      await saveOfflineBooking(bookingData);
      console.log("bookingData: ", bookingData);

      try {
        if ("serviceWorker" in navigator && "SyncManager" in window) {
          const registration = await navigator.serviceWorker.ready;
          await registration.sync.register("sync-bookings");
        }
      } catch (err) {
        console.error("❌ Error al registrar sync:", err);
      }

      alert(
        "Sin conexión. Tu reserva se guardó y se enviará al recuperar la conexión."
      );
      router.push("/home");
      return;
    }

    try {
      console.log("Reserva: ", bookingData);

      // const response = await sendBooking(bookingData);
      // setRent(response);
      // if (
      //   "serviceWorker" in navigator &&
      //   "Notification" in window &&
      //   Notification.permission === "granted"
      // ) {
      //   const reg = await navigator.serviceWorker.ready;
      //   reg.showNotification("Reserva enviada", {
      //     body: "Tu reserva fue registrada con éxito.",
      //     icon: "/icon512_rounded.png",
      //   });
      // }
      // router.push("/home");
    } catch (error) {
      console.log("Error en submit", error);
    }
  };

  const stepTitles = ["DATOS", "DETALLES", "PAGO"];

  const options = [
    { value: "HA", label: "Hotel - Aeropuerto/Terminal" },
    { value: "AH", label: "Aeropuerto/Terminal - Hotel" },
  ];

  const optionsPayment = [
    { value: "cheque", label: "Cheque" },
    { value: "cortesía", label: "Cortesía" },
    { value: "crédito", label: "Crédito" },
    { value: "efectivo", label: "Efectivo" },
    { value: "mixto", label: "Mixto" },
    { value: "tarjeta", label: "Tarjeta" },
    { value: "transferencia", label: "Transferencia" },
  ];

  return (
    <div className="pt-4">
      <div className="px-4 py-2">
        <h1 className="booking-title">RESERVA</h1>
        {/* <p className="booking-subtitle">Completa este formulario para crear una nueva reservación.</p> */}
        <div className="d-flex flex-column mb-2">
          <span className="booking-text-product">{product.name}</span>
          <span className="booking-text-cat">{product.categoria_nombre}</span>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mb-3 gap-4 step-dot-container">
        {[1, 2, 3].map((n, index) => (
          <React.Fragment key={n}>
            <div className="d-flex align-items-center gap-2">
              <div
                className={`step-dot ${step === n ? "active" : ""} ${
                  n < step ? "completed" : ""
                }`}
                onClick={() => setStep(n)}
              >
                {n}
              </div>
              {step === n && (
                <span className="step-label">{stepTitles[n - 1]}</span>
              )}
            </div>
            {index < 2 && <div className="step-line-horizontal"></div>}
          </React.Fragment>
        ))}
      </div>
      <form className="px-4 py-2" onSubmit={onSubmit}>
        {step === 1 && (
          <section className="booking-steps-content">
            <h3>Información del cliente</h3>
            <label className="form-label-styled">Nombre completo</label>
            <CreatableSelect
              classNamePrefix="select"
              placeholder="Buscar o escribir cliente..."
              options={clients.map((client) => ({
                value: client.pasajero_titular,
                label: client.pasajero_titular,
                correo: client.correo,
                telefono: client.telefono,
                referencia: client.referenciaOrigenCliente,
              }))}
              value={
                data.client_name
                  ? {
                      value: data.client_name,
                      label: data.client_name,
                    }
                  : null
              }
              onChange={(selectedOption) => {
                if (selectedOption) {
                  setData((prev) => ({
                    ...prev,
                    client_name: selectedOption.value,
                    client_mail: selectedOption.correo || "",
                    client_phone: selectedOption.telefono || "",
                    referencia_cliente: selectedOption.referencia || "",
                  }));
                } else {
                  setData((prev) => ({
                    ...prev,
                    client_name: "",
                    client_mail: "",
                    client_phone: "",
                    referencia_cliente: "",
                  }));
                }
              }}
              onCreateOption={(inputValue) => {
                // Cuando el usuario escribe un nombre nuevo
                setData((prev) => ({
                  ...prev,
                  client_name: inputValue,
                  client_mail: "",
                  client_phone: "",
                  referencia: "",
                }));
              }}
              isClearable
            />
            <label className="form-label-styled">Teléfono</label>
            <input
              type="text"
              name="client_phone"
              value={data.client_phone}
              onChange={handleChange}
              className="mb-2 form-input-styled"
            />
            <label className="form-label-styled">Correo electrónico</label>
            <input
              type="text"
              name="client_mail"
              value={data.client_mail}
              onChange={handleChange}
              className="mb-2 form-input-styled"
            />
            <label className="form-label-styled">Comentarios</label>
            <input
              type="text"
              className="form-input-styled"
              name="comments"
              value={data.comments}
              onChange={handleChange}
            />
            <button className="booking-button" onClick={() => setStep(2)}>
              Continuar
            </button>
          </section>
        )}
        {step === 2 && (
          <section className="booking-steps-content">
            <h3>Información de servicio</h3>
            {(product.id_servicio === "2" || product.id_servicio === "3") && (
              <>
                <label className="form-label-styled">Lugar del hospedaje</label>
                <CreatableSelect
                  classNamePrefix="select"
                  placeholder="Buscar o escribir..."
                  options={hotel.map((hotel) => ({
                    value: hotel.nombre,
                    label: hotel.nombre
                  }))}
                  value={
                    data.hotel
                      ? {
                          value: data.hotel,
                          label: data.hotel,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setData((prev) => ({
                        ...prev,
                        hotel: selectedOption.value,
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        hotel: "",
                      }));
                    }
                  }}
                  onCreateOption={(inputValue) => {
                    // Cuando el usuario escribe un nombre nuevo
                    setData((prev) => ({
                      ...prev,
                      hotel: inputValue,
                    }));
                  }}
                  isClearable
                />
                <label className="form-label-styled">Fecha de inicio</label>
                <input
                  type="date"
                  name="start_date"
                  value={data.start_date}
                  onChange={handleChange}
                  className="mb-3 form-input-styled"
                />
                <div className="grid-form">
                  <div className="grid-item">
                    <label className="form-label-styled">Horario de tour</label>
                    <input
                      type="time"
                      name="hora"
                      value={data.hora}
                      onChange={handleChange}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                  <div className="grid-item">
                    <label className="form-label-styled">Pickup</label>
                    <input
                      type="time"
                      name="pickup"
                      value={data.pickup}
                      onChange={handleChange}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                  <div className="grid-item">
                    <label className="form-label-styled">Adultos</label>
                    <input
                      type="number"
                      min="2"
                      value={String(adultos)}
                      onChange={(e) => handleNumericChange(e, setAdultos)}
                      onFocus={(e) => e.target.select()}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                  <div className="grid-item">
                    <label className="form-label-styled">Menores</label>
                    <input
                      type="number"
                      min="0"
                      value={String(menores)}
                      onChange={(e) => handleNumericChange(e, setMenores)}
                      onFocus={(e) => e.target.select()}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                  <div className="grid-item">
                    <label className="form-label-styled">Infantes</label>
                    <input
                      type="number"
                      name="infantes"
                      value={data.infantes}
                      onChange={handleChange}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                </div>
              </>
            )}
            {product.id_servicio === "1" && (
              <>
                <div className="d-flex gap-3 mb-3 pt-2">
                  <div class="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="categoria_transporte"
                      id="sencillo"
                      value="1"
                      checked={data.categoria_transporte === "1"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="sencillo">
                      Sencillo
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="categoria_transporte"
                      id="redondo"
                      value="2"
                      checked={data.categoria_transporte === "2"}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="redondo">
                      Redondo
                    </label>
                  </div>
                </div>
                <label className="form-label-styled">
                  Lugar del hospedaje *
                </label>
                <CreatableSelect
                  classNamePrefix="select"
                  placeholder="Buscar o escribir..."
                  options={hotel.map((hotel) => ({
                    value: hotel.nombre,
                    label: hotel.nombre
                  }))}
                  value={
                    data.hotel
                      ? {
                          value: data.hotel,
                          label: data.hotel,
                        }
                      : null
                  }
                  onChange={(selectedOption) => {
                    if (selectedOption) {
                      setData((prev) => ({
                        ...prev,
                        hotel: selectedOption.value,
                      }));
                    } else {
                      setData((prev) => ({
                        ...prev,
                        hotel: "",
                      }));
                    }
                  }}
                  onCreateOption={(inputValue) => {
                    setData((prev) => ({
                      ...prev,
                      hotel: inputValue,
                    }));
                  }}
                  isClearable
                />
                {data.categoria_transporte === "1" && (
                  <>
                    <label className="form-label-styled">
                      Fecha de inicio *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={data.start_date}
                      onChange={handleChange}
                      className="mb-3 form-input-styled"
                    />
                    <label className="form-label-styled">Tipo de viaje *</label>
                    <Select
                      className="basic-single py-2 mb-2 select-height"
                      classNamePrefix="select"
                      name="tipo_viaje"
                      value={options.find(
                        (opt) => opt.value === data.tipo_viaje
                      )}
                      onChange={(selected) =>
                        setData({ ...data, tipo_viaje: selected.value })
                      }
                      options={options}
                    />
                  </>
                )}
                {data.categoria_transporte === "2" && (
                  <div className="grid-form">
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Fecha de inicio *
                      </label>
                      <input
                        type="date"
                        name="start_date"
                        value={data.start_date}
                        onChange={handleChange}
                        className="mb-3 form-input-styled"
                      />
                    </div>
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Fecha de fin *
                      </label>
                      <input
                        type="date"
                        name="end_date"
                        value={data.end_date}
                        onChange={handleChange}
                        className="mb-3 form-input-styled"
                      />
                    </div>
                  </div>
                )}
                <h3 className="py-2">Información de viaje</h3>
                {data.categoria_transporte === "1" && (
                  <>
                    <label className="form-label-styled">Número de vuelo</label>
                    <input
                      type="text"
                      name="numero_vuelo"
                      value={data.numero_vuelo}
                      onChange={handleChange}
                      className="mb-3 form-input-styled"
                    />
                    <div className="grid-form">
                      <div className="grid-item">
                        <label className="form-label-styled">
                          Hora de llegada
                        </label>
                        <input
                          type="time"
                          name="hora_llegada"
                          value={data.hora_llegada}
                          onChange={handleChange}
                          className="mb-2 form-input-styled"
                        />
                      </div>
                      <div className="grid-item">
                        <label className="form-label-styled">Pickup</label>
                        <input
                          type="time"
                          name="pickup"
                          value={data.pickup}
                          onChange={handleChange}
                          className="mb-2 form-input-styled"
                        />
                      </div>
                    </div>
                  </>
                )}
                {data.categoria_transporte === "2" && (
                  <div className="grid-form">
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Número de vuelo
                      </label>
                      <input
                        type="text"
                        name="numero_vuelo"
                        value={data.numero_vuelo}
                        onChange={handleChange}
                        className="mb-3 form-input-styled"
                      />
                    </div>
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Número de salida de vuelo
                      </label>
                      <input
                        type="text"
                        name="numero_vuelo_salida"
                        value={data.numero_vuelo_salida}
                        onChange={handleChange}
                        className="mb-3 form-input-styled"
                      />
                    </div>
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Hora de llegada
                      </label>
                      <input
                        type="time"
                        name="hora_llegada"
                        value={data.hora_llegada}
                        onChange={handleChange}
                        className="mb-2 form-input-styled"
                      />
                    </div>
                    <div className="grid-item">
                      <label className="form-label-styled">Pickup</label>
                      <input
                        type="time"
                        name="pickup"
                        value={data.pickup}
                        onChange={handleChange}
                        className="mb-2 form-input-styled"
                      />
                    </div>
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Hora de salida
                      </label>
                      <input
                        type="time"
                        name="hora_salida"
                        value={data.hora_salida}
                        onChange={handleChange}
                        className="mb-2 form-input-styled"
                      />
                    </div>
                    <div className="grid-item">
                      <label className="form-label-styled">
                        Pickup de salida
                      </label>
                      <input
                        type="time"
                        name="pickup_salida"
                        value={data.pickup_salida}
                        onChange={handleChange}
                        className="mb-2 form-input-styled"
                      />
                    </div>
                  </div>
                )}
                <div className="grid-form">
                  <div className="grid-item">
                    <label className="form-label-styled">Adultos</label>
                    <input
                      type="number"
                      min="2"
                      value={String(adultos)}
                      onChange={(e) => handleNumericChange(e, setAdultos)}
                      onFocus={(e) => e.target.select()}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                  <div className="grid-item">
                    <label className="form-label-styled">Menores</label>
                    <input
                      type="number"
                      min="0"
                      value={String(menores)}
                      onChange={(e) => handleNumericChange(e, setMenores)}
                      onFocus={(e) => e.target.select()}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                  <div className="grid-item">
                    <label className="form-label-styled">Infantes</label>
                    <input
                      type="number"
                      name="infantes"
                      value={data.infantes}
                      onChange={handleChange}
                      className="mb-2 form-input-styled"
                    />
                  </div>
                </div>
              </>
            )}
            <div className="grid-form mb-3">
              <button
                className="booking-button-cancel"
                onClick={() => setStep(1)}
              >
                Atrás
              </button>
              <button className="booking-button" onClick={() => setStep(3)}>
                Continuar
              </button>
            </div>
          </section>
        )}
        {step === 3 && (
          <section className="booking-steps-content">
            <h3>Información de tarifa</h3>
            <p style={{ fontSize: 17 }}>Tarifa de tipo: {rate?.rate_title}</p>
            {ratesData && (
              <>
                <p style={{ fontSize: 17 }}>
                  Total:{" "}
                  <span className="rate-price">
                    ${parseFloat(ratesData.total).toFixed(2)} {rate?.moneda}
                  </span>
                </p>
                <div className="form-check mb-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="editarTotal"
                    checked={editarTotal}
                    onChange={(e) => setEditarTotal(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="editarTotal">
                    Editar total
                  </label>
                </div>
                {editarTotal && (
                  <div className="mb-2">
                    <label className="form-label-styled">
                      Total personalizado
                    </label>
                    <input
                      type="number"
                      name="total"
                      value={data.total}
                      onChange={handleChange}
                      className="form-input-styled"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </>
            )}
            <label className="form-label-styled">Método de pago *</label>
            <Select
              className="basic-single py-2 mb-2 select-height"
              classNamePrefix="select"
              name="tipo_viaje"
              value={optionsPayment.find(
                (opt) => opt.value === data.method_payment
              )}
              onChange={(selected) =>
                setData({ ...data, method_payment: selected.value })
              }
              options={optionsPayment}
            />
            <label className="form-label-styled">Referencia *</label>
            <input
              type="text"
              name="referenciaPago"
              value={data.referenciaPago}
              onChange={handleChange}
              className="mb-2 form-input-styled"
            />
            <div className="grid-form mb-3">
              <button
                className="booking-button-cancel"
                onClick={() => setStep(2)}
              >
                Atrás
              </button>
              <button type="submit" className="booking-button">
                Confirmar
              </button>
            </div>
          </section>
        )}
      </form>
    </div>
  );
}
