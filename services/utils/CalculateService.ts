import { BigNumber } from "ethers";
import moment from "moment";
import { KashiPair } from "../../types/KashiPair";
import {
  KashiPairDayData,
  KashiPairDayDataMap,
  KashiPairDayDataMapsCollateral,
} from "../../types/KashiPairDayData";
import { Token } from "../../types/Token";

class CalculateService {
  protected static instance: CalculateService;
  constructor() {}

  protected extractKashiPairTokenSymbols(
    kashiPairs: KashiPair[],
    tokenField: "asset" | "collateral" = "asset"
  ) {
    const symbols = [] as string[];

    kashiPairs.forEach((kashiPair) => {
      const symbol = kashiPair[tokenField]?.symbol || "";

      const index = symbols.indexOf(symbol);
      if (index === -1) {
        symbols.push(symbol);
      }
    });
    return symbols;
  }

  extractKashiPairSymbols(kashiPairs: KashiPair[]) {
    const symbols = [] as string[];

    kashiPairs.forEach((kashiPair) => {
      const symbolAsset = kashiPair.asset?.symbol || "";
      const symbolCollateral = kashiPair.collateral?.symbol || "";

      const indexAsset = symbols.indexOf(symbolAsset);
      if (indexAsset === -1) {
        symbols.push(symbolAsset);
      }

      const indexCollateral = symbols.indexOf(symbolCollateral);
      if (indexCollateral === -1) {
        symbols.push(symbolCollateral);
      }
    });
    return symbols;
  }

  extractKashiPairCollateralSymbols(kashiPairs: KashiPair[]) {
    return this.extractKashiPairTokenSymbols(kashiPairs, "collateral");
  }

  extractKashiPairAssetSymbols(kashiPairs: KashiPair[]) {
    return this.extractKashiPairTokenSymbols(kashiPairs, "asset");
  }

  extractTokenSymbols(tokens: Token[]) {
    const symbols = [] as string[];

    tokens.forEach((token) => {
      const symbol = token.symbol || "";
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
    let sumTotalAsset = BigNumber.from("0"),
      sumTotalBorrow = BigNumber.from("0");

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
      sumTotalAsset = sumTotalAsset.add(totalAsset);
      sumTotalBorrow = sumTotalBorrow.add(totalBorrow);
      const newKashiPair = {
        ...kashiPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      };
      return newKashiPair;
    });
    return {
      totalAsset: sumTotalAsset,
      totalBorrow: sumTotalBorrow,
      kashiPairs: newKashiPairs,
    };
  }

  calculateTokenPrices(tokens: Token[], pricesMap: { [key: string]: BigInt }) {
    let sumTotalSupply = BigNumber.from("0");

    const newTokens = tokens.map((token) => {
      let totalSupply = BigNumber.from("0");
      totalSupply = BigNumber.from(pricesMap[token.symbol])
        .mul(BigNumber.from(token.totalSupplyElastic))
        .div(BigNumber.from("10").pow(Number(token.decimals) + 6));
      sumTotalSupply = sumTotalSupply.add(totalSupply);
      const newToken = {
        ...token,
        price: pricesMap[token.symbol] || 0,
        totalSupply: totalSupply.toBigInt(),
      };
      return newToken;
    });
    return {
      totalSupply: sumTotalSupply,
      tokens: newTokens,
    };
  }

  calculateKashiPairDayDataPrices(
    kashiPairs: KashiPairDayData[],
    pricesMap: { [key: string]: BigInt }
  ) {
    const kashiPairsMaps: KashiPairDayDataMap[] = [];

    let sumTotalAsset = BigNumber.from("0"),
      sumTotalBorrow = BigNumber.from("0"),
      sumAvgExchangeRate = BigNumber.from("0"),
      sumAvgUtilization = BigNumber.from("0"),
      sumAvgInterestPerSecond = BigNumber.from("0");

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

      sumTotalAsset = sumTotalAsset.add(totalAsset);
      sumTotalBorrow = sumTotalBorrow.add(totalBorrow);
      sumAvgExchangeRate = sumAvgExchangeRate.add(
        BigNumber.from(kashiPair.avgExchangeRate)
      );
      sumAvgUtilization = sumAvgUtilization.add(
        BigNumber.from(kashiPair.avgUtilization)
      );
      sumAvgInterestPerSecond = sumAvgInterestPerSecond.add(
        BigNumber.from(kashiPair.avgInterestPerSecond)
      );

      const newKashiPair = {
        ...kashiPair,
        totalAsset: totalAsset.toBigInt(),
        totalBorrow: totalBorrow.toBigInt(),
      };

      const kashiPairDate = moment.unix(kashiPair.date).format("YYYY-MM-DD");
      const itemKashiPairMap = kashiPairsMaps.find(
        (kashiPairMap) => kashiPairMap.date === kashiPairDate
      );

      if (itemKashiPairMap) {
        itemKashiPairMap.totalAsset = BigNumber.from(
          itemKashiPairMap.totalAsset
        )
          .add(totalAsset)
          .toBigInt();
        itemKashiPairMap.totalBorrow = BigNumber.from(
          itemKashiPairMap.totalBorrow
        )
          .add(totalBorrow)
          .toBigInt();
        itemKashiPairMap.avgExchangeRate = BigNumber.from(
          itemKashiPairMap.avgExchangeRate
        )
          .add(BigNumber.from(kashiPair.avgExchangeRate))
          .toBigInt();
        itemKashiPairMap.avgUtilization = BigNumber.from(
          itemKashiPairMap.avgUtilization
        )
          .add(BigNumber.from(kashiPair.avgUtilization))
          .toBigInt();
        itemKashiPairMap.avgInterestPerSecond = BigNumber.from(
          itemKashiPairMap.avgInterestPerSecond
        )
          .add(BigNumber.from(kashiPair.avgInterestPerSecond))
          .toBigInt();
        itemKashiPairMap.kashiPairs.push(newKashiPair);
      } else {
        kashiPairsMaps.push({
          totalAsset: totalAsset.toBigInt(),
          totalBorrow: totalBorrow.toBigInt(),
          avgExchangeRate: kashiPair.avgExchangeRate || BigInt(0),
          avgUtilization: kashiPair.avgUtilization || BigInt(0),
          avgInterestPerSecond: kashiPair.avgInterestPerSecond || BigInt(0),
          date: kashiPairDate,
          kashiPairs: [newKashiPair],
        });
      }
      kashiPairsMaps.forEach((value) => {
        value.avgExchangeRate = BigNumber.from(value.avgExchangeRate)
          .div(BigNumber.from(value.kashiPairs.length))
          .toBigInt();
        value.avgUtilization = BigNumber.from(value.avgUtilization)
          .div(BigNumber.from(value.kashiPairs.length))
          .toBigInt();
        value.avgInterestPerSecond = BigNumber.from(value.avgInterestPerSecond)
          .div(BigNumber.from(value.kashiPairs.length))
          .toBigInt();
      });
      kashiPairsMaps.sort((a, b) => a.date.localeCompare(b.date));
      return newKashiPair;
    });

    return {
      totalAsset: sumTotalAsset.toBigInt(),
      totalBorrow: sumTotalBorrow.toBigInt(),
      kashiPairs: newKashiPairs,
      kashiPairsMaps,
    };
  }

  calculateKashiPairDayDataPricesByCollateral(
    kashiPairs: KashiPairDayData[],
    pricesMap: { [key: string]: BigInt }
  ): KashiPairDayDataMapsCollateral[] {
    const kashiPairsMapGroupTemp: {
      [key: string]: { kashiPairs: KashiPairDayData[]; collateral: Token };
    } = {};
    kashiPairs.forEach((kashiPair) => {
      const { collateral } = kashiPair.pair;
      if (collateral && collateral.id) {
        if (kashiPairsMapGroupTemp[collateral.id]) {
          kashiPairsMapGroupTemp[collateral.id].kashiPairs.push(kashiPair);
        } else {
          kashiPairsMapGroupTemp[collateral.id] = {
            collateral,
            kashiPairs: [kashiPair],
          };
        }
      }
    });
    const kashiPairsMapGroup = Object.values(kashiPairsMapGroupTemp);

    const kashiPairsMapCollateralGroup = kashiPairsMapGroup.map((value) => {
      const { kashiPairsMaps } = this.calculateKashiPairDayDataPrices(
        value.kashiPairs,
        pricesMap
      );
      return {
        collateral: value.collateral,
        kashiPairsMaps,
      };
    });

    return kashiPairsMapCollateralGroup.sort((a, b) =>
      a.collateral.symbol.localeCompare(b.collateral.symbol)
    );
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
