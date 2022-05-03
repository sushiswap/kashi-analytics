import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TokenMarketTable from "../../components/module/Tables/TokenMarketTable";
import { useAppContext } from "../../context/AppContext";
import { getTokensQuery } from "../../graphql/explore";
import { Token } from "../../types/Token";
import BaseLayout from "../Layouts/BaseLayout";
import Hero from "./Hero";
import Market from "./Market";

const Home: NextPage = () => {
  const {
    loading: loadingToken,
    error,
    data: dataTokens,
  } = useQuery(getTokensQuery);
  const [calculating, setCalculating] = useState(true);
  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({});
  const [tokens, setTokens] = useState<Token[]>([] as Token[]);
  const { coinGeckoService, calculateService } = useAppContext();
  const loading = loadingToken || calculating;

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (dataTokens) {
      if (dataTokens.tokens) {
        setDataTokens();
      }
    }
  }, [dataTokens]);

  const setDataTokens = async () => {
    const { tokens } = dataTokens;
    const symbols = calculateService.extractTokenSymbols(tokens);
    const pricesMap = await coinGeckoService.getPrices(symbols);
    setPricesMap(pricesMap);

    const { tokens: newTokens } = calculateService.calculateTokenPrices(
      tokens,
      pricesMap
    );
    setCalculating(false);
    setTokens(
      newTokens
        .filter((token) => token.totalSupply > 0)
        .sort((a, b) => (a.totalSupply > b.totalSupply ? -1 : 1))
    );
  };

  return (
    <>
      <Head>
        <title>Kashi Market - Explore</title>
      </Head>
      <BaseLayout>
        <Hero />
        <Market data={tokens} loading={loading} />
      </BaseLayout>
    </>
  );
};

export default Home;
