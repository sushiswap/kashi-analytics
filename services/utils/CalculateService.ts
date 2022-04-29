import { BigNumber } from "ethers";
import { KashiPair } from "../../types/KashiPair";
import {
  KashiPairDayData,
  KashiPairDayDataMap,
} from "../../types/KashiPairDayData";
import moment from "moment";

class CalculateService {
  protected static instance: CalculateService;
  constructor() {}

  extractAssetSymbols(kashiPairs: KashiPair[]) {
    const symbols = [] as string[];

    kashiPairs.forEach((kashiPair) => {
      const symbol = kashiPair.asset?.symbol || "";
      const index = symbols.indexOf(symbol);
      if (index === -1) {
        symbols.push(symbol);
      }
    });
    return symbols;
  }

  calculateKashiPairPrices(
    kashiPairs: KashiPair[],
    pricesMap: { [key: string]: BigInt }
  ) {
    let totalAssetsValue = BigNumber.from("0"),
      totalBorrowsValue = BigNumber.from("0");

    const newKashiPairs = kashiPairs.map((kashiPair) => {
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
    return {
      totalAssets: totalAssetsValue,
      totalBorrows: totalBorrowsValue,
      kashiPairs: newKashiPairs,
    };
  }

  calculateKashiPairDayDataPrices(
    kashiPairs: KashiPairDayData[],
    pricesMap: { [key: string]: BigInt }
  ) {
    const kashiPairsMap: KashiPairDayDataMap[] = [];

    let totalAssetsValue = BigNumber.from("0"),
      totalBorrowsValue = BigNumber.from("0");

    const newKashiPairs = kashiPairs.map((kashiPair) => {
      let totalAsset = BigNumber.from("0"),
        totalBorrow = BigNumber.from("0");

      if (kashiPair.pair.asset) {
        totalAsset = BigNumber.from(pricesMap[kashiPair.pair.asset.symbol])
          .mul(BigNumber.from(kashiPair.totalAssetElastic))
          .div(
            BigNumber.from("10").pow(Number(kashiPair.pair.asset.decimals) + 6)
          );
        totalBorrow = BigNumber.from(pricesMap[kashiPair.pair.asset.symbol])
          .mul(BigNumber.from(kashiPair.totalBorrowElastic))
          .div(
            BigNumber.from("10").pow(Number(kashiPair.pair.asset.decimals) + 6)
          );
      }

      totalAssetsValue = totalAssetsValue.add(totalAsset);
      totalBorrowsValue = totalBorrowsValue.add(totalBorrow);
      const newKashiPair = {
        ...kashiPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      };

      const kashiPairDate = moment.unix(kashiPair.date).format("YYYY-MM-DD");
      const itemKashiPairMap = kashiPairsMap.find(
        (kashiPairMap) => kashiPairMap.date === kashiPairDate
      );

      if (itemKashiPairMap) {
        itemKashiPairMap.totalAssets = BigNumber.from(
          itemKashiPairMap.totalAssets
        )
          .add(totalAsset)
          .toBigInt();
        itemKashiPairMap.totalBorrows = BigNumber.from(
          itemKashiPairMap.totalBorrows
        )
          .add(totalBorrow)
          .toBigInt();
        itemKashiPairMap.kashiPairs.push(newKashiPair);
      } else {
        kashiPairsMap.push({
          totalAssets: totalAsset.toBigInt(),
          totalBorrows: totalBorrow.toBigInt(),
          date: kashiPairDate,
          kashiPairs: [newKashiPair],
        });
      }
      kashiPairsMap.sort((a, b) => a.date.localeCompare(b.date));
      return newKashiPair;
    });

    return {
      totalAssets: totalAssetsValue.toBigInt(),
      totalBorrows: totalBorrowsValue.toBigInt(),
      kashiPairs: newKashiPairs,
      kashiPairsMap,
    };
  }

  static getInstance() {
    if (CalculateService.instance) {
      return CalculateService.instance;
    }
    CalculateService.instance = new CalculateService();
    return CalculateService.instance;
  }
}

export default CalculateService;
