import GetAllSaleUseCase from "@/application/usecases/SaleUseCase/GetAllSaleUseCase";
import SaleRepo from "@/infraestructure/implementation/httpRequest/axios/SaleRepo";
import React, { useEffect, useState } from "react";
import { LuLink } from "react-icons/lu";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteOfflineBookings,
  getAllOfflineBookings,
} from "@/utils/offlineBooking";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrlPortal = process.env.NEXT_PUBLIC_API_URL_PORTAL;

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [offlineSales, setOfflineSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const userId = useSelector((state) => state.user._id);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);

  const saleRepo = new SaleRepo();
  const getAllSaleUseCase = new GetAllSaleUseCase(saleRepo);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const fetchSales = async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await getAllSaleUseCase.run(userId, page, search);
      setSales(response.response);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error cargando las ventas: ", error);
    } finally {
      setLoading(false);
    }
  };

  const loadOfflineBookings = async () => {
    try {
      const data = await getAllOfflineBookings();
      setOfflineSales(data);
    } catch (error) {
      console.error("Error cargando reservas offline:", error);
    }
  };

  const copyLink = async (id_venta) => {
    const link = `${apiUrlPortal}rents/success/A2R${id_venta}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.info("Enlace copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar el enlace:", error);
      alert("No se pudo copiar el enlace.");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm(
      "¿Estás seguro de que deseas eliminar esta reserva?"
    );
    if (!confirmDelete) return;

    await deleteOfflineBookings(id);
    await loadBookings();
  };

  useEffect(() => {
    if (!isOnline) {
      loadOfflineBookings();
    }
  }, [isOnline]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isOnline) {
        fetchSales(page, searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page, isOnline]);

  return (
    <motion.div
      key="content"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <h1 className="title m-0">Ventas</h1>
        <span className="description">
          {isOnline
            ? "Aquí encontrarás el registro de tus ventas."
            : "Modo sin conexión. Estas son tus reservas pendientes."}
        </span>
        {isOnline ? (
          <>
            <div className="w-100">
              <input
                className="search-input"
                style={{ marginTop: 24 }}
                type="text"
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="d-flex flex-column justify-content-between">
              <div className="sale-container">
                {loading ? (
                  <div className="loader-container">
                    <div className="loader"></div>
                  </div>
                ) : (
                  sales.map((item, index) => (
                    <div key={index} className="sale-style">
                      <div
                        className={`status ${
                          item?.estatus === "Confirmado" ||
                          item?.estatus === "Confirmed"
                            ? "status-confirmed"
                            : item?.estatus === "Cancelada" ||
                              item?.estatus === "Cancelled"
                            ? "status-cancelled"
                            : ""
                        }`}
                      >
                        {item?.estatus}
                      </div>
                      <div className="sale-data-container my-3">
                        <span className="code">ID # {item.id_venta}</span>
                        <span className="date">
                          Fecha:{" "}
                          {item?.fecha
                            ? item.fecha.split("-").reverse().join("/")
                            : ""}
                        </span>
                      </div>
                      <section>
                        <div className="sale-data-container">
                          <span>Código de confirmación</span>
                          <h6>{item?.ventasServiciosPhs[0]?.codigo}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Titular</span>
                          <h6>{item?.pasajero_titular}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Destino</span>
                          <h6>
                            {item?.ventasServiciosPhs[0]?.destino
                              ? item?.ventasServiciosPhs[0]?.destino
                              : "N/A"}
                          </h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Descripción</span>
                          <h6>
                            {item?.descripcion ? item?.descripcion : "N/A"}
                          </h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Total</span>
                          <h6>{item?.ventasServiciosPhs[0]?.total}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Moneda</span>
                          <h6>{item?.moneda}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Agente</span>
                          <h6>{item?.agente}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Agencia</span>
                          <h6>
                            {item?.ventasServiciosPhs[0]
                              ?.referenciaOrigenCliente
                              ? item?.ventasServiciosPhs[0]
                                  ?.referenciaOrigenCliente
                              : "N/A"}
                          </h6>
                        </div>
                      </section>
                      <div className="pt-4 d-flex gap-3">
                        <a
                          href={`${apiUrl}/pwa/view/${item.id_venta}`}
                          className="download-btn"
                        >
                          Descargar
                        </a>
                        <button
                          onClick={() => copyLink(item.id_venta)}
                          className="copy-btn"
                        >
                          <LuLink />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <section className="d-flex flex-column justify-content-center align-items-center gap-3 my-4">
                <div className="pagination-container gap-4">
                  <button
                    className="pagination-btn"
                    disabled={page === 1}
                    onClick={() => {
                      setPage(page - 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <MdKeyboardArrowLeft />
                  </button>
                  <span className="pagination-text">Página {page}</span>
                  <button
                    className="pagination-btn"
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage(page + 1);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <MdKeyboardArrowRight />
                  </button>
                </div>
                <span className="all-services">{total} resultados</span>
              </section>
            </div>
          </>
        ) : (
          <>
            {offlineSales.length === 0 ? (
              <div className="empty-state-container">
                <p className="mt-4">No hay reservas offline.</p>
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-between">
                <div className="sale-container">
                  {offlineSales.map((reserva, index) => (
                    <div key={index} className="sale-style">
                      <div className="status-pending">Pendiente</div>
                      <div className="sale-data-container my-3">
                        <span className="code">ID # {reserva.id}</span>
                        {/* <span className="date">
                              Fecha:{" "}
                              {item?.fecha
                                ? item.fecha.split("-").reverse().join("/")
                                : ""}
                            </span> */}
                      </div>
                      <section>
                        <div className="sale-data-container">
                          <span>Código de confirmación</span>
                          <h6>Pendiente</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Titular</span>
                          <h6>
                            {reserva?.client_name} {reserva?.client_lastname}
                          </h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Destino</span>
                          <h6>{reserva?.destino ? reserva?.destino : "N/A"}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Total</span>
                          <h6>{reserva?.total}</h6>
                        </div>
                        <div className="sale-data-container">
                          <span>Moneda</span>
                          <h6>{reserva?.currency}</h6>
                        </div>
                      </section>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
