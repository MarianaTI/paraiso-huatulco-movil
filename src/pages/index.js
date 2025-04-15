import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import React, { useEffect, useState } from "react";
export default function Home() {
  const [tours, setTours] = useState([]);

  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
  const fetchTours = async () => {
    try {
      const response = await getAllToursUseCase.run();
      setTours(response);
    } catch (error) {
      console.error("Error fetching tours: ", error);
    }
  };

  // useEffect(() => {
  //   fetchTours();
  // }, []);

  return (
    <>
      <h1>Paraíso Huatulco</h1>
    </>
  );
}
