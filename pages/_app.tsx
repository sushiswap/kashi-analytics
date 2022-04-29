import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApolloContextProvider } from "../context/ApolloContext";
import { AppContextProvider } from "../context/AppContext";
import "../styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContextProvider>
      <ApolloContextProvider>
        <Component {...pageProps} />
      </ApolloContextProvider>
      <ToastContainer />
    </AppContextProvider>
  );
}

export default MyApp;
