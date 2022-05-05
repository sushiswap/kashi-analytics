/* eslint-disable @next/next/no-img-element */
import { BigNumber } from "ethers";
import Link from "next/link";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroller";
import { useAppContext } from "../../../context/AppContext";
import { Token } from "../../../types/Token";

type OrderBy = "symbol" | "totalSupply" | "";
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
    <div className="w-full grid grid-cols-3 px-8 py-2 text-sm text-slate-400">
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
    </div>
  );
};

const MarketTableRowLoading = () => (
  <div className="w-full grid grid-cols-3 px-8 py-3 border-l-2 border-transparent border-t border-t-gray-200 hover:border-l-emerald-400 cursor-pointer items-center">
    <div className="col-span-1 items-center flex">
      <div>
        <div className="inline-block loading h-8 w-8 rounded-full"></div>
      </div>
      <div className="ml-2">
        <div>
          <div className="inline-block loading h-5 w-24 rounded"></div>
        </div>
      </div>
    </div>
    <div className="col-span-2 text-right">
      <div>
        <div className="inline-block loading h-5 w-32 rounded"></div>
      </div>
      <div>
        <div className="inline-block loading h-4 w-28 rounded"></div>
      </div>
    </div>
  </div>
);

const MarketTableRow = ({ data, index }: { data: Token; index: number }) => {
  const handleLogoError = (event: React.SyntheticEvent) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "/icon-quiz.jpg";
  };
  const { tokenUtilService } = useAppContext();
  return (
    <Link href={`/token/${data.id}`}>
      <a className="w-full grid grid-cols-3 px-8 py-3 border-l-2 border-transparent border-t border-t-gray-200 hover:border-l-emerald-400 cursor-pointer items-center">
        <div className="col-span-1 items-center flex">
          <div>
            <img
              src={tokenUtilService.logo(data.symbol)}
              width="30px"
              height="30px"
              className="inline-block rounded-full"
              onError={handleLogoError}
              alt={data.symbol}
            />
          </div>
          <div className="ml-2">
            <div>{tokenUtilService.symbol(data.symbol)}</div>
          </div>
        </div>
        <div className="col-span-2 text-right">
          <div>
            {numeral(BigNumber.from(data.totalSupply).toNumber() / 100).format(
              "$0,.00"
            )}
          </div>
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
  data: Token[];
}) => {
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("desc");

  const [fullList, setFullList] = useState<Token[]>([]);
  const [sortedList, setSortedList] = useState<Token[]>([]);
  const [list, setList] = useState<Token[]>([]);
  const [isMore, setMore] = useState(false);

  useEffect(() => {
    setFullList(data);
  }, [data]);

  useEffect(() => {
    let newSortedList = [...fullList];
    const compareFuncs = {
      symbol: {
        asc: (a: Token, b: Token) =>
          (a.symbol.toLowerCase() || "").localeCompare(
            b.symbol.toLowerCase() || ""
          ),
        desc: (a: Token, b: Token) =>
          (b.symbol.toLowerCase() || "").localeCompare(
            a.symbol.toLowerCase() || ""
          ),
      },
      totalSupply: {
        asc: (a: Token, b: Token) =>
          BigNumber.from(a.totalSupply).lte(BigNumber.from(b.totalSupply))
            ? -1
            : 1,
        desc: (a: Token, b: Token) =>
          BigNumber.from(a.totalSupply).gte(BigNumber.from(b.totalSupply))
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
    <div className="border rounded shadow-md bg-white">
      <h3 className="px-8 py-4 border-b font-semibold">{title}</h3>
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
  );
};
export default TokenMarketTable;
