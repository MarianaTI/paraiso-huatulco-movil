import {
  deleteOfflineBookings,
  getAllOfflineBookings,
} from "@/utils/offlineBooking";
import React, { useEffect, useState } from "react";

export default function PendingSales() {
  const [bookings, setBookings] = useState([]);

  const loadBookings = async () => {
    try {
      const offlineBookings = await getAllOfflineBookings();
      setBookings(offlineBookings);
    } catch (error) {
      console.error("Error al cargar reservas offline:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar esta reserva?"
    );
    if (!confirmDelete) return;

    await deleteOfflineBookings(id);
    await loadBookings();
  };

  useEffect(() => {
    loadBookings();
  }, []);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Reservas</h2>
      {bookings.length === 0 ? (
        <p>No hay reservas offline.</p>
      ) : (
        <ul className="list-group">
          {bookings.map((reserva) => (
            <li
              key={reserva.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>
                  {reserva.client_name} {reserva.client_lastname}
                </strong>
                <br />
                Hotel: {reserva.hotel}
                <br />
                Fecha: {reserva.start_date}
                <br />
                Total: ${reserva.total} {reserva.currency}
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(reserva.id)}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
