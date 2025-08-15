import GetDisponibildadEmbarcaciones from "@/application/usecases/SaleUseCase/GetDisponibilidadEmbarcaciones";
import OfflinePage from "@/components/OfflinePage";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import SaleRepo from "@/infraestructure/implementation/httpRequest/axios/SaleRepo";
import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import timeGridPlugin from "@fullcalendar/timegrid";

export default function Embarcaciones() {
  const isOnline = useOnlineStatus();
  const [embarcaciones, setEmbarcaciones] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const saleRepo = new SaleRepo();
  const getDisponibildadEmbarcaciones = new GetDisponibildadEmbarcaciones(
    saleRepo
  );

  const fetchDisponibilidadEmbarcaciones = async (fecha, destino) => {
    try {
      const response = await getDisponibildadEmbarcaciones.run(fecha, destino);
      setEmbarcaciones(response.response);
    } catch (error) {
      console.error("Error cargando las embarcaciones: ", error);
    }
  };

  useEffect(() => {
    fetchDisponibilidadEmbarcaciones();
  }, []);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setModalOpen(true);
  };

  const events = embarcaciones.flatMap((embarcacion) =>
    embarcacion.ventas_asignadas.map((venta) => ({
      title: `${embarcacion.nombre} - ${venta.servicio}`,
      start: `${venta.fecha}T${venta.horario}`,
      backgroundColor: "#F1F1FF",
      borderColor: "#3B71FE",
      textColor: " #3B71FE",
      extendedProps: {
        tour: venta.servicio,
        embarcacion: embarcacion.nombre,
        horario: venta.horario,
        adultos: venta.adultos,
        menores: venta.menores,
        infantes: venta.infantes,
        proveedor: embarcacion.proveedor,
        observaciones: venta.observaciones,
      },
    }))
  );

  return (
    <>
      {!isOnline ? (
        <OfflinePage />
      ) : (
        <div className="p-2">
          <h1 className="title m-0 pb-2" style={{ paddingTop: "none" }}>
            Embarcaciones
          </h1>
          <FullCalendar
            plugins={[timeGridPlugin]}
            initialView="timeGridDay"
            locale={esLocale}
            allDayText="Día"
            headerToolbar={{
              left: "title",
              center: "",
              right: "prev,next",
            }}
            slotMinTime="06:00:00"
            slotMaxTime="22:00:00"
            events={events}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
          />
          {modalOpen && selectedEvent && (
            <div
              className="modal fade show d-block"
              tabIndex="-1"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <div className="modal-dialog-centered mx-4">
                <div className="modal-content">
                  <div
                    className="modal-header"
                    style={{ backgroundColor: "#F1F1FF" }}
                  >
                    <h5
                      className="modal-title"
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: "#000f9f",
                      }}
                    >
                      Detalles
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setModalOpen(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <h5 className="mb-1">{selectedEvent.extendedProps.tour}</h5>
                    <span>
                      Embarcación a usar "
                      {selectedEvent.extendedProps.embarcacion}"
                    </span>
                    <div className="mt-2">
                      <p class="m-0">
                        <b>Horario:</b> {selectedEvent.extendedProps.horario}
                      </p>
                      <p class="m-0">
                        <strong> Pasajeros:</strong>
                      </p>
                      <ul>
                        <li>{selectedEvent.extendedProps.adultos} adultos</li>
                        <li>{selectedEvent.extendedProps.menores} menores</li>
                        <li>{selectedEvent.extendedProps.infantes} infantes</li>
                      </ul>
                      <p class="m-0">
                        <b>Observaciones:</b>{" "}
                        {selectedEvent.extendedProps.observaciones
                          ? selectedEvent.extendedProps.observaciones
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn"
                      style={{
                        backgroundColor: "#3B71FE",
                        color: "#fff",
                        fontSize: 13,
                      }}
                      onClick={() => setModalOpen(false)}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

function renderEventContent(eventInfo) {
  return (
    <div className="d-flex align-items-center p-2">
      <b> {eventInfo.timeText}</b> <i>{eventInfo.event.title}</i>
    </div>
  );
}
