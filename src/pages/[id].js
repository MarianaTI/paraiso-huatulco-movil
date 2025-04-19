import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";
import Image from "next/image";
import { RiArrowRightSLine } from "react-icons/ri";
import { FaRegCalendar } from "react-icons/fa6";
import { IoPeopleSharp, IoFlash  } from "react-icons/io5";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export default function ProductDetail({ tour }) {
  if (!tour) {
    return <h1>Tour no encontrado</h1>;
  }

  return (
    <div className="px-5 py-2">
      <div>
        <h1 className="title">{tour.name}</h1>
        <div className="my-4" style={{ width: "100%", height: 250 }}>
          <Image
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
              <tr className="text-center">
                <td className="col-1">
                  <RiArrowRightSLine />
                </td>
                <td className="col-1">Compartido</td>
                <td className="col-1 fw-semibold">$0.00 mxn</td>
                <td className="col-1">
                  <button className="button-styled">Reservar</button>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-1">
                  <RiArrowRightSLine />
                </td>
                <td className="col-1">Semiprivado</td>
                <td className="col-1 fw-semibold">$0.00 mxn</td>
                <td className="col-1">
                  <button className="button-styled">Reservar</button>
                </td>
              </tr>
              <tr className="text-center">
                <td className="col-1">
                  <RiArrowRightSLine />
                </td>
                <td className="col-1">Privado</td>
                <td className="col-1 fw-semibold">$0.00 mxn</td>
                <td className="col-1">
                  <button className="button-styled">Reservar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <span className="description-title">Descripción</span>
        <p className="pt-2">{tour.short_description}</p>
      </div>
      <form className="form-style my-5">
        <h5>Reserva</h5>
        <div className="d-flex gap-2">
          <span>Desde</span>
          <p>
            $2,680.00 <span>MXN</span>
          </p>
        </div>
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <FaRegCalendar />
          <input type="date" class="form-control"/>
        </div>
        <hr className="line-styled" />
        <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
          <IoPeopleSharp />
          <input type="text" class="form-control"/>
        </div>
        <hr className="line-styled" />
        <div>
          <IoFlash />
          <button>Cotizar</button>
        </div>
      </form>
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
