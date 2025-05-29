import Link from "next/link";
import React from "react";

const Categories = () => {
  return (
    <div className="d-flex flex-column gap-3 mt-5">
      <Link className="cat-container" href="/tours">Tours</Link>
      <Link className="cat-container" href="/transfer">Traslados</Link>
      <Link className="cat-container" href="/rents">Rentas de vehículo</Link>
    </div>
  );
};

export default Categories;
