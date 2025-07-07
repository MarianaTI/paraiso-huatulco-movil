import GetAllSaleUseCase from '@/application/usecases/SaleUseCase/GetAllSaleUseCase';
import SaleRepo from '@/infraestructure/implementation/httpRequest/axios/SaleRepo';
import React, { useEffect, useState } from 'react'

export default function Sales() {
  const [sales, setSales] = useState([]);

  const saleRepo = new SaleRepo();
  const getAllSaleUseCase = new GetAllSaleUseCase(saleRepo);

  const fetchSales = async () => {
    try {
      const response = await getAllSaleUseCase.run();
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
        <div className='mt-4'>
          {sales.map((item, index) => (
            <div key={index}>
              <div className='d-flex justify-content-between align-items-center'>
                <div>
                  <h4>ID #{item.id_venta}</h4>
                  <span>{item?.fecha}</span>
                </div>
                {item?.estatus}
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Código de confirmación</h5>
                <span>{item?.ventasServiciosPhs[0]?.codigo}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Titular</h5>
                <span>{item?.pasajero_titular}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Destino</h5>
                <span>{item?.ventasServiciosPhs[0]?.destino ? item?.ventasServiciosPhs[0]?.destino : 'N/A'}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Descripción</h5>
                <span>{item?.descripcion ? item?.descripcion : 'N/A'}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Total</h5>
                <span>{item?.ventasServiciosPhs[0]?.total}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Moneda</h5>
                <span>{item?.moneda}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Agente</h5>
                <span>{item?.agente}</span>
              </div>
              <div className='d-flex justify-content-between align-items-center'>
                <h5>Agencia</h5>
                <span>{item?.dealerCode?.name ? item?.dealerCode?.name : 'N/A'}</span>
              </div>
            </div>
          ))}
        </div>
    </div>
  )
}
