import Product from "@/components/card/Product";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function Rents() {
  const router = useRouter();
  const [rents, setRents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadRents = () => {
      const products = JSON.parse(localStorage.getItem("products")) || [];

      const filteredRents = products.filter(
        (product) => product.id_servicio === "3"
      );
      setRents(filteredRents);
    };
    loadRents();
  }, []);

  const filteredRents = rents.filter((rents) =>
    `${rents.name} ${rents.short_description} ${rents.code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-main">
      <h1 className="title">Renta de vehículos</h1>
      <section className="d-flex flex-column gap-1 my-4">
        <span className="fs-8">Servicios</span>
        <input
          className="search-input"
          type="text"
          placeholder="Buscar por nombre del servicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </section>
      {filteredRents.map((rent, index) => (
        <Product
          key={index}
          location={rent.code}
          title={rent.name}
          price={rent.rates?.[0]?.ratePrices?.[0]?.price_day || 0}
          currency={rent.rates?.[0]?.moneda || "MXN"}
          description={rent.short_description}
          img={`${apiUrl}/images/multimedia/${rent.multimedias?.[0]?.path}`}
          onClick={() => router.push(`/${rent.product_code}`)}
        />
      ))}
    </div>
  );
}
