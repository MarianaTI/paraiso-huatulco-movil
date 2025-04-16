import SearchRatesUseCase from "@/application/usecases/RatesUseCase/SearchRatesUseCase";
import RatesRepo from "@/infraestructure/implementation/httpRequest/axios/RateRepo";
import { BodyStyled } from "@/styles/Home.styled";
import React, { useEffect, useState } from "react";
export default function Home() {
  const [rate, setRate] = useState([]);
  const [formData, setFormData] = useState({
    product_code: "1",
    adults: "2",
    children: "0",
    codigo_destino: "HX",
    start_date: "2025-04-15",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const searchRate = {
      ...formData,
      id_servicio: "2",
      business_code: "2",
      plataforma: "admin",
      end_date: "",
      zona_hotel: "",
      categoria_transporte: "",
      tipo_viaje: "",
    };

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const ratesRepo = new RatesRepo();
      const createRateUseCase = new SearchRatesUseCase(ratesRepo);
      const response = await createRateUseCase.run(searchRate);
      setRate(response);
    } catch (error) {
      console.log("Error en submit", error);
    }
  };

  useEffect(() => {
    if (rate) {
      console.log("rate actualizado:", rate);
    }
  }, [rate]);

  return (
    <BodyStyled>
      <h1>Paraíso Huatulco - Tours</h1>
      <form onSubmit={onSubmit}>
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
        <button type="submit">Buscar tarifas</button>
      </form>
      <div>
        <h2>Tarifas:</h2>
        {rate.map((item, index) => (
          <div key={index}>
            <h3>{item.name}</h3>
            {item.rates.map((rateItem, idx) => (
              <div key={idx} style={{display: "flex", gap: 20}}>
                <p>{rateItem.rate_title}</p>
                <p>$ {rateItem.public_rate} {rateItem.moneda}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
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
