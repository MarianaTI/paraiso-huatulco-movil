import { getOfflineDB } from "./offlineBooking";

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookings") {
    console.log("[SW] Evento de sincronización recibido");
    sendOfflineBookingsToServer(); 
  }
});

export const sendOfflineBookingsToServer = async () => {
  const db = await getOfflineDB();
  const tx = db.transaction("reservas", "readwrite");
  const store = tx.objectStore("reservas");
  const all = await store.getAll();

  for (const booking of all) {
    try {
      const formData = new FormData();
      formData.append("start_date", booking.start_date);
      formData.append("end_date", booking.end_date);
      formData.append("limit_payment", booking.limit_payment);
      formData.append("limit_customer", booking.limit_customer);
      formData.append("rate_code", booking.rate_code);
      formData.append("product_code", booking.product_code);
      formData.append("total", booking.total);
      formData.append("currency", booking.currency);
      formData.append("pax_adults", booking.pax_adults);
      formData.append("pax_menor", booking.pax_menor);
      formData.append("infantes", booking.infantes);
      formData.append("pagado", booking.pagado);
      formData.append("hora_llegada", booking.hora_llegada);
      formData.append("hora_salida", booking.hora_salida);
      formData.append("numero_vuelo", booking.numero_vuelo);
      formData.append("numero_vuelo_salida", booking.numero_vuelo_salida);
      formData.append("hotel", booking.hotel);
      formData.append("categoria_transporte", booking.categoria_transporte);
      formData.append("tipo_viaje", booking.tipo_viaje);
      formData.append("client_name", booking.client_name);
      formData.append("client_lastname", booking.client_lastname);
      formData.append("client_phone", booking.client_phone);
      formData.append("client_mail", booking.client_mail);
      formData.append("comments", booking.comments);
      formData.append("id_usuario", booking.id_usuario);
      formData.append("destino", booking.destino);
      formData.append("categoria_traslado", booking.categoria_traslado);
      formData.append("pickup", booking.pickup);
      formData.append("pickup_salida", booking.pickup_salida);
      formData.append("codigo", booking.codigo);
      formData.append("hora", booking.hora);
      formData.append("plataforma", booking.plataforma);

      const res = await fetch("https://portaldemo.paraisohuatulco.com/rents/booking", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        await store.delete(booking.id);
        console.log("✅ Reserva enviada y eliminada:", booking.id);
      } else {
        console.warn("⚠️ Error del servidor al reenviar reserva", await res.text());
      }
    } catch (error) {
      console.error("❌ Error de red al reenviar reserva:", error);
    }
  }

  await tx.done;
};
