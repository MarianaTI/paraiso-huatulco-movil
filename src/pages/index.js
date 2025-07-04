import Image from "next/image";
import React from "react";

const Login = () => {
  return (
    <div className="container container-login">
      <div className="login-content">
        <Image
          src="https://www.2businesstravel.com/images/agencia_899/899_logo_agencia.webp"
          alt="Logo"
          width={158}
          height={60}
          style={{ padding: 12, marginBottom: 24 }}
        />
        <h1 className="title p-0 text-center">Inicio de sesión</h1>
        <span className="description">
          Ingresa tus datos para acceder a todas las funciones.
        </span>
        <form className="my-4 w-100">
          <div className="form-container pb-3">
            <label htmlFor="correo" className="form-label-login">
              Nombre de usuario / Email *
            </label>
            <input
              type="text"
              id="correo"
              placeholder="Ingresa tu email"
              className="form-input-styled"
            ></input>
          </div>
          <p className="text-end m-0 label-pass">¿Olvidó su contraseña?</p>
          <div className="form-container pb-3">
            <label htmlFor="contraseña" className="form-label-login">
              Contraseña *
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              className="form-input-styled"
            ></input>
          </div>
          <div className="form-check">
            <input type="checkbox" id="check" class="form-check-input"></input>
            <label className="form-check-label" htmlFor="check">
              Recordarme la próxima vez
            </label>
          </div>
          <button className="button-login">Inicio de sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
