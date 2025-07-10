import SignOutUserUseCase from "@/application/usecases/SingOutUseCase";
import UserRepo from "@/infraestructure/implementation/httpRequest/axios/UserRepo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { HiBars3 } from "react-icons/hi2";
import { useSelector } from "react-redux";

export default function Navbar() {
  const router = useRouter();
  const user = useSelector((state) => state.user);

  // const LogOut = async () => {
  //   const userRepo = new UserRepo();
  //   const signOutUseCase = new SignOutUserUseCase(userRepo);

  //   try {
  //     const response = await signOutUseCase.run();
  //     localStorage.removeItem("user");
  //     router.push("/");
  //   } catch (error) {
  //     console.error("Fallo el cierre de sesión:", error);
  //   }
  // };

  const LogOut = () => {
    localStorage.removeItem('user');
    router.push("/"); 
  }

  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm">
      <div className="container-fluid">
        <Link href="/home" className="navbar-brand">
          <Image
            src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
            alt="Logo"
            width={120}
            height={50}
            style={{ padding: 12 }}
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
          className="offcanvas offcanvas-start offcanvas-custom d-lg-none"
          tabIndex="-1"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header mt-3 mx-2">
            <Link href="/home" className="navbar-brand">
              <Image
                src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
                alt="Logo"
                width={100}
                height={25}
              />
            </Link>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Cerrar"
            ></button>
          </div>
          <div className="mt-4 mx-4 d-flex flex-column">
            <span className="fw-bold">
              {user?.nombre_comercial || "Cargando..."}
            </span>
            <span>{user?.rol || "Cargando..."}</span>
          </div>
          <div className="offcanvas-body mx-2 d-flex flex-column justify-content-between">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link href="/home" className="nav-link">
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-link">Servicios</span>
                <ul className="navbar-nav ps-3">
                  <li className="nav-item">
                    <Link href="/tour" className="nav-link">
                      Tours
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/transfer" className="nav-link">
                      Traslados
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link href="/rent" className="nav-link">
                      Rentas de vehículos
                    </Link>
                  </li>
                </ul>
              </li>
              <li className="nav-item">
                <Link href="/sales" className="nav-link">
                  Ventas
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/agency" className="nav-link">
                  Agencias
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">
                  Contacto
                </Link>
              </li>
            </ul>
            <button className="log-out-button" onClick={LogOut}>
              Salir
            </button>
          </div>
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
