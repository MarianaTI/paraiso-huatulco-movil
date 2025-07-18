import GetAllReportUseCase from "@/application/usecases/ReportUseCase/GetAllReportUseCase";
import ReportRepo from "@/infraestructure/implementation/httpRequest/axios/ReportRepo";
import React, { useEffect, useState } from "react";

export default function Report() {
  const [report, setReport] = useState([]);
  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const reportRepo = new ReportRepo();
  const getAllReportUseCase = new GetAllReportUseCase(reportRepo);

  const fetchReports = async () => {
    const data = {
      start: "2025-07-18",
      end: "2025-07-18",
      servicio: 0,
      idu: 0,
    };

    const response = await getAllReportUseCase.run(
      data.start,
      data.end,
      data.servicio,
      data.idu
    );
    setReport(response);
    console.log("response", response);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="p-4">
      <h1 className="title m-0">Reportes</h1>
      <span className="description">Reporte de ventas por agente</span>
      <form className="d-flex flex-column">
        <label>Vendedor</label>
        <input type="text" />
        <label>Servicio</label>
        <input type="text" />
        <label>Fecha de servicio</label>
        <input type="date" />
      </form>
      <main className="my-4">
        <button>Descargar</button>
      </main>
      <div className="my-4 pb-4">
        {report.map((item, index) => {
          const rate_es = item.rates?.find((rate) => rate.type == "1");
          const rate_adult = rate_es ? parseFloat(rate_es.price_day) : 0;

          const rate_menor = item.rates?.find((rate) => rate.type == "2");
          const rate_menor_value = rate_menor
            ? parseFloat(rate_menor.price_day)
            : 0;

          const pagos = item.pagos || [];

          const totalEfectivo = pagos
            .filter((p) => p.id_forma_pago == "1" || p.id_forma_pago == "4")
            .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

          const totalTarjeta = pagos
            .filter((p) => p.id_forma_pago == "4" || p.id_forma_pago == "5")
            .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

          const totalTransfer = pagos
            .filter((p) => p.id_forma_pago == "2" || p.id_forma_pago == "3")
            .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

          const totalLeisures = pagos
            .filter((p) => p.id_forma_pago == "7")
            .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

          const totalCupones = pagos
            .filter((p) => p.id_forma_pago == "8")
            .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

          const totalOtros = pagos
            .filter((p) => parseInt(p.id_forma_pago) >= 9)
            .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

          const totalPagado = pagos.reduce(
            (acc, curr) => acc + parseFloat(curr.monto),
            0
          );

          const comision = item.comision_agente
            ? parseFloat(item.comision_agente)
            : 0;

          const fechaServicio = item.fechaServicio
            ? new Date(item.fechaServicio).toLocaleDateString("es-MX")
            : "";
          return (
            <section className="card-container" key={index}>
              <div className="card-title">
                <p>{item.agente}</p>
                <p>{item.servicio}</p>
              </div>
              <h3 className="title-grid-card mt-3">Pasajeros</h3>
              <div className="card-content">
                <span className="label">Adultos:</span>
                <span className="label">Menores:</span>
                <span className="label">Infantes:</span>

                <span className="value">{item.adultos}</span>
                <span className="value">{item.menores}</span>
                <span className="value">{item.infantes}</span>
              </div>

              <h3 className="title-grid-card">Tarifa</h3>
              <div className="card-content">
                <span className="label">Adultos:</span>
                <span className="label">Menores:</span>
                <span></span>
                <span className="value">{formatter.format(rate_adult)}</span>
                <span className="value">
                  {formatter.format(rate_menor_value)}
                </span>
              </div>
              <h3 className="title-grid-card">Forma de pago</h3>
              <div className="card-content">
              <span className="label">Efectivo:</span>
              <span className="label">Tarjeta:</span>
              <span className="label">Transferencia:</span>
                <span>{formatter.format(totalEfectivo)}</span>
                <span>{formatter.format(totalTarjeta)}</span>
                <span>{formatter.format(totalTransfer)}</span>
                <span>Leisures: {formatter.format(totalLeisures)}</span>
                <span>Cupones: {formatter.format(totalCupones)}</span>
                <span>Otros: {formatter.format(totalOtros)}</span>
              </div>
              <hr />
              <div>
                <div>
                  <span>Total pagado: {formatter.format(totalPagado)}</span>
                </div>
                <div>
                  <span>Comisión: {formatter.format(comision)}</span>
                </div>
                <div>
                  <span>Fecha de servicio: {fechaServicio}</span>
                </div>
                <div>
                  <span>Observaciones: {item.observaciones}</span>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
