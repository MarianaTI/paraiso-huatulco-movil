import GetAllReportUseCase from "@/application/usecases/ReportUseCase/GetAllReportUseCase";
import OfflinePage from "@/components/OfflinePage";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import ReportRepo from "@/infraestructure/implementation/httpRequest/axios/ReportRepo";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Report() {
  const isOnline = useOnlineStatus();
  const [report, setReport] = useState([]);
  const [vendedor, setVendedor] = useState([]);
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  const [params, setParams] = useState({
    start: getToday(),
    end: getToday(),
    vendedor: "",
    servicio: "",
  });

  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  const reportRepo = new ReportRepo();
  const getAllReportUseCase = new GetAllReportUseCase(reportRepo);

  const fetchReports = async () => {
    const data = {
      start: params.start,
      end: params.end,
      idu: params.vendedor || 0,
      servicio: params.servicio || 0,
    };

    const response = await getAllReportUseCase.run(
      data.start,
      data.end,
      data.idu,
      data.servicio
    );
    setReport(response);
    console.log("response", response);
  };

  const downloadReport = async () => {
    return `${apiUrl}`;
  };

  const fetchVendedores = async () => {
    try {
      const response = await axios.get(`${apiUrl}/ventas/getAgentesParaiso`);
      const optionMapped = response.data.map((vendedor) => ({
        label: vendedor.nombre_usuario,
        value: vendedor.id_user,
      }));
      setVendedor(optionMapped);
    } catch (error) {
      console.error("Error fetching los vendedores:", error.message);
      throw error;
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${apiUrl}/tipoServicios/serviciosapi/`);
      const optionMapped = response.data.map((service) => ({
        label: service.tipo_servicio,
        value: service.id_servicio,
      }));
      setServices(optionMapped);
    } catch (error) {
      console.error("Error fetching los servicios:", error.message);
      throw error;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start") {
      setParams((prev) => ({
        ...prev,
        start: value,
        end: value,
      }));
    } else {
      setParams((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    fetchVendedores();
    fetchServices();
    if (params.start) {
      fetchReports();
    }
  }, [params]);

  const filteredReports = report.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.agente?.toLowerCase().includes(term) ||
      item.servicio?.toLowerCase().includes(term) ||
      item.observaciones?.toLowerCase().includes(term)
    );
  });

  return (
    <>
      {!isOnline ? (
        <div>
          <OfflinePage />
        </div>
      ) : (
        <div className="p-4">
          <h1 className="title m-0">Reportes</h1>
          <span className="description">Reporte de ventas por agente</span>
          <div className="mt-3 d-flex justify-content-end">
            <p className="m-0 date-style">
              {params.start &&
                (() => {
                  const [year, month, day] = params.start
                    .split("-")
                    .map(Number);
                  const date = new Date(year, month - 1, day);
                  return date
                    .toLocaleDateString("es-MX", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                    .replace(/^\w/, (c) => c.toUpperCase());
                })()}
            </p>
          </div>
          <form className="d-flex flex-column mt-3">
            <div className="grid-form">
              <div className="grid-item">
                <label className="form-label-styled">Vendedor</label>
                <Select
                  required
                  className="basic-single py-2 mb-2 select-height"
                  classNamePrefix="select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      height: "40px",
                      minHeight: "40px",
                      borderRadius: "8px",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "40px",
                      padding: "0 8px",
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      height: "40px",
                    }),
                  }}
                  name="vendedor"
                  value={vendedor.find((opt) => opt.value === params.vendedor)}
                  onChange={(selected) =>
                    setParams({
                      ...params,
                      vendedor: selected ? selected.value : 0,
                    })
                  }
                  options={vendedor}
                  isClearable
                />
              </div>
              <div className="grid-item">
                <label className="form-label-styled">Servicio</label>
                <Select
                  required
                  className="basic-single py-2 mb-2 select-height"
                  classNamePrefix="select"
                  styles={{
                    control: (provided) => ({
                      ...provided,
                      height: "40px",
                      minHeight: "40px",
                      borderRadius: "8px",
                    }),
                    valueContainer: (provided) => ({
                      ...provided,
                      height: "40px",
                      padding: "0 8px",
                    }),
                    indicatorsContainer: (provided) => ({
                      ...provided,
                      height: "40px",
                    }),
                  }}
                  name="servicio"
                  value={services.find((opt) => opt.value === params.servicio)}
                  onChange={(selected) =>
                    setParams({
                      ...params,
                      servicio: selected ? selected.value : 0,
                    })
                  }
                  options={services}
                  isClearable
                />
              </div>
            </div>
            <label className="form-label-styled mt-2">Fecha de servicio</label>
            <input
              type="date"
              name="start"
              value={params.start}
              onChange={handleChange}
              className="mb-2 form-input-styled-report"
            />
          </form>
          <main className="d-flex align-items-center gap-2">
            <div className="w-100">
              <input
                className="search-input"
                style={{ marginTop: 24, fontSize: 13 }}
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <a
              className="booking-button-report"
              href={`${apiUrl}/pwa/pdfVentasDiaAgente?start=${params.start}&end=${params.start}&servicio=${params.servicio}&idu=${params.vendedor}`}
            >
              Descargar
            </a>
          </main>
          <div className="my-4">
            {filteredReports.length === 0 ? (
              <div
                className="text-center text-muted py-4"
                style={{ height: "100%" }}
              >
                <p className="mb-0">No se encontraron reportes.</p>
              </div>
            ) : (
              filteredReports.map((item, index) => {
                const rate_es = item.rates?.find((rate) => rate.type == "1");
                const rate_adult = rate_es ? parseFloat(rate_es.price_day) : 0;

                const rate_menor = item.rates?.find((rate) => rate.type == "2");
                const rate_menor_value = rate_menor
                  ? parseFloat(rate_menor.price_day)
                  : 0;

                const pagos = item.pagos || [];

                const totalEfectivo = pagos
                  .filter(
                    (p) => p.id_forma_pago == "1" || p.id_forma_pago == "4"
                  )
                  .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

                const totalTarjeta = pagos
                  .filter(
                    (p) => p.id_forma_pago == "4" || p.id_forma_pago == "5"
                  )
                  .reduce((acc, curr) => acc + parseFloat(curr.monto), 0);

                const totalTransfer = pagos
                  .filter(
                    (p) => p.id_forma_pago == "2" || p.id_forma_pago == "3"
                  )
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
                      <span className="label">Adultos</span>
                      <span className="label">Menores</span>
                      <span className="label">Infantes</span>
                      <span className="value">{item.adultos}</span>
                      <span className="value">{item.menores}</span>
                      <span className="value">{item.infantes}</span>
                    </div>

                    <h3 className="title-grid-card">Tarifa</h3>
                    <div className="card-content">
                      <span className="label">Adultos</span>
                      <span className="label">Menores</span>
                      <span></span>
                      <span className="value">
                        {formatter.format(rate_adult)}
                      </span>
                      <span className="value">
                        {formatter.format(rate_menor_value)}
                      </span>
                    </div>
                    <h3 className="title-grid-card">Forma de pago</h3>
                    <div className="card-content pb-3">
                      <span className="label">Efectivo</span>
                      <span className="label">Tarjeta</span>
                      <span className="label">Transferencia</span>
                      <span className="value">
                        {formatter.format(totalEfectivo)}
                      </span>
                      <span className="value">
                        {formatter.format(totalTarjeta)}
                      </span>
                      <span className="value">
                        {formatter.format(totalTransfer)}
                      </span>
                      <span className="label pt-2">Leisures</span>
                      <span className="label pt-2">Cupones</span>
                      <span className="label pt-2">Otros</span>
                      <span className="value">
                        {formatter.format(totalLeisures)}
                      </span>
                      <span className="value">
                        {formatter.format(totalCupones)}
                      </span>
                      <span className="value">
                        {formatter.format(totalOtros)}
                      </span>
                    </div>
                    <hr className="m-0" />
                    <div className="footer-section-card">
                      <div className="d-flex justify-content-between">
                        <span className="title">Total pagado:</span>
                        <span className="text">
                          {formatter.format(totalPagado)}
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="title">Comisión:</span>
                        <span className="text">
                          {formatter.format(comision)}
                        </span>
                      </div>
                      {/* <div>
                  <span>Fecha de servicio: {fechaServicio}</span>
                </div> */}
                      {item.observaciones && (
                        <div className="d-flex justify-content-between">
                          <span className="title">Observaciones:</span>
                          <span className="text">{item.observaciones}</span>
                        </div>
                      )}
                    </div>
                  </section>
                );
              })
            )}
          </div>
        </div>
      )}
    </>
  );
}
