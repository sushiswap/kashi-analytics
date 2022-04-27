import { ReactNode } from "react";
import Footer from "../../sections/Footer";
import Header from "../../sections/Header";

const BaseLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default BaseLayout;
