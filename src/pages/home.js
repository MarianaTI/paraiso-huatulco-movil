import GetAllClientUseCase from "@/application/usecases/GetAllClientUseCase";
import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Categories from "@/components/categories/Categories";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import ClientRepo from "@/infraestructure/implementation/httpRequest/axios/ClientRepo";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isOnline = useOnlineStatus();

  const toursRepo = new TourRepo();
  const clientsRepo = new ClientRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
  const getAllClientsUseCase = new GetAllClientUseCase(clientsRepo);

  const loadToursFromLocalStorage = () => {
    try {
      const cachedProducts = localStorage.getItem("products");
      const cachedClients = localStorage.getItem("clients");
      if (cachedProducts && cachedClients) {
        const parsedProducts = JSON.parse(cachedProducts);
        const parsedClients = JSON.parse(cachedClients);
        if (Array.isArray(parsedProducts) && Array.isArray(parsedClients)) {
          setTours(parsedProducts);
          setClients(parsedClients);
          return true;
        } else {
        }
      }
    } catch (error) {
    }
    return false; 
  };

  const fetchAndCacheTours = async () => {
    try {
      const response = await getAllToursUseCase.run();
      const responseClients = await getAllClientsUseCase.run();
      if (response && Array.isArray(response) || responseClients && Array.isArray(responseClients)) {
        setTours(response); 
        setClients(responseClients.response);
        localStorage.setItem("products", JSON.stringify(response)); 
        localStorage.setItem("clients", JSON.stringify(responseClients.response)); 
        return true; 
      } else {
      }
    } catch (error) {
    }
    return false; 
  };

  useEffect(() => {
    const initializeData = async () => {

      const loadedFromCache = loadToursFromLocalStorage();

      if (isOnline) {
        const fetchedOnline = await fetchAndCacheTours(); 

        if (!fetchedOnline && !loadedFromCache) {
          setTours([]);
          setClients([]);
        } else if (fetchedOnline) {
        } else if (loadedFromCache) {
        }

      } else {
        if (!loadedFromCache) {
          setTours([]);
          setClients([]);
        } else {
        }
      }
    };

    initializeData();
  }, [isOnline]); 
  
  return (
    <section>
      <div className="container-main">
        <h1 className="title">Selecciona el servicio</h1>
        <span>Elige el servicio que necesitas para continuar con tu reserva y dar el siguiente paso.</span>
      </div>
      <div className="container-section">
        <span className="all-services">Todos los servicios</span>
        {!isOnline && (
          <div className="alert alert-warning" role="alert">
            Estás en modo offline. Algunos datos pueden no estar actualizados.
          </div>
        )}
        {/* Asegúrate de pasar 'tours' a 'Categories' si los necesita para filtrar o mostrar */}
        <Categories tours={tours} searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
      </div>
    </section>
  );
}