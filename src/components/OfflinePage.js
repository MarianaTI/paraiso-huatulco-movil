import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

const OfflinePage = () => {
  const router = useRouter();

  const backToHome = () => {
    router.push("/home");
  };
  return (
    <div className="offline-page-container">
      <Image
        src="/favicon-paraisohuatulco.png"
        width={80}
        height={80}
        alt="Logo"
        className="mb-3"
      />
      <h1 className="mt-5 offline-page-title">Conexión requerida</h1>
      <span className="offline-page-description">
        Para acceder a esta funcionalidad necesitas estar conectado a internet.
        Revisa tu red e inténtalo nuevamente.
      </span>
      <button className="back-btn mt-4" onClick={backToHome}>
        Volver al inicio
      </button>
    </div>
  );
};

export default OfflinePage;
