import { KashiPair } from "./KashiPair";

export type KashiPairDayData = {
  id: string;
  date: number;
  pair: KashiPair;
  totalAsset?: BigInt;
  totalAssetElastic?: BigInt;
  totalAssetBase?: BigInt;
  totalCollateralShare?: BigInt;
  totalBorrow?: BigInt;
  totalBorrowElastic?: BigInt;
  totalBorrowBase?: BigInt;
  avgExchangeRate?: BigInt;
  avgUtilization?: BigInt;
  avgInterestPerSecond?: BigInt;
};

export type KashiPairDayDataMap = {
  totalAssets: BigInt;
  totalBorrows: BigInt;
  date: string;
  kashiPairs: KashiPairDayData[];
};
