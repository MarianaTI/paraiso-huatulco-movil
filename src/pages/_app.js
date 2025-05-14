import Layout from "@/layout";
import "@/styles/globals.css";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'; 
import { useEffect } from "react";
import useOnlineStatus from "@/hooks/useOnlineStatus";

export default function App({ Component, pageProps }) {
  const isOnline = useOnlineStatus();
  console.log("Estado de conexión en _app:", isOnline);

  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  // Escuchar mensajes del service worker (opcional)
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener("message", async (event) => {
        if (event.data?.type === "SYNC_BOOKINGS") {
          console.log("🔁 Recibido mensaje para sincronizar reservas");
          await sendOfflineBookingsToServer(); // Si tienes esta función localmente
        }
      });
    }
  }, []);

  // 🔄 Forzar sincronización cuando vuelves a estar online
  useEffect(() => {
    if (isOnline && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        if (registration.active) {
          console.log("🌐 Conexión restaurada. Forzando sincronización...");
          registration.active.postMessage({ action: 'force-sync-bookings' });
        }
      });
    }
  }, [isOnline]);

  return (
    <>
      <Head>
        <title>Paraíso Huatulco App</title>
        <meta name="description" content="Paraíso Huatulco App" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#fff" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
        <link rel="icon" href="/icon512_rounded.png" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
