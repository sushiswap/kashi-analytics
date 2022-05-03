import { gql } from "@apollo/client";

export const getTokensQuery = gql`
  query GetTokens {
    tokens(
      first: 1000
      orderBy: totalSupplyElastic
      where: { totalSupplyElastic_gt: "0" }
      orderDirection: desc
    ) {
      id
      name
      symbol
      decimals
      totalSupplyElastic
      totalSupplyBase
      block
      timestamp
    }
  }
`;
