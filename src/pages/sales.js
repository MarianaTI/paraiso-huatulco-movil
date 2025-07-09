import GetAllSaleUseCase from '@/application/usecases/SaleUseCase/GetAllSaleUseCase';
import SaleRepo from '@/infraestructure/implementation/httpRequest/axios/SaleRepo';
import React, { useEffect, useState } from 'react';
import { LuLink } from "react-icons/lu";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrlPortal = process.env.NEXT_PUBLIC_API_URL_PORTAL;

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);

  const userId = useSelector((state) => state.user._id);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(1);
  const saleRepo = new SaleRepo();
  const getAllSaleUseCase = new GetAllSaleUseCase(saleRepo);

  const copyLink = async (id_venta) => {
    const link = `${apiUrlPortal}rents/success/A2R${id_venta}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.info("Enlace copiado al portapapeles");
    } catch (error) {
      console.error("Error al copiar el enlace:", error);
      alert("No se pudo copiar el enlace.");
    }
  } 

  const fetchSales = async (page = 1) => {
    try {
      setLoading(true);
      const response = await getAllSaleUseCase.run(userId, page);
      setSales(response.response);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error cargando las ventas: ", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSales(page);
  }, [page]);

  if (loading) {
    return (
      <div className='loader-container'>
        <div class="loader"></div>
      </div>
    );
  }

  return (
    <div className='m-4'>
        <h1 className='title m-0'>Ventas</h1>
        <span className='description'>Aquí encontrarás el registro de tus ventas.</span>
        <div className='sale-container'>
          {sales.map((item, index) => (
            <div key={index} className='sale-style'>
              <div className='sale-data-container data-code'>
                <div className='sale-title'>
                  <span className='code'>ID # {item.id_venta}</span>
                  <span>{item?.fecha}</span>
                </div>
                <div className='status'>{item?.estatus}</div>
              </div>
              <section>
                <div className='sale-data-container'>
                  <span>Código de confirmación</span>
                  <h6>{item?.ventasServiciosPhs[0]?.codigo}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Titular</span>
                  <h6>{item?.pasajero_titular}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Destino</span>
                  <h6>{item?.ventasServiciosPhs[0]?.destino ? item?.ventasServiciosPhs[0]?.destino : 'N/A'}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Descripción</span>
                  <h6>{item?.descripcion ? item?.descripcion : 'N/A'}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Total</span>
                  <h6>{item?.ventasServiciosPhs[0]?.total}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Moneda</span>
                  <h6>{item?.moneda}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Agente</span>
                  <h6>{item?.agente}</h6>
                </div>
                <div className='sale-data-container'>
                  <span>Agencia</span>
                  <h6>{item?.ventasServiciosPhs[0]?.referenciaOrigenCliente ? item?.ventasServiciosPhs[0]?.referenciaOrigenCliente : 'N/A'}</h6>
                </div>
              </section>
              <div className='pt-4 d-flex gap-3'>
                <a href={`${apiUrl}/pwa/view/${item.id_venta}`} className='download-btn'>Descargar</a>
                <button onClick={() => copyLink(item.id_venta)} className='copy-btn'><LuLink /></button>
              </div>
            </div>
          ))}
          <section className='d-flex flex-column justify-content-center align-items-center gap-3 my-4'>
            <div className='pagination-container gap-4'>
              <button
                className='pagination-btn'
                disabled={page === 1}
                onClick={() => {
                  setPage(page - 1);
                  window.scrollTo({top: 0, behavior: 'smooth'});
                }}
              >
                <MdKeyboardArrowLeft />
              </button>
              <span className='pagination-text'>Página {page}</span>
              <button
                className='pagination-btn'
                disabled={page === totalPages}
                onClick={() => {
                  setPage(page + 1);
                  window.scrollTo({top: 0, behavior: 'smooth'})
                }}
              >
                <MdKeyboardArrowRight />
              </button>
            </div>
            <span className="all-services">
              {total} resultados
            </span>
          </section>
        </div>
    </div>
  )
}
