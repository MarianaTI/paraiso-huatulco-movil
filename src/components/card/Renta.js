import React from "react";
import { BsFillInfoCircleFill } from "react-icons/bs";

const Renta = ({
  name,
  code,
  date,
  date2,
  availability,
  count,
  max,
  adults,
  kids,
  babies,
  service,
  fill,
  min,
  type,
}) => {
  return (
    <div className="mt-3 tour-card">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <span className="tour-title">
          {code} - {name}
        </span>
        {type ? (
          <div className="badge text-bg-danger">Ocupado</div>
        ) : (
          <div
            className={`${
              availability ? "badge text-bg-success" : "badge text-bg-danger"
            }`}
          >
            {availability ? "Disponible" : "Ocupado"}
          </div>
        )}
      </div>
      <div className="d-flex flex-column">
        { service ? (
          <span style={{ fontSize: 12 }}>Servicio: {service}</span>
        ) : (
          <></>
        )}
        {(date || date2) && (
          date2 ? (
            <span style={{ fontSize: 12 }}>
              Fechas: {date} a {date2}
            </span>
          ) : (
            <span style={{ fontSize: 12 }}>Fecha: {date}</span>
          )
        )}
      </div>
      <div className="d-flex justify-content-between">
        <span style={{ fontSize: 12, fontWeight: 600 }}>
          Lugares disponibles:{" "}
        </span>
        <span>{count ? count : "0"}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span style={{ fontSize: 12, fontWeight: 600 }}>Ocupados: </span>
        <span>{fill ? fill : "0"}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span style={{ fontSize: 12, fontWeight: 600 }}>Máximo personas: </span>
        <span>{max ? max : "0"}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span style={{ fontSize: 12, fontWeight: 600 }}>Mínimo personas: </span>
        <span>{min ? min : "0"}</span>
      </div>
      <span className="passengers">Pasajeros</span>
      <div className="card-content-tour">
        <span className="label-tour">Adultos</span>
        <span className="label-tour">Menores</span>
        <span className="label-tour">Infantes</span>
        <span className="value-tour">{adults}</span>
        <span className="value-tour">{kids}</span>
        <span className="value-tour">{babies}</span>
      </div>
    </div>
  );
};

export default Renta;
