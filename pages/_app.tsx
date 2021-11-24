import { Head } from "next/document";
import React from "react";
import "../styles/globals.scss";

function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default App;
