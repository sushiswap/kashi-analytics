import type { NextPage } from "next";
import Head from "next/head";
import BaseLayout from "../Layouts/BaseLayout";
import Market from "./Market";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Kashi Market</title>
      </Head>
      <BaseLayout>
        <Market />
      </BaseLayout>
    </>
  );
};

export default Home;
