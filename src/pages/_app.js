import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Paraíso Huatulco App</title>
        <meta name="description" content="Paraíso Huatulco" />
        <meta name="theme-color" content="#fcd847" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
