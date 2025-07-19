import SignOutUserUseCase from "@/application/usecases/SingOutUseCase";
import UserRepo from "@/infraestructure/implementation/httpRequest/axios/UserRepo";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiBars3 } from "react-icons/hi2";
import { useSelector } from "react-redux";
import { TbLayoutDashboard, TbBuilding } from "react-icons/tb";
import { LuTags, LuLogOut } from "react-icons/lu";
import { MdOutlineTour } from "react-icons/md";
import { HiOutlineDocument } from "react-icons/hi2";
import { useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const user = useSelector((state) => state.user);

  const closeOffcanvas = () => {
    const offcanvasEl = document.getElementById("offcanvasNavbar");
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvasEl);
    if (bsOffcanvas) {
      bsOffcanvas.hide();
    }
  };

  const LogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("clients");
    localStorage.removeItem("hoteles");
    localStorage.removeItem("products");
    localStorage.removeItem("selectedProduct");
    localStorage.removeItem("selectedRate");
    localStorage.removeItem("top");
    Cookies.remove("user_session");
    router.push("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <HiBars3 style={{ fontSize: 28, color: "#3B71FE" }} />
        </button>
        <Link href="/home" className="navbar-brand">
          <Image
            src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
            alt="Logo"
            width={135}
            height={54}
            style={{ padding: 12 }}
          />
        </Link>

        <div
          className="offcanvas offcanvas-start offcanvas-custom d-lg-none"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header mt-3 mx-2">
            <Link
              href="/home"
              className="navbar-brand"
              onClick={closeOffcanvas}
            >
              <Image
                src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
                alt="Logo"
                width={130}
                height={36}
              />
            </Link>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="names-title">
            <span className="title">
              {user?.nombre_comercial || "Cargando..."}
            </span>
            <span className="rol">
              {user?.rol
                ? user.rol.charAt(0).toUpperCase() + user.rol.slice(1)
                : "Cargando..."}
            </span>
          </div>
          <div className="offcanvas-body d-flex flex-column justify-content-between  nav-design">
            <ul className="navbar-nav">
              <li className="nav-item nav-item-design">
                <Link
                  href="/home"
                  className="nav-link w-100 d-flex gap-2 align-items-center"
                  onClick={closeOffcanvas}
                >
                  <TbLayoutDashboard className="nav-icon" />
                  Inicio
                </Link>
              </li>
              <li className="nav-item dropdown nav-item-design-drop">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <MdOutlineTour
                    style={{ height: 18, width: 18, color: "#575757" }}
                  />
                  <span className="ms-2 span-nav">Servicios</span>
                </a>

                <ul
                  className="dropdown-menu navdrop-desing"
                  aria-labelledby="navbarDropdown"
                >
                  <li className="nav-item nav-item-design p-left">
                    <Link
                      href="/tour"
                      className="dropdown-item"
                      onClick={closeOffcanvas}
                    >
                      Tours
                    </Link>
                  </li>
                  <li className="nav-item nav-item-design p-left">
                    <Link
                      href="/transfer"
                      className="dropdown-item"
                      onClick={closeOffcanvas}
                    >
                      Traslados
                    </Link>
                  </li>
                  <li className="nav-item nav-item-design p-left">
                    <Link
                      href="/rent"
                      className="dropdown-item"
                      onClick={closeOffcanvas}
                    >
                      Rentas de vehículos
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item nav-item-design">
                <Link
                  href="/sales"
                  className="nav-link w-100 d-flex gap-2 align-items-center"
                  onClick={closeOffcanvas}
                >
                  <LuTags className="nav-icon" />
                  Ventas
                </Link>
              </li>
              <li className="nav-item nav-item-design">
                <Link
                  href="/agency"
                  className="nav-link w-100 d-flex gap-2 align-items-center"
                  onClick={closeOffcanvas}
                >
                  <TbBuilding className="nav-icon" />
                  Agencias
                </Link>
              </li>
              <li className="nav-item nav-item-design">
                <Link
                  href="/report"
                  className="nav-link w-100 d-flex gap-2 align-items-center"
                  onClick={closeOffcanvas}
                >
                  <HiOutlineDocument className="nav-icon" />
                  Reportes
                </Link>
              </li>
            </ul>
          </div>
          <button className="log-out-button" onClick={LogOut}>
            <LuLogOut style={{ height: 20, width: 18, color: "#575757" }} />
            Salir
          </button>
        </div>

        {/* Menú normal en desktop */}
        <ul className="navbar-nav d-none d-lg-flex ms-auto">
          <li className="nav-item">
            <Link href="/home" className="nav-link">
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
