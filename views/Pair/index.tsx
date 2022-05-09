import { useQuery } from "@apollo/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import { getKashiPairQuery } from "../../graphql/pair";
import { KashiPair } from "../../types/KashiPair";
import {
  KashiPairDayData,
  KashiPairDayDataMap,
} from "../../types/KashiPairDayData";
import BaseLayout from "../Layouts/BaseLayout";
import Hero from "./Hero";
import Market from "./Market";

const Pair: NextPage = () => {
  const [kashiPair, setKashiPair] = useState<KashiPair | undefined>();
  const [kashiPairDayData, setKashiPairDayData] = useState<
    KashiPairDayDataMap[]
  >([]);
  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({});
  const { calculateService, coinGeckoService } = useAppContext();

  const router = useRouter();
  const { id } = router.query;
  const {
    loading: loadingKashiPairs,
    error,
    data: dataKashiPairs,
  } = useQuery(getKashiPairQuery, { variables: { id }, skip: !id });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (dataKashiPairs) {
      setKashiPairData();
    }
  }, [dataKashiPairs]);

  const setKashiPairData = async () => {
    const {
      kashiPairs,
      kashiPairDayDatas,
    }: { kashiPairs: KashiPair[]; kashiPairDayDatas: KashiPairDayData[] } =
      dataKashiPairs;
    const symbols = calculateService.extractKashiPairAssetSymbols(kashiPairs);
    const pricesMap = await coinGeckoService.getPrices(symbols);
    setPricesMap(pricesMap);

    const { kashiPairs: newKashiPairs } =
      calculateService.calculateKashiPairPrices(kashiPairs, pricesMap);

    const kashiPair = newKashiPairs[0];
    setKashiPair(kashiPair);

    const { kashiPairsMaps: kashiPairsMap } = calculateService.calculateKashiPairDayDataPrices(
      kashiPairDayDatas,
      pricesMap
    );
    console.log(dataKashiPairs)
    setKashiPairDayData(kashiPairsMap);
  };

  return (
    <>
      <Head>
        <title>
          {kashiPair
            ? `Kashi Market - ${kashiPair?.asset?.symbol}/${kashiPair?.collateral?.symbol}`
            : "Kashi Market"}
        </title>
      </Head>
      <BaseLayout>
        <Hero data={kashiPair} />
        <Market kashiPair={kashiPair} kashiPairDayData={kashiPairDayData} />
      </BaseLayout>
    </>
  );
};

export default Pair;
