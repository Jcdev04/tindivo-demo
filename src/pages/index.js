import Head from "next/head";
import App from "@/components/App";

export default function Home() {
  return (
    <>
      <Head>
        <title>Tindivo · Priamo — Delivery & Pickups</title>
        <meta name="description" content="Pide en minutos, paga al recibir o por Yape. Delivery en San Jacinto, Áncash." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <App />
    </>
  );
}
