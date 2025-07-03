import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Categories from "@/components/categories/Categories";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const isOnline = useOnlineStatus();

  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);

  const loadToursFromLocalStorage = () => {
    try {
      const cachedProducts = localStorage.getItem("products");
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        if (Array.isArray(parsedProducts)) {
          setTours(parsedProducts);
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
      if (response && Array.isArray(response)) {
        setTours(response); 
        localStorage.setItem("products", JSON.stringify(response)); 
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
        } else if (fetchedOnline) {
        } else if (loadedFromCache) {
        }

      } else {
        if (!loadedFromCache) {
          setTours([]);
        } else {
        }
      }
    };

    initializeData();
  }, [isOnline]); 
  
  return (
    <section>
      <div className="container-main">
        <h1 className="title text-light">Servicios</h1>
        <span>Embárcate en una experiencia única y descubre Huatulco desde otra perspectiva.</span>
      </div>
      <div className="container-section">
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