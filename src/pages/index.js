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

  const loadFromCache = () => {
    try {
      const cachedProducts = localStorage.getItem("products");
      if (cachedProducts) {
        const parsedProducts = JSON.parse(cachedProducts);
        setTours(parsedProducts);
        return true;
      }
    } catch (error) {
      console.error("Error al cargar del caché:", error);
    }
    return false;
  };

  const updateData = async () => {
    try {
      const response = await getAllToursUseCase.run();
      if (response && Array.isArray(response)) {
        setTours(response);
        localStorage.setItem("products", JSON.stringify(response));
        return true;
      }
    } catch (error) {
      console.error("Error al actualizar datos:", error);
    }
    return false;
  };

  useEffect(() => {
    const initializeData = async () => {

      const cacheLoaded = loadFromCache();

      if (isOnline) {
        const updated = await updateData();
        if (!updated && !cacheLoaded) {
          setTours([]);
        }
      } else if (!cacheLoaded) {
        setTours([]);
      }
    };

    initializeData();
  }, [isOnline]);

  useEffect(() => {
    if (isOnline) {
      const precacheData = async () => {
        try {
          const response = await getAllToursUseCase.run();
          if (response && Array.isArray(response)) {
            localStorage.setItem("products", JSON.stringify(response));
          }
        } catch (error) {
          console.error("Error al precargar datos:", error);
        }
      };
      precacheData();
    }
  }, [isOnline]);

  return (
    <div className="container-main">
      <h1 className="title">Servicios</h1>
      {!isOnline && (
        <div className="alert alert-warning" role="alert">
          Estás en modo offline. Algunos datos pueden no estar actualizados.
        </div>
      )}
      <Categories/>
    </div>
  );
}
