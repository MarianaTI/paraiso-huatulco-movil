import Image from "next/image";
import React from "react";

const Product = ({ title, description, img, onClick }) => {
  return (
    <div onClick={onClick} className="w-100 card-style">
      <Image src={img} alt="product" className="card-image" width={100} height={80}/>
      <div className="p-2 d-flex flex-column gap-2">
        <span>{title}</span>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default Product;
