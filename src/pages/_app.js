import Layout from "@/layout";
import "@/styles/globals.css";
import Head from "next/head";
import "flatpickr/dist/flatpickr.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import "@/styles/sales_custom.css";
import "@/styles/login_custom.css";
import "@/styles/confirmation_custom.css";
import "@/styles/report_custom.css";
import "@/styles/disponibilidad.css";
import { useEffect } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";
import { Provider, useDispatch } from "react-redux";
import store from "@/store/store";
import { setUser } from "@/actions/userActions";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function LoadUserFromLocalStorage() {
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        dispatch(setUser(parsedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);
  return null;
}

export default function App({ Component, pageProps }) {
  const isOnline = useOnlineStatus();
  // console.log("Estado de conexión en _app:", isOnline);

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  // Escuchar mensajes del service worker (opcional)
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     const handleMessage = async (event) => {
  //       if (event.data?.type === "SYNC_BOOKINGS") {
  //         await sendOfflineBookingsToServer(); // Implementa esta función si no existe
  //       }
  //     };

  //     navigator.serviceWorker.addEventListener("message", handleMessage);

  //     return () => {
  //       navigator.serviceWorker.removeEventListener("message", handleMessage);
  //     };
  //   }
  // }, []);

  // 🔄 Forzar sincronización cuando vuelves a estar online
  useEffect(() => {
    if (isOnline && "serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          // console.log("🌐 Conexión restaurada. Forzando sincronización...");
          registration.active.postMessage({ action: "force-sync-bookings" });
        }
      });
    }
  }, [isOnline]);

  return (
    <Provider store={store}>
      <div>
        <Head>
          <title>Paraíso Huatulco App</title>
          <meta name="description" content="Paraíso Huatulco App" />
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#fff" />
          <link rel="apple-touch-icon" href="/icon512_rounded.png" />
          <link rel="icon" href="/icon512_rounded.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <LoadUserFromLocalStorage/>
        <Layout>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            style={{ fontSize: "18px", fontFamily: "Plus Jakarta Sans", margin: 24 }}
          />
          <Component {...pageProps} />
        </Layout>
      </div>
    </Provider>
  );
}
