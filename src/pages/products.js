import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import Card from "@/components/card/Card";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import { BodyStyled } from "@/styles/Home.styled";
import React, { useEffect, useState } from "react";

export default function Products() {
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

  useEffect(() => {
    fetchTours();
  }, []);
  return (
    <BodyStyled>
      <h1>Paraíso Huatulco - Tours</h1>
      {tours.map((tour, index) => (
        <Card title={tour.name} description={tour.short_description} />
      ))}
    </BodyStyled>
  );
}
