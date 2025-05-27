import Product from "@/components/card/Product";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const API_URL = 'https://admindemo.paraisohuatulco.com';

export default function Tours() {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadTours = () => {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      const filteredTours = products.filter(
        (product) => product.id_servicio === "2"
      );
      setTours(filteredTours);
    };
    loadTours();
  }, []);

  const filteredTours = tours.filter((tour) =>
    `${tour.name} ${tour.short_description} ${tour.code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-main">
      <h1 className="title">Tours</h1>
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
      {filteredTours.map((tour, index) => (
        <Product
          key={index}
          location={tour.code}
          title={tour.name}
          price={tour.rates?.[0]?.ratePrices?.[0]?.price_day || 0}
          currency={tour.rates?.[0]?.moneda || "MXN"}
          description={tour.short_description}
          img={tour.multimedias?.[0]?.path ? `${API_URL}/images/multimedia/${tour.multimedias[0].path}` : null}
          onClick={() => router.push(`/${tour.product_code}`)}
        />
      ))}
    </div>
  );
}
