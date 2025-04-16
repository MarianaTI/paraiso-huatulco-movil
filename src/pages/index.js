import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Card from "@/components/card/Card";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { BodyStyled } from "@/styles/Home.styled";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [tours, setTours] = useState([]);
  const isOnline = useOnlineStatus();

  
  if (isOnline) {
    console.log("🔵 Estamos ONLINE: trayendo datos del servidor");
  } else {
    console.log("🔴 Estamos OFFLINE: trayendo datos del localStorage");
  }
  

  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
  const fetchTours = async () => {
    if (isOnline) {
      try {
        const response = await getAllToursUseCase.run();
        setTours(response);
        localStorage.setItem("offlineData", JSON.stringify(response));
      } catch (error) {
        console.error("Error fetching tours: ", error);
      }
    } else {
      const offlineTours = JSON.parse(localStorage.getItem("offlineData")) || [];
      setTours(offlineTours);
    }
  };

  useEffect(() => {
    fetchTours();
  }, [isOnline]);

  return (
    <BodyStyled>
      <h1>Paraíso Huatulco - Tours</h1>
      {tours.map((tour, index) => (
        <Card title={tour.name} description={tour.short_description} />
      ))}
    </BodyStyled>
  );
}
