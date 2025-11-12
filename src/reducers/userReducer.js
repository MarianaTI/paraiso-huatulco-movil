import Cookies from "js-cookie";

const isBrowser = typeof window !== "undefined";

const getUserFromCookie = () => {
  if (!isBrowser) return null;
  const cookie = Cookies.get("user_session");
  return cookie ? JSON.parse(cookie) : null;
};

const userFromCookie = getUserFromCookie();

const initialState = {
  _id: userFromCookie?._id || null,
  nombre_comercial: userFromCookie?.nombre_comercial || null,
  rol: userFromCookie?.rol || null,
  correo: userFromCookie?.correo || null,
  cuenta: userFromCookie?.cuenta || null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      const newState = {
        ...state,
        ...action.payload,
      };

      Cookies.set("user_session", JSON.stringify(newState), {
        expires: 10, // 10 días
        path: "/",
      });

      return newState;

    default:
      return state;
  }
};

export default userReducer;
