import React from "react";

const Traslado = ({ code, name, service, rate, type, availability, count, adults, max, fill, kids, babies }) => {
  return (
    <div className="mt-3 tour-card">
      <div className="d-flex flex-column">
        <span className="tour-title">
          {code} - {name}
        </span>
        <span>{service}</span>
      </div>
      <hr className="my-1" />
      <div className="d-flex justify-content-between">
        <span className="tour-title my-1" style={{color: 'rgb(115, 103, 240)'}}>{rate}</span>
        <span>{type == 0 ? "" : "Por unidad"}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span style={{ fontSize: 12 }}>Estado:</span>
        <div
          className={`${
            availability ? "badge text-bg-success" : "badge text-bg-danger"
          }`}
        >
          {availability ? "Disponible" : "Ocupado"}
        </div>
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

export default Traslado;
