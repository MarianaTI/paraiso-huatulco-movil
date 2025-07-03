import React from "react";

const destinosMap = {
  HX: "Huatulco",
  PX: "Puerto Escondido",
  OX: "Oaxaca",
};

const DialogComponent = ({
  tempDestino,
  setTempDestino,
  onSave,
  destinos = ["HX", "PX", "OX"],
}) => {
  return (
    <div
      className="modal fade"
      id="filtroDestinoModal"
      tabIndex="-1"
      aria-labelledby="filtroDestinoModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered p-5">
        <div className="modal-content">
          <div className="modal-header">
            <span className="modal-title dialog-title" id="filtroDestinoModalLabel">
              Seleccionar destino
            </span>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="modal-body">
            {destinos.map((destino) => (
              <div key={destino} className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="destino"
                  id={`destino-${destino}`}
                  value={destino}
                  checked={tempDestino === destino}
                  onChange={(e) => setTempDestino(e.target.value)}
                />
                <label
                  className="form-check-label"
                  htmlFor={`destino-${destino}`}
                >
                  {destinosMap[destino] || destino}
                </label>
              </div>
            ))}
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="radio"
                name="destino"
                id="destino-todos"
                value=""
                checked={tempDestino === ""}
                onChange={() => setTempDestino("")}
              />
              <label className="form-check-label" htmlFor="destino-todos">
                Todos los destinos
              </label>
            </div>
          </div>
          <div className="grid-form-dialog mb-3 px-3">
            <button
              type="button"
              className="booking-button-cancel"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="booking-button"
              data-bs-dismiss="modal"
              onClick={onSave}
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DialogComponent;
