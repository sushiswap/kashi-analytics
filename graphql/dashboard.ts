import { gql } from "@apollo/client";

export const getKashiPairsQuery = gql`
  query GetPairs {
    bentoBoxes {
      totalTokens
      totalKashiPairs
      totalUsers
    }
    kashiPairs(first: 1000, orderBy: totalAssetElastic, orderDirection: desc) {
      id
      name
      symbol
      asset {
        id
        name
        symbol
        decimals
      }
      collateral {
        id
        name
        symbol
        decimals
      }
      exchangeRate
      totalAssetElastic
      totalAssetBase
      supplyAPR
      totalBorrowElastic
      totalBorrowBase
      borrowAPR
    }
  }
`;

export const getKashiPairsDayDataQuery = gql`
  query GetDataKashiPairsDayData($skip: Int) {
    kashiPairDayDatas(
      first: 1000
      skip: $skip
      orderBy: date
      orderDirection: desc
    ) {
      id
      date
      pair {
        id
        name
        symbol
        asset {
          id
          name
          symbol
          decimals
        }
        collateral {
          id
          name
          symbol
          decimals
        }
      }
      totalAssetBase
      totalAssetElastic
      totalBorrowBase
      totalBorrowElastic
    }
  }
`;
