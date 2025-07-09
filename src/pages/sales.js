import GetAllSaleUseCase from '@/application/usecases/SaleUseCase/GetAllSaleUseCase';
import SaleRepo from '@/infraestructure/implementation/httpRequest/axios/SaleRepo';
import React, { useEffect, useState } from 'react';
import { LuLink } from "react-icons/lu";
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiUrlPortal = process.env.NEXT_PUBLIC_API_URL_PORTAL;

export default function Sales() {
  const [sales, setSales] = useState([]);
  const userId = useSelector((state) => state.user._id);
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

  const fetchSales = async () => {
    try {
      const response = await getAllSaleUseCase.run(userId);
      setSales(response);
      console.log("Respuesta de ventas: ", response);
    } catch (error) {
      console.error("Error cargando las ventas: ", error);
    }
  }

  useEffect(() => {
    fetchSales();
  }, []);

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
              <div className='pt-3 d-flex justify-content-end gap-3'>
                <button onClick={() => copyLink(item.id_venta)} className='copy-btn'><LuLink /></button>
                <a href={`${apiUrl}/pwa/view/${item.id_venta}`} className='download-btn'>Descargar</a>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}
