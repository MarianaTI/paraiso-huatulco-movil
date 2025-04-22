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
    router.push({
      pathname: "/booking",
      query: {
        name: tour.name,
        productCode: tour.product_code,
        rateTitle: rate.rate_title,
        rateCode: rate.rate_code,
        price: rate.price_day,
        moneda: rate.moneda,
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
                    ${parseFloat(rate.price_day).toFixed(2)} {rate.moneda}
                  </td>
                  <td className="col-1">
                    <button className="button-styled" onClick={() => handleReserva(rate)}>Reservar</button>
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
      {/* <form className="form-style my-5">
        <h5>Reserva</h5>
        <div className="d-flex gap-2 align-items-end my-3">
          <span>Desde</span>
          <p className="fs-4 fw-bolder m-0">
            $0.00 <span>MXN</span>
          </p>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <FaRegCalendar />
          <input type="date" class="form-control" />
        </div>
        <hr className="line-styled" />
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <IoPeopleSharp />
          <input type="text" className="form-control" />
        </div>
        <hr className="line-styled" />
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <IoFlash />
          <button className="form-btn-styled">Cotizar</button>
        </div>
      </form> */}
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
