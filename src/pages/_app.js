import Layout from "@/layout";
import "@/styles/globals.css";
import Head from "next/head";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'; 
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

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
