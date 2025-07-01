import Link from "next/link";
import React from "react";

const Categories = () => {
  return (
    <div className="d-flex flex-column gap-3 mt-2">
      <Link className="cat-container" href="/services/tours">Tours</Link>
      <Link className="cat-container" href="/services/transfers">Traslados</Link>
      <Link className="cat-container" href="/services/rents">Rentas de vehículo</Link>
    </div>
  );
};

export default Categories;
