import GetAllAgencyUseCase from "@/application/usecases/AgencyUseCase/GetAllAgencyUseCase";
import AgencyRepo from "@/infraestructure/implementation/httpRequest/axios/AgencyRepo";
import React, { useEffect, useState } from "react";

export default function Agency() {
  const [agency, setAgency] = useState([]);

  const agencyRepo = new AgencyRepo();
  const getAllAgencyUseCase = new GetAllAgencyUseCase(agencyRepo);

  const fetchAgency = async () => {
    try {
      const response = await getAllAgencyUseCase.run();
      setAgency(response.response);
    } catch (error) {
      console.error("Error cargando las agencias: ", error);
    }
  };

  useEffect(() => {
    fetchAgency();
  }, []);

  return (
    <div className="p-4">
      <h1 className="title m-0">Agencias</h1>
      <div className="mt-3">
        <span className="all-services">
          Mostrando {agency.length} resultados
        </span>
        <div className="sale-container">
          {agency.map((item, index) => (
            <div key={index} className="sale-style">
              <section>
                <div className="sale-data-container">
                  <h6 className="agency-name">{item?.name}</h6>
                  <span style={{color: "#5E5873"}}># {index + 1}</span>
                </div>
                <div className="agency-container">
                  <div>
                    <span className="all-services">Margen de venta</span>
                    <h6 className="pt-2">
                      {item?.sales_margin ? item?.sales_margin : "N/A"} %
                    </h6>
                  </div>
                  <div>
                    <span className="all-services">Margen de venta pesos</span>
                    <h6 className="pt-2">
                      {item?.sales_margin_pesos &&
                      item?.sales_margin_pesos !== "N/A"
                        ? `$ ${item.sales_margin_pesos}`
                        : "N/A"}
                    </h6>
                  </div>
                </div>
              </section>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
