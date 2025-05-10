import BookingUseCase from "@/application/usecases/BookingUseCase/BookingUseCase";
import BookingRepo from "@/infraestructure/implementation/httpRequest/axios/BookingRepo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

export default function Booking() {
  const router = useRouter();
  const [rent, setRent] = useState([]);
  const isOnline = useOnlineStatus();
  const { name, rateTitle, rateCode, productCode, price, moneda } =
    router.query;

  const [data, setData] = useState({
    limit_payment: "2025-04-22",
    limit_customer: "2025-04-22",
    rate_code: rateCode,
    product_code: productCode,
    total: price,
    currency: moneda,
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
    comments: "prueba de envío con pwa"
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const bookingData = { ...data };

    if (!isOnline) {
      const offlineQueue = JSON.parse(localStorage.getItem("offlineBooking")) || [];
      offlineQueue.push(bookingData);
      localStorage.setItem("offlineBooking", JSON.stringify(offlineQueue));
      alert("Sin conexión. Tu reserva se guardó y se enviará al recuperar la conexión.");
      return router.push("/confirmation");
    }

    try {
      const bookingRepo = new BookingRepo();
      const createBookingUseCase = new BookingUseCase(bookingRepo);
      const response = await createBookingUseCase.run(bookingData);
      setRent(response);
      console.log(response);
      return router.push("/confirmation");
    } catch (error) {
      console.log("Error en submit", error);
    }
  };

  useEffect(() => {
    const sendOfflineBookings = async () => {
      const offlineQueue = JSON.parse(localStorage.getItem("offlineBooking")) || [];
      if (offlineQueue.length === 0) return;

      const bookingRepo = new BookingRepo();
      const createBookingUseCase = new BookingUseCase(bookingRepo);

      for (const booking of offlineQueue) {
        try {
          await createBookingUseCase.run(booking);
        } catch (error) {
          console.error("Error al enviar reserva pendiente:", err);
          return;
        }
      }

      localStorage.removeItem("offlineBooking");
      alert("Tus reservas pendientes se han enviado correctamente.");
    };

    if (isOnline) {
      sendOfflineBookings();
    }
  }, [isOnline]);

  return (
    <form onSubmit={onSubmit} className="px-5">
      <h1>Reserva</h1>
      <p>Nombre del tour: {name}</p>
      <p>Rate seleccionado: {rateTitle}</p>
      <p>
        Precio por día: ${parseFloat(price).toFixed(2)} {moneda}
      </p>
      {/* <section className="d-flex flex-column">
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
      </section> */}
      <button type="submit" className="w-100 my-4 p-2">
        Reservar
      </button>
    </form>
  );
}
