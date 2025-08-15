import GetDisponibilidadTour from "@/application/usecases/SaleUseCase/GetDisponibilidadTour";
import GetDisponibildadTraslado from "@/application/usecases/SaleUseCase/GetDisponibilidadTraslado";
import GetDisponibildadUnidad from "@/application/usecases/SaleUseCase/GetDisponibilidadUnidad";
import GetUnidades from "@/application/usecases/SaleUseCase/GetUnidades";
import Renta from "@/components/card/Renta";
import Tour from "@/components/card/Tour";
import Traslado from "@/components/card/Traslado";
import OfflinePage from "@/components/OfflinePage";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import SaleRepo from "@/infraestructure/implementation/httpRequest/axios/SaleRepo";
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
export default function Disponibilidad() {
  const isOnline = useOnlineStatus();
  const [activeTab, setActiveTab] = useState("tour");
  const [searchTours, setSearchTours] = useState("");
  const [searchTraslados, setSearchTraslados] = useState("");
  const [searchRentas, setSearchRentas] = useState("");
  const [searchUnidades, setSearchUnidades] = useState("");
  const [mostrarTodosTours, setMostrarTodosTours] = useState(false);
  const [mostrarTodosTraslados, setMostrarTodosTraslados] = useState(false);

  const [tour, setTour] = useState([]);
  const [traslado, setTraslado] = useState([]);
  const [renta, setRenta] = useState([]);
  const [unidad, setUnidad] = useState([]);

  const saleRepo = new SaleRepo();
  const getDisponibilidadTour = new GetDisponibilidadTour(saleRepo);
  const getDisponibildadTraslado = new GetDisponibildadTraslado(saleRepo);
  const getDisponibildadUnidad = new GetDisponibildadUnidad(saleRepo);
  const getUnidades = new GetUnidades(saleRepo);

  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [params, setParams] = useState({
    fecha: getToday(),
    destino: "HX",
  });

  const opciones = [
    { value: "HX", label: "Huatulco" },
    { value: "PX", label: "Puerto Escondido" },
    { value: "OX", label: "Oaxaca" },
  ];

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    if (name === "start") {
      setParams((prev) => ({ ...prev, fecha: value }));
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const [year, month, day] = fecha.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date
      .toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/^\w/, (c) => c.toUpperCase());
  };

  const fetchDisponibilidadTour = async (fecha, destino) => {
    try {
      const response = await getDisponibilidadTour.run(fecha, destino);
      setTour(response.response);
    } catch (error) {
      console.error("Error cargando los tours: ", error);
    }
  };

  const fetchDisponibilidadTraslado = async (fecha, destino) => {
    try {
      const response = await getDisponibildadTraslado.run(fecha, destino);
      setTraslado(response.productos);
    } catch (error) {
      console.error("Error cargando los traslados: ", error);
    }
  };

  const fetchDisponibilidadUnidad = async (fecha, destino) => {
    try {
      const response = await getDisponibildadUnidad.run(fecha, destino);
      setRenta(response.response);
    } catch (error) {
      console.error("Error cargando las unidades: ", error);
    }
  };

  const fetchUnidades = async (fecha, destino) => {
    try {
      const response = await getUnidades.run(fecha, destino);
      setUnidad(response.response);
    } catch (error) {
      console.error("Error cargando unidades: ", error);
    }
  };

  const buscador = (servicio, termino, mostrarTodos = false) => {
    if (!servicio) return [];
    const term = (termino || "").toLowerCase();

    let filtrados = servicio.filter((item) => {
      const nombre = (item.nombre || "").toLowerCase();
      const codigo = (item.codigo || "").toLowerCase();
      return nombre.includes(term) || codigo.includes(term);
    });

    if (!term && !mostrarTodos) {
      return filtrados.slice(0, 5);
    }

    return filtrados;
  };

  const toursDisponibilidad = useMemo(() => {
    return buscador(tour, searchTours, mostrarTodosTours);
  }, [tour, searchTours, mostrarTodosTours]);

  const trasladosDisponibilidad = useMemo(() => {
    return buscador(traslado, searchTraslados, mostrarTodosTraslados);
  }, [traslado, searchTraslados, mostrarTodosTraslados]);

  const rentaDisponibilidad = useMemo(() => {
    if (!renta) return [];

    const term = (searchRentas || "").toLowerCase();

    return renta.filter((u) => {
      const nombre = (u.nombre || "").toLowerCase();
      const codigo = (u.codigo || "").toLowerCase();
      return nombre.includes(term) || codigo.includes(term);
    });
  }, [renta, searchRentas]);

  const unidadDisponibilidad = useMemo(() => {
    if (!unidad) return [];

    const term = (searchUnidades || "").toLowerCase();

    return unidad.filter((u) => {
      const nombre = (u.nombre || "").toLowerCase();
      const codigo = (u.codigo || "").toLowerCase();
      return nombre.includes(term) || codigo.includes(term);
    });
  }, [unidad, searchUnidades]);

  useEffect(() => {
    fetchDisponibilidadTour(params.fecha, params.destino);
    fetchDisponibilidadTraslado(params.fecha, params.destino);
    fetchDisponibilidadUnidad(params.fecha, params.destino);
    fetchUnidades(params.fecha, params.destino);
  }, [params]);

  return (
    <>
      {!isOnline ? (
        <OfflinePage />
      ) : (
        <div className="p-4">
          <h1 className="title m-0">Disponibilidad</h1>
          <form className="d-flex flex-column mt-2">
            <div className="grid-form">
              <div className="grid-item">
                <label className="form-label-styled">Destino</label>
                <Select
                  required
                  name="destino"
                  options={opciones}
                  value={opciones.find((opt) => opt.value === params.destino)}
                  onChange={(selectedOption) =>
                    setParams((prev) => ({
                      ...prev,
                      destino: selectedOption.value,
                    }))
                  }
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
                />
              </div>
              <div className="grid-item">
                <label className="form-label-styled">Fecha</label>
                <input
                  type="date"
                  name="start"
                  value={params.fecha}
                  onChange={handleChangeInput}
                  className="mb-2 form-input-styled-report"
                />
              </div>
            </div>
          </form>
          <div className="mt-3">
            <ul className="nav nav-pills">
              <li className="nav-item">
                <button
                  className={`pills-design nav-link ${
                    activeTab === "tour" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("tour")}
                >
                  Tours
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`pills-design nav-link ${
                    activeTab === "traslado" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("traslado")}
                >
                  Traslados
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`pills-design nav-link ${
                    activeTab === "renta" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("renta")}
                >
                  Rentas
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`pills-design nav-link ${
                    activeTab === "unidades" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("unidades")}
                >
                  Unidades
                </button>
              </li>
            </ul>
            <div className="mt-3">
              {activeTab === "tour" && (
                <div>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Buscar"
                      value={searchTours}
                      onChange={(e) => setSearchTours(e.target.value)}
                    />
                    <button
                      className="show-button"
                      onClick={() => setMostrarTodosTours((prev) => !prev)}
                    >
                      {mostrarTodosTours ? "Top" : "Todos"}
                    </button>
                  </div>
                  <div className="mt-3">
                    {toursDisponibilidad.map((tour, index) => (
                      <Tour
                        key={index}
                        name={tour.nombre}
                        code={tour.codigo}
                        hour={tour.horario}
                        availability={tour.disponible}
                        count={tour.personas_disponibles}
                        max={tour.max_personas}
                        adults={tour.adultos}
                        kids={tour.menores}
                        babies={tour.infantes}
                      />
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "traslado" && (
                <div>
                  <div className="d-flex gap-2">
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Buscar"
                      value={searchTraslados}
                      onChange={(e) => setSearchTraslados(e.target.value)}
                    />
                    <button
                      className="show-button"
                      onClick={() => setMostrarTodosTraslados((prev) => !prev)}
                    >
                      {mostrarTodosTraslados ? "Top" : "Todos"}
                    </button>
                  </div>
                  <div className="mt-3">
                    {trasladosDisponibilidad.map((traslado, index) => (
                      <div key={index}>
                        <Traslado
                          code={traslado.codigo}
                          name={traslado.nombre}
                          service={traslado.tipo_servicio}
                          rate={traslado.tarifa}
                          type={traslado.x_unidad}
                          availability={traslado.disponible}
                          count={traslado.disponibles}
                          fill={traslado.ocupadas}
                          max={traslado.max_pasajeros}
                          adults={traslado.adultos_totales}
                          kids={traslado.menores_totales}
                          babies={traslado.infantes_totales}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "renta" && (
                <div>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar"
                    value={searchRentas}
                    onChange={(e) => setSearchRentas(e.target.value)}
                  />
                  <div className="mt-3">
                    {rentaDisponibilidad.map((renta, index) => (
                      <Renta
                        key={index}
                        name={renta.nombre}
                        code={renta.codigo}
                        date={renta.ventas[0].fecha_inicio}
                        date2={renta.ventas[0].fecha_final}
                        availability={renta.disponible}
                        count={renta.disponibles}
                        max={renta.max_personas}
                        adults={renta.adultos}
                        kids={renta.menores}
                        babies={renta.infantes}
                        service={renta.servicio}
                        fill={renta.ocupados}
                        min={renta.min_personas}
                      />
                    ))}
                  </div>
                </div>
              )}
              {activeTab === "unidades" && (
                <div>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar"
                    value={searchUnidades}
                    onChange={(e) => setSearchUnidades(e.target.value)}
                  />
                  <div className="mt-3">
                    {unidadDisponibilidad.map((unidad, index) => (
                      <Renta
                        key={index}
                        name={unidad.nombre}
                        code={unidad.codigo}
                        date={unidad.ventas[0]?.fecha_inicio || ""}
                        date2={unidad.ventas[0]?.fecha_final || ""}
                        availability={unidad.disponible}
                        count={unidad.disponibles}
                        max={unidad.max_personas}
                        adults={unidad.adultos}
                        kids={unidad.menores}
                        babies={unidad.infantes}
                        service={unidad.servicio_renta}
                        fill={unidad.ocupados}
                        min={unidad.min_personas}
                        type={unidad.servicio_renta}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
