import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
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
      <div>
        <Component {...pageProps} />
      </div>
    </>
  );
}
