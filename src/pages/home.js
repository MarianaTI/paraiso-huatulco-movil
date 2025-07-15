import GetAllClientUseCase from "@/application/usecases/GetAllClientUseCase";
import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import GetTopProducts from "@/application/usecases/GetTopProducts";
import Categories from "@/components/categories/Categories";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import ClientRepo from "@/infraestructure/implementation/httpRequest/axios/ClientRepo";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { GoPlus } from "react-icons/go";
import { motion } from "framer-motion";
import HotelRepo from "@/infraestructure/implementation/httpRequest/axios/HotelRepo";
import GetAllHotelUseCase from "@/application/usecases/GetAllHotelUseCase";

export default function Home() {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState({
    traslados: [],
    tours: [],
    rentas: [],
  });
  const [hotel, setHotel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const isOnline = useOnlineStatus();

  const toursRepo = new TourRepo();
  const clientsRepo = new ClientRepo();
  const hotelRepo = new HotelRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
  const getTopProducts = new GetTopProducts(toursRepo);
  const getAllClientsUseCase = new GetAllClientUseCase(clientsRepo);
  const getAllHotelUseCase = new GetAllHotelUseCase(hotelRepo);

  const loadToursFromLocalStorage = () => {
    try {
      const cachedProducts = localStorage.getItem("products");
      const cachedClients = localStorage.getItem("clients");
      const cachedTop = localStorage.getItem("top");
      const cachedHotel = localStorage.getItem("hoteles");
      if (cachedProducts && cachedClients) {
        const parsedProducts = JSON.parse(cachedProducts);
        const parsedClients = JSON.parse(cachedClients);
        const parsedTop = JSON.parse(cachedTop);
        const parsedHotel = JSON.parse(cachedHotel);
        if (
          Array.isArray(parsedProducts) &&
          Array.isArray(parsedClients) &&
          Array.isArray(parsedTop) &&
          Array.isArray(parsedHotel)
        ) {
          setTours(parsedProducts);
          setClients(parsedClients);
          setProducts(parsedTop);
          setHotel(parsedHotel);
          return true;
        } else {
        }
      }
    } catch (error) {}
    return false;
  };

  const fetchAndCacheTours = async () => {
    try {
      const response = await getAllToursUseCase.run();
      const responseClients = await getAllClientsUseCase.run();
      const responseTop = await getTopProducts.run();
      const responseHotel = await getAllHotelUseCase.run();
      if (
        (response && Array.isArray(response)) ||
        (responseClients && Array.isArray(responseClients)) ||
        (responseTop && Array.isArray(responseTop)) ||
        (responseHotel && Array.isArray(responseHotel))
      ) {
        setTours(response);
        setClients(responseClients.response);
        setProducts(responseTop);
        setHotel(responseHotel);
        localStorage.setItem("products", JSON.stringify(response));
        localStorage.setItem(
          "clients",
          JSON.stringify(responseClients.response)
        );
        localStorage.setItem("top", JSON.stringify(responseTop));
        localStorage.setItem("hoteles", JSON.stringify(responseHotel.response));
        return true;
      } else {
      }
    } catch (error) {}
    return false;
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      const loadedFromCache = loadToursFromLocalStorage();

      if (isOnline) {
        const fetchedOnline = await fetchAndCacheTours();

        if (!fetchedOnline && !loadedFromCache) {
          setTours([]);
          setClients([]);
          setProducts([]);
          setHotel([]);
        }
      } else {
        if (!loadedFromCache) {
          setTours([]);
          setClients([]);
          setProducts([]);
          setHotel([]);
        }
      }
      setLoading(false);
    };

    initializeData();
  }, [isOnline]);

  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (categoria) => {
    setOpenCategory(openCategory === categoria ? null : categoria);
  };

  return (
    <section>
      <div className="container-main">
        <h1 className="title">Selecciona el servicio</h1>
        <span>
          Elige el servicio que necesitas para continuar con tu reserva y dar el
          siguiente paso.
        </span>
      </div>
      <div className="container-section">
        <span className="all-services">Todos los servicios</span>
        {!isOnline && (
          <div className="alert alert-warning" role="alert">
            Estás en modo offline. Algunos datos pueden no estar actualizados.
          </div>
        )}
        {/* Asegúrate de pasar 'tours' a 'Categories' si los necesita para filtrar o mostrar */}
        <Categories
          tours={tours}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>
      <motion.div
        key="content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mx-4">
          <h1 className="title">Top de productos</h1>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div className="collapse-container">
              {Object.entries(products).map(([categoria, items]) => (
                <div key={categoria} className="collapse-line">
                  <div
                    onClick={() => toggleCategory(categoria)}
                    className="collapse-button"
                  >
                    <span className="collapse-title">
                      {categoria.charAt(0).toUpperCase() + categoria.slice(1)}
                    </span>
                    <span className="collapse-title">
                      {openCategory === categoria ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </span>
                  </div>
                  {openCategory === categoria && (
                    <div className="px-4 py-2 collapse-content">
                      {items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`py-3 d-flex justify-content-between align-items-center ${
                            idx !== items.length - 1 ? "collapse-line" : ""
                          }`}
                        >
                          <span className="font-medium">{item.nombre}</span>
                          <button
                            className="product-button"
                            onClick={() => router.push(`/${item.product_code}`)}
                          >
                            <GoPlus />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
