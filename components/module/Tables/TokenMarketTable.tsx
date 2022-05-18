/* eslint-disable @next/next/no-img-element */
import { BigNumber } from "ethers";
import Link from "next/link";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroller";
import { useAppContext } from "../../../context/AppContext";
import { KashiPairsByToken } from "../../../types/KashiPair";

type OrderBy = "symbol" | "totalSupply" | "totalAsset" | "totalBorrow" | "";
type OrderDirection = "asc" | "desc";

const MarketTableHead = ({
  onSort,
  orderBy,
  orderDirection,
}: {
  onSort: (orderBy: OrderBy) => void;
  orderBy: OrderBy;
  orderDirection: OrderDirection;
}) => {
  const iconByDirection = {
    asc: <FaSortUp className="inline-block" />,
    desc: <FaSortDown className="inline-block" />,
  };

  return (
    <div className="grid w-full grid-cols-7 px-8 py-2 text-sm text-slate-400">
      <div
        className="col-span-1 cursor-pointer"
        onClick={() => {
          onSort("symbol");
        }}
      >
        Token {orderBy === "symbol" && iconByDirection[orderDirection]}
      </div>
      <div
        className="col-span-2 text-right"
        onClick={() => {
          onSort("totalSupply");
        }}
      >
        <span className="cursor-pointer">
          Total Supply
          {orderBy === "totalSupply" && iconByDirection[orderDirection]}
        </span>
      </div>
      <div
        className="col-span-2 text-right"
        onClick={() => {
          onSort("totalAsset");
        }}
      >
        <span className="cursor-pointer">
          Total Available
          {orderBy === "totalAsset" && iconByDirection[orderDirection]}
        </span>
      </div>
      <div
        className="col-span-2 text-right"
        onClick={() => {
          onSort("totalBorrow");
        }}
      >
        <span className="cursor-pointer">
          Total Borrow
          {orderBy === "totalBorrow" && iconByDirection[orderDirection]}
        </span>
      </div>
    </div>
  );
};

const MarketTableRowLoading = () => (
  <div className="grid items-center w-full grid-cols-7 px-8 py-3 border-t border-l-2 border-transparent cursor-pointer border-t-gray-200 hover:border-l-primary1-400">
    <div className="flex items-center col-span-1">
      <div>
        <div className="inline-block w-8 h-8 rounded-full loading"></div>
      </div>
      <div className="ml-2">
        <div>
          <div className="inline-block w-24 h-5 rounded loading"></div>
        </div>
      </div>
    </div>
    <div className="col-span-2 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded loading"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded loading w-28"></div>
      </div>
    </div>
    <div className="col-span-2 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded loading"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded loading w-28"></div>
      </div>
    </div>
    <div className="col-span-2 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded loading"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded loading w-28"></div>
      </div>
    </div>
  </div>
);

const MarketTableRow = ({
  data,
  index,
}: {
  data: KashiPairsByToken;
  index: number;
}) => {
  const { tokenUtilService, handleLogoError } = useAppContext();
  return (
    <Link href={`/token/${data.token.id}`}>
      <a className="grid items-center w-full grid-cols-7 px-8 py-3 border-t border-l-2 border-transparent cursor-pointer border-t-gray-200 hover:border-l-primary1-400">
        <div className="flex items-center col-span-1">
          <div>
            <img
              src={tokenUtilService.logo(data.token.symbol)}
              width="30px"
              height="30px"
              className="inline-block rounded-full"
              onError={handleLogoError}
              alt={data.token.symbol}
            />
          </div>
          <div className="ml-2">
            <div>{tokenUtilService.symbol(data.token.symbol)}</div>
          </div>
        </div>
        <div className="col-span-2 text-right">
          {numeral(
            BigNumber.from(data.totalAsset)
              .add(BigNumber.from(data.totalBorrow))
              .toNumber() / 100
          ).format("$0,.00")}
        </div>
        <div className="col-span-2 text-right">
          {numeral(BigNumber.from(data.totalAsset).toNumber() / 100).format(
            "$0,.00"
          )}
        </div>
        <div className="col-span-2 text-right">
          {numeral(BigNumber.from(data.totalBorrow).toNumber() / 100).format(
            "$0,.00"
          )}
        </div>
      </a>
    </Link>
  );
};

const TokenMarketTable = ({
  title = "All Tokens",
  loading = false,
  data = [],
}: {
  title?: string;
  loading?: boolean;
  data: KashiPairsByToken[];
}) => {
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("desc");

  const [fullList, setFullList] = useState<KashiPairsByToken[]>([]);
  const [sortedList, setSortedList] = useState<KashiPairsByToken[]>([]);
  const [list, setList] = useState<KashiPairsByToken[]>([]);
  const [isMore, setMore] = useState(false);

  useEffect(() => {
    setFullList(data);
  }, [data]);

  useEffect(() => {
    let newSortedList = [...fullList];
    const compareFuncs = {
      symbol: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          (a.token.symbol.toLowerCase() || "").localeCompare(
            b.token.symbol.toLowerCase() || ""
          ),
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          (b.token.symbol.toLowerCase() || "").localeCompare(
            a.token.symbol.toLowerCase() || ""
          ),
      },
      totalSupply: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .lte(
              BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow))
            )
            ? -1
            : 1,
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .gte(
              BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow))
            )
            ? -1
            : 1,
      },
      totalAsset: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset).lte(BigNumber.from(b.totalAsset))
            ? -1
            : 1,
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalAsset).gte(BigNumber.from(b.totalAsset))
            ? -1
            : 1,
      },
      totalBorrow: {
        asc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalBorrow).lte(BigNumber.from(b.totalBorrow))
            ? -1
            : 1,
        desc: (a: KashiPairsByToken, b: KashiPairsByToken) =>
          BigNumber.from(a.totalBorrow).gte(BigNumber.from(b.totalBorrow))
            ? -1
            : 1,
      },
    };

    if (orderBy) {
      newSortedList.sort(compareFuncs[orderBy][orderDirection]);
    }
    setSortedList(newSortedList);
  }, [fullList, orderBy, orderDirection]);

  useEffect(() => {
    setList([]);
  }, [sortedList]);

  const handleLoadMore = () => {
    if (isMore) return;
    setMore(true);
    if (list.length < sortedList.length) {
      const start = list.length;
      const end = Math.min(start + 20, sortedList.length);
      const newList = [...list, ...sortedList.slice(start, end)];
      setList(newList);
    }
    setMore(false);
  };

  const handleSort = (orderField: OrderBy) => {
    if (orderBy === orderField) {
      setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
      return;
    }
    setOrderBy(orderField);
    setOrderDirection("desc");
  };

  return (
    <div className="overflow-x-auto">
      <div
        className="bg-white border rounded shadow-md"
        style={{ minWidth: "720px" }}
      >
        <h3 className="px-8 py-4 font-semibold border-b">{title}</h3>
        <MarketTableHead
          onSort={handleSort}
          orderBy={orderBy}
          orderDirection={orderDirection}
        />
        {loading ? (
          <>
            <MarketTableRowLoading />
            <MarketTableRowLoading />
            <MarketTableRowLoading />
            <MarketTableRowLoading />
          </>
        ) : (
          <InfiniteScroll
            loadMore={handleLoadMore}
            hasMore={list.length < data.length}
            useWindow
            threshold={10}
          >
            {list.map((data, index) => (
              <MarketTableRow key={`${index}`} data={data} index={index} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
};
export default TokenMarketTable;
