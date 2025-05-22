import React from "react";

const Categories = () => {
  return (
    <div className="d-flex flex-column gap-3 mt-5">
      <a className="cat-container" href="/tours">Tours</a>
      <a className="cat-container" href="/transfer">Traslados</a>
      <a className="cat-container" href="/rents">Rentas de vehículo</a>
    </div>
  );
};

export default Categories;
