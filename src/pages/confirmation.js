import GetByIdSaleUseCase from "@/application/usecases/SaleUseCase/GetByIdSaleUseCase";
import SaleRepo from "@/infraestructure/implementation/httpRequest/axios/SaleRepo";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Confirmation() {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState(null);

  const saleRepo = new SaleRepo();
  const getById = new GetByIdSaleUseCase(saleRepo);

  const fetchSale = async (id) => {
    try {
      const response = await getById.run(701);
      setConfirmation(response);
    } catch (error) {
      console.error("Error cargando la venta: ", error);
    }
  };

  useEffect(() => {
    fetchSale();
  }, []);

  return (
    <div className="d-flex flex-column" style={{ height: "calc(90vh)" }}>
      {confirmation && (
        <div>
          <main className="container pt-2 flex-grow-1 my-2">
            <header className="text-center mb-4">
              <Image
                src="https://2businesstravel.com/images/agencia_899/favicon.png"
                width={80}
                height={80}
                alt="Logo"
                className="mb-3"
              />
              <h2 className="fw-bold">Gracias por tu reservación</h2>
              <p className="text-muted">
                A continuación te compartimos la información del servicio
                solicitado.
              </p>
            </header>
            <section className="m-3">
              <div className="d-flex justify-content-end mb-2">
                <span className="text-muted">Fecha: {confirmation.fecha}</span>
              </div>

              <div className="mb-3">
                <h4 className="product-name">{confirmation.producto}</h4>
                <div className="d-flex justify-content-between my-3">
                  <p className="d-flex flex-column m-0">
                    Folio:{" "}
                    <span className="text-title">
                      # {confirmation.id_venta}
                    </span>
                  </p>
                  <p className="d-flex flex-column m-0">
                    Código de confirmación:{" "}
                    <span className="text-title">
                      {confirmation.codigo_confirmacion}
                    </span>
                  </p>
                </div>
              </div>

              <div className="row mb-4">
                <div className="col-md-6 mb-4">
                  <h5 className="fw-bold mb-2">Información personal</h5>
                  <ul className="list-unstyled mb-0">
                    <li>
                      Nombre: <strong>{confirmation.pasajero}</strong>
                    </li>
                    <li>
                      Teléfono:{" "}
                      <strong>
                        {confirmation.telefono ? confirmation.telefono : "N/A"}
                      </strong>
                    </li>
                    <li>
                      Correo:{" "}
                      <strong>
                        {confirmation.correo ? confirmation.correo : "N/A"}
                      </strong>
                    </li>
                  </ul>
                </div>
                <div className="col-md-6 mb-2">
                  <h5 className="fw-bold mb-2">Detalles de la reservación</h5>
                  <ul className="list-unstyled mb-0">
                    <li>
                      Fecha de servicio:{" "}
                      <strong>{confirmation.fecha_servicio}</strong>
                    </li>
                    {confirmation.fecha_salida != null && (
                      <li>
                        Fecha de salida:{" "}
                        <strong>{confirmation.fecha_salida}</strong>
                      </li>
                    )}
                    <li>
                      Adultos: <strong>{confirmation.adultos}</strong>
                    </li>
                    {confirmation.menores > 0 && (
                      <li>
                        Menores: <strong>{confirmation.menores}</strong>
                      </li>
                    )}
                    {confirmation.infantes > 0 && (
                      <li>
                        Infantes: <strong>{confirmation.infantes}</strong>
                      </li>
                    )}
                    <li>
                      Lugar de hospedaje: <strong>{confirmation.hotel}</strong>
                    </li>
                    {confirmation.vuelo != null && (
                      <li>
                        Vuelo: <strong>{confirmation.vuelo}</strong>
                      </li>
                    )}
                    <li>
                      Total: <strong>${confirmation.total} MXN</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
          <footer className="btn-container">
            <button className="download-btn">Descargar</button>
            <button className="back-btn">Volver al inicio</button>
          </footer>
        </div>
      )}
    </div>
  );
}
