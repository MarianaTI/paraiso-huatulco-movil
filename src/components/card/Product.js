import Image from "next/image";
import React from "react";

const Product = ({ title, cat, img, price, currency, onClick }) => {
  return (
    <div onClick={onClick} className="card-style container">
      <div className="row container-products">
        <div className="col-4">
          <Image
            src={img}
            alt="product"
            fill
            className="card-image"
          />
        </div>
        <div className="col-8">
          <div className="d-flex flex-column justify-content-between gap-2 pb-3" style={{height: "100%"}}>
            <div className="pt-1">
              <span className="product-title">{title}</span>
              <span className="product-location">Categoria {cat}</span>
            </div>
            <span className="price">$ {price} {currency}  <span className="price-label">precio total</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
