import BookingUseCase from "@/application/usecases/BookingUseCase/BookingUseCase";
import BookingRepo from "@/infraestructure/implementation/httpRequest/axios/BookingRepo";
import { useRouter } from "next/router";
import React, { useState } from "react";

export default function Booking() {
  const [rent, setRent] = useState([]);
  const router = useRouter();
  const { name, rateTitle, rateCode, productCode, price, moneda } =
    router.query;

  const [data, setData] = useState({
    start_date: "2025-05-22",
    end_date: "",
    limit_payment: "2025-04-22",
    limit_customer: "2025-04-22",
    rate_code: rateCode,
    product_code: productCode,
    total: price,
    currency: moneda,
    pax_adults: "2",
    pax_menor: "0",
    infantes: "0",
    pagado: "0",
    hora_llegada: "",
    hora_salida: "",
    numero_vuelo: "",
    numero_vuelo_salida: "",
    hotel: "Bahía Huatulco",
    categoria_transporte: "1",
    tipo_viaje: "HA",
    client_name: "Mariana",
    client_lastname: "Islas",
    client_phone: "9995080907",
    client_mail: "programador@2businesstravel.com",
    comments: "Esto es una prueba",
    id_usuario: "2",
    destino: "HX",
    categoria_traslado: "semiprivado",
    pickup: "08:40",
    pickup_salida: "",
    codigo: "",
    hora: "09:00:00",
    plataforma: "movil",
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

    const bookingData = {
      ...data,
    };

    try {
      const bookingRepo = new BookingRepo();
      const createBookingUseCase = new BookingUseCase(bookingRepo);
      const response = await createBookingUseCase.run(bookingData);
      setRent(response);
      console.log(response);
    } catch (error) {
      console.log("Error en submit", error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="d-flex flex-column px-5">
      <h1>Reserva</h1>
      <p>Nombre del tour: {name}</p>
      <p>Rate seleccionado: {rateTitle}</p>
      <p>
        Precio por día: ${parseFloat(price).toFixed(2)} {moneda}
      </p>
      <section>
        {/* <label>Nombre(s)</label>
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
      /> */}
      </section>
      <button type="submit">Reservar</button>
    </form>
  );
}
