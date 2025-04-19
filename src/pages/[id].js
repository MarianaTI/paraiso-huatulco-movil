import GetAllToursUseCase from "@/application/usecases/GetAllToursUseCase";
import TourRepo from "@/infraestructure/implementation/httpRequest/axios/TourRepo";

export default function ProductDetail({tour}) {

  if (!tour) {
    return <h1>Tour no encontrado</h1>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Detalle del tour: {tour.name}</h1>
      <p>{tour.short_description}</p>
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