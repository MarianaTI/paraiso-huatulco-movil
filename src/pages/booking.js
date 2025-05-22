import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { saveOfflineBooking } from "@/utils/offlineBooking";
import { sendBooking } from "@/utils/sendBooking";
import useRatesPrice from "@/hooks/useRatesPrice";
import Flatpickr from "react-flatpickr";

export default function Booking() {
  const router = useRouter();
  const [rent, setRent] = useState([]);
  const isOnline = useOnlineStatus();
  const [rate, setRate] = useState(null);
  const [adultos, setAdultos] = useState(1);
  const [menores, setMenores] = useState(0);

  const {name, productCode } = router.query;

  useEffect(() => {
    const storedRate = localStorage.getItem("selectedRate");
    if (storedRate) {
      setRate(JSON.parse(storedRate));
    }
  }, []); 

  useEffect(() => {
    if (rate) {
      console.log("Rate cargada desde localStorage ->", rate);
    }
  }, [rate]);

  const ratesData = useRatesPrice(rate, adultos, menores);

  useEffect(() => {
    if (ratesData) {
      console.log("Resultado de tarifas ->", ratesData);
    }
  }, [ratesData]);

  
  const [data, setData] = useState({
    limit_payment: "2025-04-22",
    limit_customer: "2025-04-22",
    // rate_code: rateCode,
    product_code: productCode,
    // total: price,
    // currency: moneda,
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
    start_date: "2025-05-24",
    pax_adults: "2",
    // comments: "prueba de envío con pwa"
  });
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
  }  

  return (
    <div className="px-5">
      <section className="d-flex flex-column">
        <label>Número de adultos</label>
        <input
          type="number"
          min="0"
          value={String(adultos)}
          onChange={(e) => handleNumericChange(e, setAdultos)}
          onFocus={(e) => e.target.select()}
        />

        <label className="mt-3">Número de menores</label>
        <input
          type="number"
          min="0"
          value={String(menores)}
          onChange={(e) => handleNumericChange(e, setMenores)}
          onFocus={(e) => e.target.select()}
        />
      </section>
      <form onSubmit={onSubmit}>
        <h1>Reserva</h1>
        <p>Nombre del tour: {name}</p>
        <p>Rate seleccionado: {rate?.price_foreign}</p>
        {ratesData && (
          <p>
            Total: ${parseFloat(ratesData.total).toFixed(2)} {rate?.moneda}
          </p>
        )}
        <section className="d-flex flex-column">
          <label>Fecha límite de pago</label>
          <Flatpickr
            value={data.limit_payment}
            options={{ dateFormat: "Y-m-d", disableMobile: true }}
            onChange={(date, str) => handleDateChange(date, str, "start_date")}
          />
          <label>Comentarios</label>
          <input
            type="text"
            name="comments"
            value={data.comments}
            onChange={handleChange}
          />
        </section>
        <button type="submit" className="w-100 my-4 p-2">
          Reservar
        </button>
      </form>
    </div>
  );
}

{
  /* <section className="d-flex flex-column">
        <label>Nombre(s)</label>
        <input
          type="text"
          name="client_name"
          value={data.client_name}
          onChange={handleChange}
          className="mb-4"
        />
        <label>Apellidos</label>
        <input
          type="text"
          name="client_lastname"
          value={data.client_lastname}
          onChange={handleChange}
          className="mb-4"
        />
        <label>Número de teléfono</label>
        <input
          type="text"
          name="client_phone"
          value={data.client_phone}
          onChange={handleChange}
          className="mb-4"
        />
        <label>Email</label>
        <input
          type="text"
          name="client_mail"
          value={data.client_mail}
          onChange={handleChange}
          className="mb-4"
        />
        <label>Fecha de inicio</label>
        <input
          type="date"
          name="start_date"
          value={data.start_date}
          onChange={handleChange}
          className="mb-4"
        />
        <label>Fecha de salida</label>
        <input
          type="date"
          name="end_date"
          value={data.end_date}
          onChange={handleChange}
          className="mb-4"
        />
        <label>Adultos</label>
        <input
          type="number"
          name="pax_adults"
          value={data.pax_adults}
          onChange={handleChange}
        />
        <label>Comentarios</label>
        <input
          type="text"
          name="comments"
          value={data.comments}
          onChange={handleChange}
        />
      </section> */
}
