import { gql } from "@apollo/client";

export const DASHIBOARD = gql`
  query GetPairs {
    bentoBoxes {
      totalTokens
      totalKashiPairs
      totalUsers
    }
    kashiPairs(first: 1000, orderBy: totalAssetElastic, orderDirection: desc) {
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
