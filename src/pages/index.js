import SignInUserUseCase from "@/application/usecases/SingInUseCase";
import UserRepo from "@/infraestructure/implementation/httpRequest/axios/UserRepo";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "@/actions/userActions";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isShowPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!isShowPassword);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const username = e.target.username.value;
    const password = e.target.password.value;

    formData.append("UserLogin[username]", username);
    formData.append("UserLogin[password]", password);

    try {
      const userRepo = new UserRepo(dispatch);
      const signInUseCase = new SignInUserUseCase(userRepo);
      const response = await signInUseCase.run(formData);

      if (response && response.status !== 500) {

        Cookies.set("user_session", JSON.stringify(response), {
          expires: 10,
          path: "/"
        });

        dispatch(setUser(response));
        router.push("/home");
      } else {
        toast.error("El correo o contraseña son incorrectos");
      }

    } catch (error) {
      console.error("Error: ", error);
    }
  };

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
        <form className="my-4 w-100" onSubmit={onSubmit}>
          <div className="form-container pb-3">
            <label htmlFor="username" className="form-label-login">
              Nombre de usuario *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              required
              placeholder="Ingresa tu email"
              className="form-input-styled"
            ></input>
          </div>
          {/* <p className="text-end m-0 label-pass">¿Olvidó su contraseña?</p> */}
          <div className="form-container pb-3">
            <label htmlFor="contraseña" className="form-label-login">
              Contraseña *
            </label>
            <input
              type={isShowPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              placeholder="Ingresa tu contraseña"
              className="form-input-styled"
            ></input>
            <span onClick={togglePasswordVisibility} className="pass-icons">
              {isShowPassword ? <FiEyeOff /> : <FiEye />}
            </span>
          </div>
          {/* <div className="form-check">
            <input type="checkbox" id="check" className="form-check-input"></input>
            <label className="form-check-label" htmlFor="check">
              Recordarme la próxima vez
            </label>
          </div> */}
          <button type="submit" className="button-login">Inicio de sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
