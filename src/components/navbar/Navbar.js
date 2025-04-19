import Image from "next/image";
import Link from "next/link";
import { HiBars3 } from "react-icons/hi2";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ padding: 12 }}>
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          <Image
            src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
            alt="Logo Paraiso Huatulco"
            style={{ padding: 20 }}
            width={180}
            height={80}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <HiBars3 style={{ fontSize: 28, color: "#3B71FE" }} />
        </button>

        <div className="collapse navbar-collapse d-lg-none mean-nav" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href="/" className="nav-link">Inicio</Link>
            </li>
            <li className="nav-item">
              <Link href="/about-us" className="nav-link">Nosotros</Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">Contacto</Link>
            </li>
          </ul>
        </div>

        <ul className="navbar-nav d-none d-lg-flex ms-auto lg-nav-style">
          <li className="nav-item">
            <Link href="/" className="nav-link">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link href="/about-us" className="nav-link">Nosotros</Link>
          </li>
          <li className="nav-item">
            <Link href="/contact" className="nav-link">Contacto</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
