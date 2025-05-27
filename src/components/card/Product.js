import Image from "next/image";
import React from "react";

const getLocationName = (code) => {
  if (!code) {
    return "Ubicación desconocida";
  }

  const locationMapping = {
    HX: "Huatulco",
    PX: "Puerto Escondido",
    OX: "Oaxaca",
  };

  const locationCode = code.substring(0, 2);
  return locationMapping[locationCode] || "Ubicación desconocida";
};

const Product = ({ title, description, location, img, price, currency, onClick }) => {
  const imageUrl = img || '/placeholder-image.png';
  
  return (
    <div onClick={onClick} className="w-100 card-style">
      <div style={{ position: 'relative', width: '100%', height: '200px' }}>
        <Image
          src={imageUrl}
          alt={title || "product"}
          fill
          style={{ objectFit: 'cover' }}
          className="card-image"
        />
      </div>
      <div className="px-3 d-flex flex-column gap-2">
        <span className="product-location">{getLocationName(location)}</span>
        <span className="product-title">{title}</span>
        <p>{description}</p>
      </div>
      <div className="w-100 px-3 pb-4 price-section">
        <span className="price">${price} {currency}</span>
        <span className="price-label">precio total</span>
      </div>
    </div>
  );
};

export default Product;
