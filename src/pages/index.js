import SearchRatesUseCase from "@/application/usecases/RatesUseCase/SearchRatesUseCase";
import RatesRepo from "@/infraestructure/implementation/httpRequest/axios/RateRepo";
import { BodyStyled } from "@/styles/Home.styled";
import React, { useEffect, useState } from "react";
export default function Home() {

  const onSubmit = async () => {
    const searchRate = {
      product_code: "1",
      adults: "2",
      children: "0",
      id_servicio: "2",
      business_code: "2",
      codigo_destino: "HX",
      plataforma: "admin",
      start_date: "2025-04-15",
      end_date: "",
      zona_hotel: "",
      categoria_transporte: "",
      tipo_viaje: "",
    };

    try {
      const ratesRepo = new RatesRepo();
      const createRateUseCase = new SearchRatesUseCase(ratesRepo);
      const response = await createRateUseCase.run(searchRate);
      console.log(response);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <BodyStyled>
      <h1>Paraíso Huatulco - Tours</h1>
      <button onClick={onSubmit}>Buscar tarifas</button>
      {/* <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            name="product_code"
            placeholder="Código del producto"
            value={formData.product_code}
            onChange={handleChange}
          />
          <input
            type="number"
            name="adults"
            placeholder="Adultos"
            value={formData.adults}
            onChange={handleChange}
          />
          <input
            type="number"
            name="children"
            placeholder="Niños"
            value={formData.children}
            onChange={handleChange}
          />
          <input
            type="text"
            name="codigo_destino"
            placeholder="Código destino"
            value={formData.codigo_destino}
            onChange={handleChange}
          />
          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </div>
      </form> */}
      {/* <div>
        <h2>Resultado:</h2>
        {results.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            <p>Código: {item.code}</p>
            {item.rates.map((rate, i) => (
              <div key={rate.rate_code}>
                <span>Tarifa: {rate.rate_title}</span>
                <ul>
                  {rate.ratePrices.map((price, j) => (
                    <li key={price.id_price}>
                      Precio: {price.price_day} {price.moneda}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div> */}
    </BodyStyled>
  );
}
