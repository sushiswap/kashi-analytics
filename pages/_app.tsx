import axios from "axios";
import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApolloContextProvider } from "../context/ApolloContext";
import { AppContextProvider } from "../context/AppContext";
import "../styles/globals.scss";

axios.defaults.baseURL = "https://api.example.com";
axios.defaults.headers.post["Content-Type"] = "application/json";

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
