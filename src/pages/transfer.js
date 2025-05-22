import Product from "@/components/card/Product";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function Transfer() {
  const router = useRouter();
  const [transfer, setTransfer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadTransfer = () => {
      const products = JSON.parse(localStorage.getItem("products")) || [];

      const filteredTransfer = products.filter(
        (product) => product.id_servicio === "1"
      );
      setTransfer(filteredTransfer);
    };
    loadTransfer();
  }, []);

  const filteredTransfer = transfer.filter((transfer) =>
    `${transfer.name} ${transfer.short_description} ${transfer.code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-main">
      <h1 className="title">Traslados</h1>
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
      {filteredTransfer.map((transfer, index) => (
        <Product
          key={index}
          location={transfer.code}
          title={transfer.name}
          price={transfer.rates?.[0]?.ratePrices?.[0]?.price_day || 0}
          currency={transfer.rates?.[0]?.moneda || "MXN"}
          description={transfer.short_description}
          img={`${apiUrl}/images/multimedia/${transfer.multimedias?.[0]?.path}`}
          onClick={() => router.push(`/${transfer.product_code}`)}
        />
      ))}
    </div>
  );
}
