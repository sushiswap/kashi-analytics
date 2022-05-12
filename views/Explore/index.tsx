import { useQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";
import { getKashiPairsQuery } from "../../graphql/explore";
import { KashiPairsByToken } from "../../types/KashiPair";
import BaseLayout from "../Layouts/BaseLayout";
import Hero from "./Hero";
import Market from "./Market";
import Total from "./Total";

const Home: NextPage = () => {
  const {
    loading: loadingToken,
    error,
    data: dataKashiPairs,
  } = useQuery(getKashiPairsQuery);
  const [calculating, setCalculating] = useState(true);
  const [totalAsset, setTotalAsset] = useState(BigInt(0));
  const [totalBorrow, setTotalBorrow] = useState(BigInt(0));
  const [top3MarketsBySupply, setTop3MarketsBySupply] = useState<
    KashiPairsByToken[]
  >([]);
  const [top3MarketsByAsset, setTop3MarketsByAsset] = useState<
    KashiPairsByToken[]
  >([]);
  const [top3MarketsByBorrow, setTop3MarketsByBorrow] = useState<
    KashiPairsByToken[]
  >([]);

  const [pricesMap, setPricesMap] = useState<{ [key: string]: BigInt }>({});
  const [kashiPairsByTokens, setKashiPairsByTokens] = useState<
    KashiPairsByToken[]
  >([]);
  const { coinGeckoService, calculateService } = useAppContext();
  const loading = loadingToken || calculating;

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (dataKashiPairs) {
      if (dataKashiPairs.kashiPairs) {
        setDataKashiPairs();
      }
    }
  }, [dataKashiPairs]);

  const setDataKashiPairs = async () => {
    const { kashiPairs } = dataKashiPairs;
    const symbols = calculateService.extractKashiPairAssetSymbols(kashiPairs);
    const pricesMap = await coinGeckoService.getPrices(symbols);
    setPricesMap(pricesMap);

    const { kashiPairsByTokens, totalAsset, totalBorrow } =
      calculateService.calculateKashiPairPricesGroupByAsset(
        kashiPairs,
        pricesMap
      );
    setCalculating(false);
    kashiPairsByTokens.sort((a, b) =>
      BigNumber.from(a.totalAsset)
        .add(BigNumber.from(a.totalBorrow))
        .gte(BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow)))
        ? -1
        : 1
    );

    const kashiPairsByTokensSortedByAsset = [...kashiPairsByTokens].sort(
      (a, b) => (a.totalAsset > b.totalAsset ? -1 : 1)
    );

    const kashiPairsByTokensSortedByBorrow = [...kashiPairsByTokens].sort(
      (a, b) => (a.totalBorrow > b.totalBorrow ? -1 : 1)
    );

    setTop3MarketsBySupply(
      kashiPairsByTokens.slice(
        0,
        kashiPairsByTokens.length < 3 ? kashiPairsByTokens.length : 3
      )
    );
    setTop3MarketsByAsset(
      kashiPairsByTokensSortedByAsset.slice(
        0,
        kashiPairsByTokensSortedByAsset.length < 3
          ? kashiPairsByTokensSortedByAsset.length
          : 3
      )
    );
    setTop3MarketsByBorrow(
      kashiPairsByTokensSortedByBorrow.slice(
        0,
        kashiPairsByTokensSortedByBorrow.length < 3
          ? kashiPairsByTokensSortedByBorrow.length
          : 3
      )
    );

    setKashiPairsByTokens(kashiPairsByTokens);
    setTotalAsset(totalAsset.toBigInt());
    setTotalBorrow(totalBorrow.toBigInt());
  };

  return (
    <>
      <Head>
        <title>Kashi Market - Explore</title>
      </Head>
      <BaseLayout>
        <Hero />
        <Total
          loading={loading}
          supply={{
            amount: totalAsset + totalBorrow,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt(0),
            topMarkets: top3MarketsBySupply,
          }}
          asset={{
            amount: totalAsset,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt(0),
            topMarkets: top3MarketsByAsset,
          }}
          borrow={{
            amount: totalBorrow,
            volumeIn24H: BigInt(0),
            totalUsers: BigInt(0),
            topMarkets: top3MarketsByBorrow,
          }}
        />
        <Market data={kashiPairsByTokens} loading={loading} />
      </BaseLayout>
    </>
  );
};

export default Home;
