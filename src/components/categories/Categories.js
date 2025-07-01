import Link from "next/link";
import React from "react";

const Categories = () => {
  return (
    <div>
      <div className="d-flex w-100 gap-2">
        <Link href="/services/tours" className="w-100 cat-container-a">
          <div className="cat-container">
            Tours
          </div>
        </Link>
        <Link href="/services/transfers" className="w-100 cat-container-a">
          <div className="cat-container">
            Traslados
          </div>
        </Link>
      </div>
      <Link href="/services/rents" className="w-100 cat-container-a">
        <div className="col-12 cat-container">Rentas de vehículo</div>
      </Link >
    </div>
  );
};

export default Categories;