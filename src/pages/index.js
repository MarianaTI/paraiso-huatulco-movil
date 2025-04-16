import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Card from "@/components/card/Card";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { BodyStyled } from "@/styles/Home.styled";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [tours, setTours] = useState([]);
  const isOnline = useOnlineStatus();

  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);

  // const fetchTours = async () => {
  //   if (isOnline) {
  //     try {
  //       const response = await getAllToursUseCase.run();
  //       setTours(response);
  //       localStorage.setItem("offlineData", JSON.stringify(response));
  //     } catch (error) {
  //       console.error("Error fetching tours: ", error);
  //     }
  //   } else {
  //     const offlineTours =
  //       JSON.parse(localStorage.getItem("offlineData")) || [];
  //     setTours(offlineTours);
  //   }
  // };

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
            console.log("Datos guardados en localStorage");
          }
        } catch (error) {
          console.error("Error al obtener los tours:", error);
        }
      }
    }
    loadTours();
    // fetchTours();
  }, [isOnline]);

  return (
    <BodyStyled>
      <h1>Paraíso Huatulco - Tours</h1>
      {tours.map((tour, index) => (
        <Card title={tour.name} description={tour.short_description} />
      ))}
      {!isOnline && <div>Estás sin conexión. Mostrando datos guardados.</div>}
    </BodyStyled>
  );
}
