import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Product from "@/components/card/Product";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function Home() {
  const router = useRouter();
  const [tours, setTours] = useState([]);
  const isOnline = useOnlineStatus();

  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);

  useEffect(() => {
    const loadTours = async () => {
      const offlineData = JSON.parse(localStorage.getItem("offlineData")) || [];
      setTours(offlineData);

      if (isOnline) {
        try {
          const response = await getAllToursUseCase.run();
          if (response && Array.isArray(response)) {
            setTours(response);
            localStorage.setItem("offlineData", JSON.stringify(response));
          }
        } catch (error) {
          console.error("Error al obtener los tours:", error);
        }
      }
    };
    loadTours();
  }, [isOnline]);

  return (
    <div className="mx-5 my-3">
      <h1 className="principal-title">Productos</h1>
      {tours.map((tour, index) => (
        <Product
          key={index}
          title={tour.name}
          description={tour.short_description}
          img={`${apiUrl}/images/multimedia/${tour.multimedias[0]?.path}`}
          onClick={() => router.push(`/${tour.product_code}`)}
        />
      ))}
      {!isOnline && <div>Estás sin conexión. Mostrando datos guardados.</div>}
    </div>
  );
}
