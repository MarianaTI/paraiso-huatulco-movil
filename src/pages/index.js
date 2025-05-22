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

  useEffect(() => {
    const loadTours = async () => {
      const products = JSON.parse(localStorage.getItem("products")) || [];
      setTours(products);

      if (isOnline) {
        try {
          const response = await getAllToursUseCase.run();
          if (response && Array.isArray(response)) {
            setTours(response);
            localStorage.setItem("products", JSON.stringify(response));
          } 
        } catch (error) {
          console.error("Error al obtener los tours:", error);
        }
      }
    };

    loadTours();
  }, [isOnline]);

  return (
    <div className="container-main">
      <h1 className="title">Servicios</h1>
      <Categories/>
    </div>
  );
}
