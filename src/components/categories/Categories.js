import Link from "next/link";
import React from "react";

const Categories = () => {
  return (
    <div className="my-4">
      <Link href="/tour" className="w-100 cat-container-a">
        <div className="cat-container">
          Tours
        </div>
      </Link>
      <Link href="/transfer" className="w-100 cat-container-a">
        <div className="cat-container">
          Traslados
        </div>
      </Link>
      <Link href="/rent" className="w-100 cat-container-a">
        <div className="col-12 cat-container">Rentas de vehículo</div>
      </Link >
    </div>
  );
};

export default Categories;