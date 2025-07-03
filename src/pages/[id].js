import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function ProductDetail({ tour: tourProps }) {
  const router = useRouter();
  const isOnline = useOnlineStatus();
  const { id } = router.query;
  const [tour, setTour] = useState(tourProps);

  useEffect(() => {
    if (!isOnline) {
      try {
        const cached = JSON.parse(localStorage.getItem("products")) || [];
        const found = cached.find((item) => item.product_code === id);
        if (found) setTour(found);
        else setTour(null);
      } catch (error) {
        console.error("Error para acceder al localStorage", error);
      }
    }
  }, [isOnline, tour, id]);

  if (!tour) {
    return <h1>Tour no encontrado</h1>;
  }

  const handleReserva = (rate) => {
    localStorage.setItem("selectedRate", JSON.stringify(rate));
    const safeTour = JSON.parse(JSON.stringify(tour));
    localStorage.setItem("selectedProduct", JSON.stringify(safeTour));
    router.push({
      pathname: "/booking",
    });
  };

  return (
    <section className="m-4">
      <div>
        <h1 className="title mt-4">{tour.name}.</h1>
        <div className="my-4" style={{ width: "100%", height: 160 }}>
          <Image
            alt="image-product"
            src={`${apiUrl}/images/multimedia/${tour.multimedias[0]?.path}`}
            fill={true}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        </div>
        <section>
          <table className="table-style">
            <thead>
              <tr>
                <th scope="col"></th>
                <th scope="col"></th>
                <th scope="col" className="text-center">
                  COSTO
                </th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {tour.rates?.map((rate, index) => (
                <tr key={index} className="text-center">
                  <td className="col-1">
                    <RiArrowRightSLine />
                  </td>
                  <td className="col-1">{rate.rate_title}</td>

                  <td className="col-1 fw-semibold">
                    {rate.ratePrices
                      ?.filter((price) => price.type === "1")
                      .slice(0, 1)
                      .map((price, idx) => (
                        <span key={idx}>
                          ${parseFloat(price.price_day).toFixed(2)}{" "}
                          {price.moneda}
                        </span>
                      ))}
                  </td>
                  <td className="col-1">
                    <button
                      className="button-styled"
                      onClick={() => handleReserva(rate)}
                    >
                      Reservar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <div className="d-flex flex-column">
          <span className="description-title">Descripción</span>
          <div
            className="w-100 overflow-hidden products-filter-count"
            dangerouslySetInnerHTML={{ __html: tour.description }}
          ></div>
          <span className="description-title">Incluye</span>
          <div
            className="w-100 overflow-hidden products-filter-count"
            dangerouslySetInnerHTML={{ __html: tour.include }}
          ></div>
          <span className="description-title">No incluye</span>
          <div
            className="w-100 overflow-hidden products-filter-count"
            dangerouslySetInnerHTML={{ __html: tour.not_include }}
          ></div>
        </div>
      </div>
    </section>
  );
}

export async function getStaticPaths() {
  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
  const tours = await getAllToursUseCase.run();

  const paths = tours.map((tour) => ({
    params: { id: tour.product_code },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const toursRepo = new TourRepo();
  const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
  const tours = await getAllToursUseCase.run();

  const tour = tours.find((t) => t.product_code === params.id);

  return {
    props: {
      tour: tour || null,
    },
  };
}
