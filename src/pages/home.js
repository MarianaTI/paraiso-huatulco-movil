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
import { useSelector } from "react-redux";
import Product from "@/components/card/Product";

export default function Home() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const router = useRouter();
  const user = useSelector((state) => state.user);
  const [tours, setTours] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState({
    Traslados: [],
    Tours: [],
    Rentas: [],
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

  return (
    <section>
      <div className="container-main">
        <h1 className="title m-0 p-0">
          Hola, {user?.nombre_comercial || "Cargando..."}
        </h1>
        <span>Bienvenido de vuelta</span>
      </div>
      <div className="container-section">
        <h3>Selecciona el servicio</h3>
        <span>
          Elige el servicio que necesitas para continuar.
        </span>
        {/* <p className="all-services mt-3">Todos los servicios</p> */}
        {!isOnline && (
          <div className="alert alert-warning" role="alert">
            Estás en modo offline. Algunos datos pueden no estar actualizados.
          </div>
        )}
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
          <h3 className="mt-4">Productos más vendidos</h3>
          {loading ? (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          ) : (
            <div>
              {Object.entries(products).map(([categoria, items]) => (
                <div key={categoria}>
                  <p className="collapse-title">{categoria}</p>
                  <div>
                    {items.map((item, index) => (
                      <Product
                        key={index}
                        cat={item?.categoria_nombre}
                        title={item?.nombre}
                        price={item?.price_day}
                        currency={item.rates?.[0]?.moneda || "MXN"}
                        img={
                          item.multimedias?.[0]?.path
                            ? `${apiUrl}/images/multimedia/${item.multimedias[0].path}`
                            : "/logo.png"
                        }
                        onClick={() => router.push(`/${item.product_code}`)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
