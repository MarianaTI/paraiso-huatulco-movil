import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetail({ tour: serverTour }) {
  const router = useRouter();
  const [tour, setTour] = useState(serverTour);
  const [loading, setLoading] = useState(!serverTour);

  useEffect(() => {
    // Si no hay tour del servidor (fallback o offline), cargar desde localStorage
    if (!serverTour && router.query.id) {
      const loadTourFromStorage = () => {
        try {
          const products = JSON.parse(localStorage.getItem("products")) || [];
          const foundTour = products.find((product) => product.product_code === router.query.id);
          setTour(foundTour || null);
        } catch (error) {
          console.error("Error loading tour from localStorage:", error);
          setTour(null);
        } finally {
          setLoading(false);
        }
      };
      
      loadTourFromStorage();
    }
  }, [serverTour, router.query.id]);

  const handleReserva = (rate) => {
    console.log("rate seleccionado ->", rate);
    localStorage.setItem("selectedRate", JSON.stringify(rate));
    router.push({
      pathname: "/booking",
      query: {
        name: tour.name,
        productCode: tour.product_code,
      },
    });
  };

  // Mostrar loading mientras Next.js está generando la página (fallback: true)
  if (router.isFallback || loading) {
    return (
      <div className="px-5 py-2">
        <h1>Cargando producto...</h1>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="px-5 py-2">
        <h1>Producto no encontrado</h1>
        <button 
          className="button-styled mt-3" 
          onClick={() => router.back()}
        >
          Volver
        </button>
      </div>
    );
  }
  
  return (
    <div className="px-5 py-2">
      <div>
        <h1 className="title">{tour.name}</h1>
        <div className="my-4" style={{ width: "100%", height: 250, position: "relative" }}>
          {tour.multimedias?.[0]?.path ? (
            <Image
              alt="image-product"
              src={`${apiUrl}/images/multimedia/${tour.multimedias[0].path}`}
              fill={true}
              style={{ objectFit: "cover", borderRadius: 8 }}
            />
          ) : (
            <div style={{ 
              width: "100%", 
              height: "100%", 
              background: "#ddd", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              borderRadius: 8 
            }}>
              Sin imagen
            </div>
          )}
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
                          ${parseFloat(price.price_day || 0).toFixed(2)}{" "}
                          {rate.moneda || price.moneda || "MXN"}
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
            className="w-100 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: tour.description || "Sin descripción" }}
          ></div>
          <span className="description-title">Incluye</span>
          <div
            className="w-100 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: tour.include || "Sin información" }}
          ></div>
          <span className="description-title">No incluye</span>
          <div
            className="w-100 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: tour.not_include || "Sin información" }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  try {
    const toursRepo = new TourRepo();
    const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
    const tours = await getAllToursUseCase.run();

    const paths = tours.map((tour) => ({
      params: { id: tour.product_code },
    }));

    return {
      paths,
      fallback: true, // Importante: permite páginas no pre-generadas
    };
  } catch (error) {
    console.error("Error in getStaticPaths:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps({ params }) {
  try {
    const toursRepo = new TourRepo();
    const getAllToursUseCase = new GetAllToursUseCase(toursRepo);
    const tours = await getAllToursUseCase.run();

    const tour = tours.find((t) => t.product_code === params.id);

    return {
      props: {
        tour: tour || null,
      },
      revalidate: 3600, // Revalida cada hora
    };
  } catch (error) {
    console.error("Error in getStaticProps:", error);
    return {
      props: {
        tour: null,
      },
    };
  }
}