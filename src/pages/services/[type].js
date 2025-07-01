import Product from "@/components/card/Product";
import DialogComponent from "@/components/dialog/Dialog";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const serviceIds = {
  transfers: "1",
  tours: "2",
  rents: "3",
};

export default function ServicesPage() {
  const router = useRouter();
  const { type } = router.query;
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedDestination, setSelectedDestination] = useState("HX");
  const [tempDestination, setTempDestination] = useState("HX");

  const filteredProducts = products.filter((item) => {
    const matchSearch = `${item.name} ${item.short_description} ${item.code}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchDestination = selectedDestination === "" || item.codigo_destino === selectedDestination;
    return matchSearch && matchDestination;
  });

  useEffect(() => {
    const urlDestination = router.query.destination;
    const storedDestination = localStorage.getItem("destinoSeleccionado");
    const finalDestination = urlDestination || storedDestination || "HX";

    setSelectedDestination(finalDestination);
    setTempDestination(finalDestination);
  }, [router.query.destination]);

  useEffect(() => {
    const loadData = () => {
      const all = JSON.parse(localStorage.getItem("products")) || [];

      const serviceId = serviceIds[type];
      if (!serviceId) {
        setProducts([]);
        return;
      }

      const filtered = all.filter((p) => p.id_servicio === serviceId);
      setProducts(filtered);
    };

    if (type) loadData();
  }, [type]);

  const handleSaveDestino = () => {
    setSelectedDestination(tempDestination);
    localStorage.setItem("destinoSeleccionado", tempDestination);
  };  

  return (
    <div className="m-4">
      <h1 className="title">
        {type?.charAt(0).toUpperCase() + type?.slice(1)}
      </h1>
      <section className="row my-3">
        <div className="col-10 d-flex flex-column gap-1">
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre del servicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          className="col-2 button-filter-styled"
          data-bs-toggle="modal"
          data-bs-target="#filtroDestinoModal"
        >
          {selectedDestination}
        </button>
      </section>
      <span className="products-filter-count">
        Mostrando {filteredProducts.length} resultados
      </span>
      {filteredProducts.map((item, index) => (
        <Product
          key={index}
          cat={item?.categoria_nombre}
          title={item?.name}
          price={Number(item.rates?.[0]?.ratePrices?.[0]?.price_day) || 0}
          currency={item.rates?.[0]?.moneda || "MXN"}
          description={item?.short_description}
          img={`${apiUrl}/images/multimedia/${item.multimedias?.[0]?.path}`}
          onClick={() => router.push(`/${item.product_code}`)}
        />
      ))}
      <DialogComponent
        tempDestino={tempDestination}
        setTempDestino={setTempDestination}
        onSave={handleSaveDestino}
      />
    </div>
  );
}
