import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { ReactNode } from "react";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/sushiswap/bentobox",
  cache: new InMemoryCache(),
});

export const ApolloContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};