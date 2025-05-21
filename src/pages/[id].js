import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
import { useRouter } from "next/router";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function ProductDetail({ tour }) {
  const router = useRouter();

  if (!tour) {
    return <h1>Tour no encontrado</h1>;
  }

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
  
  return (
    <div className="px-5 py-2">
      <div>
        <h1 className="title">{tour.name}</h1>
        <div className="my-4" style={{ width: "100%", height: 250 }}>
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
            className="w-100 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: tour.description }}
          ></div>
          <span className="description-title">Incluye</span>
          <div
            className="w-100 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: tour.include }}
          ></div>
          <span className="description-title">No incluye</span>
          <div
            className="w-100 overflow-hidden"
            dangerouslySetInnerHTML={{ __html: tour.not_include }}
          ></div>
        </div>
      </div>
    </div>
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
    fallback: false,
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


