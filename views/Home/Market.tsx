import { useQuery } from "@apollo/client";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import TotalCard from "../../components/module/Cards/TotalCard";
import MarketTable from "../../components/module/Tables/MarketTable";
import { useCoingeckoService } from "../../context/AppContext";
import { DASHIBOARD } from "../../graphql/dashboard";
import { BentoBox } from "../../types/BentoBox";
import { KashiPair } from "../../types/KashiPair";

const Market = () => {
  const { loading, error, data } = useQuery(DASHIBOARD);
  const [calculating, setCalculating] = useState(true);
  const [bentoBox, setBentoBox] = useState<BentoBox>({} as BentoBox);
  const [kashiPairs, setKashiPairs] = useState<KashiPair[]>([] as KashiPair[]);
  const chainLinkService = useCoingeckoService();

  const [totalAssetsAmount, setTotalAssetsAmount] = useState(BigInt(0));
  const [totalBorrowsAmount, setTotalBorrowsAmount] = useState(BigInt(0));

  const [top3MarketsByAsset, setTop3MarketsByAsset] = useState<KashiPair[]>([]);
  const [top3MarketsByBorrow, setTop3MarketsByBorrow] = useState<KashiPair[]>(
    []
  );

  useEffect(() => {
    if (data) {
      if (data.bentoBoxes && data.bentoBoxes.length > 0) {
        setBentoBox(data.bentoBoxes[0]);
      }
      if (data.kashiPairs) {
        setKashiPairsData(data.kashiPairs);
      }
    }
  }, [data]);

  const setKashiPairsData = async (dataKashiPairs: KashiPair[]) => {
    const symbols = [] as string[];
    const map = {} as any;
    dataKashiPairs.forEach((kashiPair) => {
      const symbol = kashiPair.asset?.symbol || "";
      const index = symbols.indexOf(symbol);
      if (index === -1) {
        symbols.push(symbol);
        map[symbol] = kashiPair.asset?.name;
      }
    });

    const pricesMap = await chainLinkService.getPrices(symbols);
    let totalAssetsValue = BigNumber.from("0"),
      totalBorrowsValue = BigNumber.from("0");

    const newKashiPairs = dataKashiPairs.map((kashiPair) => {
      let totalAsset = BigNumber.from("0"),
        totalBorrow = BigNumber.from("0");

      if (kashiPair.asset) {
        totalAsset = BigNumber.from(pricesMap[kashiPair.asset.symbol])
          .mul(BigNumber.from(kashiPair.totalAssetElastic))
          .div(BigNumber.from("10").pow(Number(kashiPair.asset.decimals) + 6));
        totalBorrow = BigNumber.from(pricesMap[kashiPair.asset.symbol])
          .mul(BigNumber.from(kashiPair.totalBorrowElastic))
          .div(BigNumber.from("10").pow(Number(kashiPair.asset.decimals) + 6));
      }
      totalAssetsValue = totalAssetsValue.add(totalAsset);
      totalBorrowsValue = totalBorrowsValue.add(totalBorrow);
      const newKashiPair = {
        ...kashiPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      };
      return newKashiPair;
    });

    const sortedKashiPairsByAsset = [...newKashiPairs].sort(
      (a: KashiPair, b: KashiPair) => {
        return BigNumber.from(a.totalAsset).lte(BigNumber.from(b.totalAsset))
          ? 1
          : -1;
      }
    );

    const sortedKashiPairsByBorrow = [...newKashiPairs].sort(
      (a: KashiPair, b: KashiPair) => {
        return BigNumber.from(a.totalBorrow).lte(BigNumber.from(b.totalBorrow))
          ? 1
          : -1;
      }
    );

    setCalculating(false);

    setTotalAssetsAmount(totalAssetsValue.toBigInt());
    setTotalBorrowsAmount(totalBorrowsValue.toBigInt());

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

  return (
    <>
      <div className="bg-black">
        <div className="max-w-5xl px-4 mx-auto py-24">
          <h2 className="text-white text-3xl font-medium">Market Overview</h2>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 -mt-16 gap-4 mb-4">
        <TotalCard
          loading={loading || calculating}
          borrow="supply"
          containerClass="col-span-1"
          data={{
            amount: totalAssetsAmount,
            volumeIn24H: BigInt(0),
            totalUsers: bentoBox.totalUsers || BigInt("0"),
            topMarkets: top3MarketsByAsset,
          }}
        />
        <TotalCard
          loading={loading}
          containerClass="col-span-1"
          data={{
            amount: totalBorrowsAmount,
            volumeIn24H: BigInt(0),
            totalUsers: bentoBox.totalUsers || BigInt("0"),
            topMarkets: top3MarketsByBorrow,
          }}
        />
      </div>
      <div className="mb-24 max-w-5xl mx-auto px-4">
        <MarketTable
          title={"All Markets"}
          loading={loading || calculating}
          data={kashiPairs}
        />
      </div>
    </>
  );
};

export default Market;
