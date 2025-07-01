import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { saveOfflineBooking } from "@/utils/offlineBooking";
import { sendBooking } from "@/utils/sendBooking";
import useRatesPrice from "@/hooks/useRatesPrice";

export default function Booking() {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const {name, productCode, catName } = router.query;

  const [step, setStep] = useState(1);
  const [rent, setRent] = useState([]);
  const [rate, setRate] = useState(null);
  const [adultos, setAdultos] = useState(1);
  const [menores, setMenores] = useState(0);

  const ratesData = useRatesPrice(rate, adultos, menores);
  
  const [data, setData] = useState({
    limit_payment: "2025-04-22",
    limit_customer: "2025-04-22",
    rate_code: "1",
    product_code: productCode,
    total: "0",
    currency: "MXN",
    pax_menor: "0",
    infantes: "0",
    pagado: "0",
    hora_llegada: "",
    hora_salida: "",
    numero_vuelo: "",
    numero_vuelo_salida: "",
    hotel: "Bahía Huatulco",
    categoria_transporte: "1",
    tipo_viaje: "",
    id_usuario: "2",
    destino: "HX",
    categoria_traslado: "semiprivado",
    pickup: "08:40",
    pickup_salida: "",
    codigo: "",
    hora: "09:00:00",
    plataforma: "movil",
    client_name: "test pwa",
    client_lastname: "movil",
    client_phone: "9999999999",
    client_mail: "test@pwa.com",
    start_date: "2025-07-02",
    pax_adults: "2",
    comments: "prueba de envío con pwa"
  });

  useEffect(() => {
    const storedRate = localStorage.getItem("selectedRate");
    if (storedRate) {
      setRate(JSON.parse(storedRate));
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
    if (value === '') {
      setter('');
    } else {
      const num = Number(value);
      if (!isNaN(num) && num >= 0) {
        setter(num);
      }
    }
  };

  useEffect(() => {
    if (rate) {
      console.log("Rate cargada desde localStorage ->", rate);
    }
  }, [rate]);


  useEffect(() => {
    if (ratesData) {
      console.log("Resultado de tarifas ->", ratesData);
    }
  }, [ratesData]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const bookingData = { ...data };

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
    }

    try {
      const response = await sendBooking(bookingData);
      setRent(response);
      if (
        "serviceWorker" in navigator &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        const reg = await navigator.serviceWorker.ready;
        reg.showNotification("Reserva enviada", {
          body: "Tu reserva fue registrada con éxito.",
          icon: "/icon512_rounded.png",
        });
      }
    } catch (error) {
      console.log("Error en submit", error);
    }
  };

  return (
    <div>
      <div className="px-4 py-2">
        <h1 className="booking-title">RESERVA</h1>
        {/* <p className="booking-subtitle">Completa este formulario para crear una nueva reservación.</p> */}
        <div className="d-flex flex-column mb-2">
          <span className="booking-text-product">{name}</span>
          <span className="booking-text-cat">{catName}</span>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center mb-3">
        {[1, 2, 3].map((n, index) => (
          <React.Fragment key={n}>
            <div
              className={`step-dot ${step === n ? "active" : ""} ${n < step ? "completed" : ""}`}
              onClick={() => setStep(n)}
            >
              {n}
            </div>
            {index < 2 && <div className="step-line"></div>}
          </React.Fragment>
        ))}
      </div>
      <form className="px-4 py-2">
        {step === 1 && (
          <section className="booking-steps-content">
            <h3>Información del cliente</h3>
            <label className="form-label-styled">Nombre completo</label>
            <input
              type="text"
              name="client_name"
              value={data.client_name}
              onChange={handleChange}
              className="mb-2 form-input-styled"
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
              Siguiente
            </button>
          </section>
        )}
        {step === 2 && (
          <section className="booking-steps-content">
            <h3>Información de servicio</h3>
            <label className="form-label-styled">Lugar del hospedaje</label>
            <input
              type="text"
              name="hotel"
              value={data.hotel}
              onChange={handleChange}
              className="mb-3 form-input-styled"
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
                <label className="form-label-styled">Adultos</label>
                <input
                  type="number"
                  min="0"
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
            <div className="grid-form mb-3">
              <button className="booking-button-cancel" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button className="booking-button" onClick={() => setStep(3)}>
                Siguiente
              </button>
            </div>
          </section>
        )}
        {step === 3 && (
          <section className="booking-steps-content">
            <h3>Información de tarifa</h3>
            <p>Tarifa de tipo "{rate?.rate_title}"</p>
            {ratesData && (
              <p>
                Total: <span className="rate-price">${parseFloat(ratesData.total).toFixed(2)} {rate?.moneda}</span> 
              </p>
            )}
            <div className="grid-form mb-3">
              <button className="booking-button-cancel" onClick={() => setStep(2)}>
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
