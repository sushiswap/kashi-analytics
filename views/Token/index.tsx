import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import { getTokensQuery } from "../../graphql/token";
import { KashiPair } from "../../types/KashiPair";
import {
  KashiPairDayData,
  KashiPairDayDataMap,
  KashiPairDayDataMapCollateral,
} from "../../types/KashiPairDayData";
import { Token } from "../../types/Token";
import BaseLayout from "../Layouts/BaseLayout";
import Hero from "./Hero";
import Market from "./Market";

const Token: NextPage = () => {
  const [token, setToken] = useState<Token | undefined>();
  const [totalAsset, setTotalAsset] = useState<BigInt>(BigInt(0));
  const [totalBorrow, setTotalBorrow] = useState<BigInt>(BigInt(0));

  const [kashiPairs, setKashiPairs] = useState<KashiPair[]>([]);
  const [kashiPairDayData, setKashiPairDayData] = useState<
    KashiPairDayDataMapCollateral[]
  >([]);
  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({});
  const { calculateService, coinGeckoService } = useAppContext();

  const router = useRouter();
  const { id } = router.query;
  const {
    // loading: loadingDataToken,
    error,
    data: dataToken,
  } = useQuery(getTokensQuery, { variables: { id }, skip: !id });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (dataToken) {
      setTokenData();
    }
  }, [dataToken]);

  const setTokenData = async () => {
    const { tokens, kashiPairs }: { tokens: Token[]; kashiPairs: KashiPair[] } =
      dataToken;
    const symbols = calculateService.extractKashiPairAssetSymbols(kashiPairs);
    const pricesMap = await coinGeckoService.getPrices(symbols);
    setPricesMap(pricesMap);

    const { tokens: newTokens } = calculateService.calculateTokenPrices(
      tokens,
      pricesMap
    );

    const token = newTokens[0];
    setToken(token);

    const {
      kashiPairs: newKashiPairs,
      totalAsset,
      totalBorrow,
    } = calculateService.calculateKashiPairPrices(kashiPairs, pricesMap);

    setTotalAsset(totalAsset.toBigInt());
    setTotalBorrow(totalBorrow.toBigInt());
    setKashiPairs(newKashiPairs);
  };

  return (
    <>
      <Head>
        <title>
          {token ? `Kashi Market - ${token?.symbol}` : "Kashi Market"}
        </title>
      </Head>
      <BaseLayout>
        <Hero data={token} />
        <Market
          token={token}
          totalAsset={totalAsset}
          totalBorrow={totalBorrow}
          kashiPairs={kashiPairs}
        />
      </BaseLayout>
    </>
  );
};

export default Token;
