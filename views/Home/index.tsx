import { useApolloClient, useQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import {
  getKashiPairsDayDataQuery,
  getKashiPairsQuery,
} from "../../graphql/dashboard";
import { BentoBox } from "../../types/BentoBox";
import { KashiPair } from "../../types/KashiPair";
import {
  KashiPairDayData,
  KashiPairDayDataMap,
} from "../../types/KashiPairDayData";
import BaseLayout from "../Layouts/BaseLayout";
import Charts from "./Charts";
import Hero from "./Hero";
import Market from "./Market";
import Total from "./Total";

const Home: NextPage = () => {
  const {
    loading: loadingKashiPairs,
    error,
    data: dataKashiPairs,
  } = useQuery(getKashiPairsQuery);

  const {
    loading: loadingKashiPairsDayData0,
    error: errorKashiPairsDayData0,
    data: dataKashiPairsDayData0,
  } = useQuery(getKashiPairsDayDataQuery, { variables: { skip: 0 } });

  const {
    loading: loadingKashiPairsDayData1,
    error: errorKashiPairsDayData1,
    data: dataKashiPairsDayData1,
  } = useQuery(getKashiPairsDayDataQuery, { variables: { skip: 1000 } });

  const {
    loading: loadingKashiPairsDayData2,
    error: errorKashiPairsDayData2,
    data: dataKashiPairsDayData2,
  } = useQuery(getKashiPairsDayDataQuery, { variables: { skip: 2000 } });

  const {
    loading: loadingKashiPairsDayData3,
    error: errorKashiPairsDayData3,
    data: dataKashiPairsDayData3,
  } = useQuery(getKashiPairsDayDataQuery, { variables: { skip: 3000 } });

  const {
    loading: loadingKashiPairsDayData4,
    error: errorKashiPairsDayData4,
    data: dataKashiPairsDayData4,
  } = useQuery(getKashiPairsDayDataQuery, { variables: { skip: 4000 } });

  const {
    loading: loadingKashiPairsDayData5,
    error: errorKashiPairsDayData5,
    data: dataKashiPairsDayData5,
  } = useQuery(getKashiPairsDayDataQuery, { variables: { skip: 5000 } });

  const [kashiPairsDayData, setKashiPairsDayData] = useState<
    KashiPairDayDataMap[]
  >([]);

  const [calculating, setCalculating] = useState(true);
  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({});
  const [bentoBox, setBentoBox] = useState<BentoBox>({} as BentoBox);
  const [kashiPairs, setKashiPairs] = useState<KashiPair[]>([] as KashiPair[]);
  const { coinGeckoService, calculateService } = useAppContext();

  const [totalAssetsAmount, setTotalAssetsAmount] = useState(BigInt(0));
  const [totalBorrowsAmount, setTotalBorrowsAmount] = useState(BigInt(0));

  const [top3MarketsBySupply, setTop3MarketsBySupply] = useState<KashiPair[]>(
    []
  );
  const [top3MarketsByAsset, setTop3MarketsByAsset] = useState<KashiPair[]>([]);
  const [top3MarketsByBorrow, setTop3MarketsByBorrow] = useState<KashiPair[]>(
    []
  );

  const loading = calculating || loadingKashiPairs;
  const loadingDayData =
    loading ||
    loadingKashiPairsDayData0 ||
    loadingKashiPairsDayData1 ||
    loadingKashiPairsDayData2 ||
    loadingKashiPairsDayData3 ||
    loadingKashiPairsDayData4 ||
    loadingKashiPairsDayData5;

  useEffect(() => {
    if (dataKashiPairs) {
      if (dataKashiPairs.bentoBoxes && dataKashiPairs.bentoBoxes.length > 0) {
        setBentoBox(dataKashiPairs.bentoBoxes[0]);
      }
      if (dataKashiPairs.kashiPairs) {
        setKashiPairsData(dataKashiPairs.kashiPairs);
      }
    }
  }, [dataKashiPairs]);

  const setKashiPairsData = async (kashiPairsData: KashiPair[]) => {
    const symbols = calculateService.extractAssetSymbols(kashiPairsData);
    const pricesMap = await coinGeckoService.getPrices(symbols);
    setPricesMap(pricesMap);

    const {
      totalAsset: totalAssetsValue,
      totalBorrow: totalBorrowsValue,
      kashiPairs: newKashiPairs,
    } = calculateService.calculateKashiPairPrices(kashiPairsData, pricesMap);

    const sortedKashiPairsBySupply = [...newKashiPairs].sort(
      (a: KashiPair, b: KashiPair) =>
        BigNumber.from(a.totalAsset)
          .add(BigNumber.from(a.totalBorrow))
          .lte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
          ? 1
          : -1
    );

    const sortedKashiPairsByAsset = [...newKashiPairs].sort(
      (a: KashiPair, b: KashiPair) =>
        BigNumber.from(a.totalAsset).lte(BigNumber.from(b.totalAsset)) ? 1 : -1
    );

    const sortedKashiPairsByBorrow = [...newKashiPairs].sort(
      (a: KashiPair, b: KashiPair) =>
        BigNumber.from(a.totalBorrow).lte(BigNumber.from(b.totalBorrow))
          ? 1
          : -1
    );

    setCalculating(false);

    setTotalAssetsAmount(totalAssetsValue.toBigInt());
    setTotalBorrowsAmount(totalBorrowsValue.toBigInt());

    setTop3MarketsBySupply(sortedKashiPairsBySupply.slice(0, 3));
    setTop3MarketsByAsset(sortedKashiPairsByAsset.slice(0, 3));
    setTop3MarketsByBorrow(sortedKashiPairsByBorrow.slice(0, 3));

    setKashiPairs(newKashiPairs);
  };

  useEffect(() => {}, [kashiPairs]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (
      !loadingKashiPairs &&
      !calculating &&
      !loadingKashiPairsDayData0 &&
      !loadingKashiPairsDayData1 &&
      !loadingKashiPairsDayData2 &&
      !loadingKashiPairsDayData3 &&
      !loadingKashiPairsDayData4 &&
      !loadingKashiPairsDayData5
    ) {
      const dataKashiPairsDayDataMap = [
        dataKashiPairsDayData0,
        dataKashiPairsDayData1,
        dataKashiPairsDayData2,
        dataKashiPairsDayData3,
        dataKashiPairsDayData4,
        dataKashiPairsDayData5,
      ];

      const dataKashiPairsDayData = dataKashiPairsDayDataMap.reduce(
        (
          prev: KashiPairDayData[],
          current?: { kashiPairDayDatas?: KashiPairDayData[] }
        ) => [
          ...prev,
          ...(current && current.kashiPairDayDatas
            ? current.kashiPairDayDatas
            : []),
        ],
        []
      );
      const { kashiPairsMap } =
        calculateService.calculateKashiPairDayDataPrices(
          dataKashiPairsDayData,
          pricesMap
        );
      setKashiPairsDayData(kashiPairsMap);
    }
  }, [
    loadingKashiPairs,
    calculating,
    loadingKashiPairsDayData0,
    loadingKashiPairsDayData1,
    loadingKashiPairsDayData2,
    loadingKashiPairsDayData3,
    loadingKashiPairsDayData4,
    loadingKashiPairsDayData5,
  ]);

  return (
    <>
      <Head>
        <title>Kashi Market</title>
      </Head>
      <BaseLayout>
        <Hero />
        <Total
          loading={loading}
          supply={{
            amount: totalAssetsAmount + totalBorrowsAmount,
            volumeIn24H: BigInt(0),
            totalUsers: bentoBox.totalUsers || BigInt("0"),
            topMarkets: top3MarketsBySupply,
          }}
          asset={{
            amount: totalAssetsAmount,
            volumeIn24H: BigInt(0),
            totalUsers: bentoBox.totalUsers || BigInt("0"),
            topMarkets: top3MarketsByAsset,
          }}
          borrow={{
            amount: totalBorrowsAmount,
            volumeIn24H: BigInt(0),
            totalUsers: bentoBox.totalUsers || BigInt("0"),
            topMarkets: top3MarketsByBorrow,
          }}
        />
        <Charts data={kashiPairsDayData} loading={loadingDayData} />
        <Market data={kashiPairs} loading={loading || calculating} />
      </BaseLayout>
    </>
  );
};

export default Home;
