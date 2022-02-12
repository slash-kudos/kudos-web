import type { AppProps } from "next/app";
import Script from "next/script";
import Layout from "../components/layout";
import "../styles/globals.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

library.add(faTwitter);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        src="https://kit.fontawesome.com/161043dfbb.js"
        crossOrigin="anonymous"
      ></Script>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
