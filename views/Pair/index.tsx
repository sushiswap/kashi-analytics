import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import BaseLayout from "../Layouts/BaseLayout";

const Pair: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  return (
    <>
      <Head>
        <title>Kashi Market Pair</title>
      </Head>
      <BaseLayout></BaseLayout>
    </>
  );
};

export default Pair;
