import Image from "next/image";
import Link from "next/link";
import { HiBars3 } from "react-icons/hi2";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          <Image
            src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
            alt="Logo"
            width={170}
            height={75}
            style={{ padding: 20 }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <HiBars3 style={{ fontSize: 28, color: "#3B71FE" }} />
        </button>

        <div
          className="offcanvas offcanvas-start offcanvas-custom"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header mt-3 mx-2">
            <div className="offcanvas-title" id="offcanvasNavbarLabel">
              <h5>Paraíso Huatulco</h5>
            </div>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="offcanvas-body mx-2">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">Servicios</span>
                <ul className="navbar-nav ps-3">
                  <li className="nav-item">
                    <Link href="/services/tours" className="nav-link">
                      Tours
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/services/transfers" className="nav-link">
                      Traslados
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/services/rents" className="nav-link">
                      Rentas de vehículos
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Menú normal en desktop */}
        <ul className="navbar-nav d-none d-lg-flex ms-auto">
          <li className="nav-item">
            <Link href="/" className="nav-link">
              Inicio
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/contact" className="nav-link">
              Contacto
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
