import React from "react";

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
      <div className="modal-dialog modal-dialog-centered">
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
              <div key={destino} className="form-check">
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
                  {destino}
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn-primary"
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
