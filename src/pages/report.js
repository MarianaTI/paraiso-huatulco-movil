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
    <div className="p-4" style={{ height: "calc(100vh - 82px)" }}>
      <h1 className="title m-0">Ventas</h1>
      <span className="description">Reporte de ventas por agente</span>
      <div className="my-4 pb-4">
        {report.map((item, index) => {
          const rate_es = item.rates?.find((rate) => rate.type == "1");
          const rate_adult = rate_es ? parseFloat(rate_es.price_day) : 0;

          const rate_menor = item.rates?.find((rate) => rate.type == "2");
          const rate_menor_value = rate_menor
            ? parseFloat(rate_menor.price_day)
            : 0;

          // Clasificación de pagos
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
            <section key={index}>
              <div>
                <h1>{item.agente}</h1>
                <h2>{item.servicio}</h2>
              </div>
              <div>
                <h3>Pasajeros</h3>
                <span>Adultos: {item.adultos}</span>
                <span>Menores: {item.menores}</span>
                <span>Infantes: {item.infantes}</span>
              </div>
              <div>
                <h3>Tarifa</h3>
                <span>Adultos: {formatter.format(rate_adult)}</span>
                <span>Menores: {formatter.format(rate_menor_value)}</span>
              </div>
              <div>
                <h3>Forma de pago</h3>
                <span>Efectivo: {formatter.format(totalEfectivo)}</span>
                <span>Tarjeta: {formatter.format(totalTarjeta)}</span>
                <span>Transferencia: {formatter.format(totalTransfer)}</span>
                <span>Leisures: {formatter.format(totalLeisures)}</span>
                <span>Cupones: {formatter.format(totalCupones)}</span>
                <span>Otros: {formatter.format(totalOtros)}</span>
              </div>
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
            </section>
          );
        })}
      </div>
    </div>
  );
}
