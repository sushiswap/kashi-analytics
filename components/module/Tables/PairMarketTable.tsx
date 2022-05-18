/* eslint-disable @next/next/no-img-element */
import { BigNumber } from "ethers";
import Link from "next/link";
import { useRouter } from "next/router";
import numeral from "numeral";
import React, { useEffect, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroller";
import { useAppContext } from "../../../context/AppContext";
import { KashiPair } from "../../../types/KashiPair";

type OrderBy =
  | "asset"
  | "collateral"
  | "totalSupply"
  | "totalAsset"
  | "supplyAPY"
  | "totalBorrow"
  | "borrowAPY"
  | "";
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
    <tr className="text-sm border-t text-slate-400">
      <td className="py-2 pl-8 pr-2">
        <span
          onClick={() => {
            onSort("asset");
          }}
          className="cursor-pointer"
        >
          Asset{orderBy === "asset" && iconByDirection[orderDirection]}
        </span>
        /
        <span
          onClick={() => {
            onSort("collateral");
          }}
          className="cursor-pointer"
        >
          Collateral
          {orderBy === "collateral" && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort("totalSupply");
        }}
      >
        <span className="cursor-pointer">
          Total Supply
          {orderBy === "totalSupply" && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort("totalAsset");
        }}
      >
        <span className="cursor-pointer">
          Total Available
          {orderBy === "totalAsset" && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort("supplyAPY");
        }}
      >
        <span className="cursor-pointer">
          Supply APY
          {orderBy === "supplyAPY" && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="p-2 text-right"
        onClick={() => {
          onSort("totalBorrow");
        }}
      >
        <span className="cursor-pointer">
          Total Borrow
          {orderBy === "totalBorrow" && iconByDirection[orderDirection]}
        </span>
      </td>
      <td
        className="py-2 pl-2 pr-8 text-right"
        onClick={() => {
          onSort("borrowAPY");
        }}
      >
        <span className="cursor-pointer">
          Borrow APY
          {orderBy === "borrowAPY" && iconByDirection[orderDirection]}
        </span>
      </td>
    </tr>
  );
};

const MarketTableRowLoading = () => (
  <tr className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-200 hover:border-l-primary1-400">
    <td className="py-3 pl-8 pr-2">
      <div className="md:flex">
        <div>
          <div className="inline-block w-8 h-8 rounded-full loading"></div>
          <div className="inline-block w-8 h-8 -ml-2 rounded-full loading"></div>
        </div>
        <div className="md:ml-2">
          <div>
            <div className="inline-block w-24 h-5 rounded loading"></div>
          </div>
          <div>
            <div className="inline-block w-12 h-4 rounded loading"></div>
          </div>
        </div>
      </div>
    </td>
    <td className="px-2 py-3 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded loading"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded loading w-28"></div>
      </div>
    </td>
    <td className="px-2 py-3 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded loading"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded loading w-28"></div>
      </div>
    </td>
    <td className="px-2 py-3 text-right">
      <div className="inline-block w-12 h-5 rounded loading"></div>
    </td>
    <td className="px-2 py-3 text-right">
      <div>
        <div className="inline-block w-32 h-5 rounded loading"></div>
      </div>
      <div>
        <div className="inline-block h-4 rounded loading w-28"></div>
      </div>
    </td>
    <td className="py-3 pl-2 pr-8 text-right">
      <div className="inline-block w-12 h-5 rounded loading"></div>
    </td>
  </tr>
);

const MarketTableRow = ({
  data,
  index,
}: {
  data: KashiPair;
  index: number;
}) => {
  const { tokenUtilService, handleLogoError } = useAppContext();
  const router = useRouter();
  const goto = (route: string) => {
    router.push(route);
  };

  return (
    <tr
      onClick={() => goto(`/pair/${data.id}`)}
      className="border-t border-l-2 border-transparent cursor-pointer border-t-gray-200 hover:border-l-primary1-400"
    >
      <td className="py-3 pl-8 pr-2">
        <div className="md:flex">
          <div className="flex">
            <img
              src={tokenUtilService.logo(data.asset?.symbol)}
              className="inline-block w-8 h-8 rounded-full"
              onError={handleLogoError}
              alt={data?.symbol}
            />
            <img
              src={tokenUtilService.logo(data.collateral?.symbol)}
              onError={handleLogoError}
              className="inline-block w-8 h-8 -ml-2 rounded-full"
              alt={data?.symbol}
            />
          </div>
          <div className="text-sm md:text-base md:ml-2">
            {tokenUtilService.pairSymbol(
              data.asset?.symbol,
              data.collateral?.symbol
            )}
          </div>
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <div>
          {numeral(
            BigNumber.from(data?.totalAsset)
              .add(BigNumber.from(data.totalBorrow))
              .toNumber() / 100
          ).format("$0,.00")}
        </div>
        <div className="text-xs text-gray-400">
          {numeral(
            BigNumber.from(data?.totalAssetElastic)
              .add(BigNumber.from(data.totalBorrowElastic))
              .div(
                BigNumber.from("10").pow(Number(data.asset?.decimals || 0) - 2)
              )
              .toNumber() / 100
          ).format("0,.00")}
          &nbsp;
          {data.asset?.symbol}
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        <div>
          {numeral(BigNumber.from(data?.totalAsset).toNumber() / 100).format(
            "$0,.00"
          )}
        </div>
        <div className="text-xs text-gray-400">
          {numeral(
            BigNumber.from(data?.totalAssetElastic)
              .div(
                BigNumber.from("10").pow(Number(data.asset?.decimals || 0) - 2)
              )
              .toNumber() / 100
          ).format("0,.00")}
          &nbsp;
          {data.asset?.symbol}
        </div>
      </td>
      <td className="px-2 py-3 text-right">
        {numeral(
          BigNumber.from(data?.supplyAPR)
            .div(BigNumber.from("1000000000000"))
            .toNumber() / 100000
        ).format("%0.00")}
      </td>
      <td className="px-2 py-3 text-right">
        <div>
          {numeral(BigNumber.from(data?.totalBorrow).toNumber() / 100).format(
            "$0,.00"
          )}
        </div>
        <div className="text-xs text-gray-400">
          {numeral(
            BigNumber.from(data?.totalBorrowElastic)
              .div(
                BigNumber.from("10").pow(Number(data.asset?.decimals || 0) - 2)
              )
              .toNumber() / 100
          ).format("0,.00")}
          &nbsp;
          {data.asset?.symbol}
        </div>
      </td>
      <td className="py-3 pl-2 pr-8 text-right">
        {numeral(
          BigNumber.from(data?.borrowAPR)
            .div(BigNumber.from("1000000000000"))
            .toNumber() / 100000
        ).format("%0.00")}
      </td>
    </tr>
  );
};

const PairMarketTable = ({
  title = "All Markets",
  loading = false,
  data = [],
}: {
  title: string;
  loading?: boolean;
  data: KashiPair[];
}) => {
  const [orderBy, setOrderBy] = useState<OrderBy>("");
  const [orderDirection, setOrderDirection] = useState<OrderDirection>("desc");

  const [fullList, setFullList] = useState<KashiPair[]>([]);
  const [sortedList, setSortedList] = useState<KashiPair[]>([]);
  const [list, setList] = useState<KashiPair[]>([]);
  const [isMore, setMore] = useState(false);

  useEffect(() => {
    setFullList(data);
  }, [data]);

  useEffect(() => {
    let newSortedList = [...fullList];
    const compareFuncs = {
      asset: {
        asc: (a: KashiPair, b: KashiPair) =>
          (a.asset?.symbol.toLowerCase() || "").localeCompare(
            b.asset?.symbol.toLowerCase() || ""
          ),
        desc: (a: KashiPair, b: KashiPair) =>
          (b.asset?.symbol.toLowerCase() || "").localeCompare(
            a.asset?.symbol.toLowerCase() || ""
          ),
      },
      collateral: {
        asc: (a: KashiPair, b: KashiPair) =>
          (a.collateral?.symbol.toLowerCase() || "").localeCompare(
            b.collateral?.symbol.toLowerCase() || ""
          ),
        desc: (a: KashiPair, b: KashiPair) =>
          (b.collateral?.symbol.toLowerCase() || "").localeCompare(
            a.collateral?.symbol.toLowerCase() || ""
          ),
      },
      totalSupply: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .lte(
              BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow))
            )
            ? -1
            : 1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalAsset)
            .add(BigNumber.from(a.totalBorrow))
            .gte(
              BigNumber.from(b.totalAsset).add(BigNumber.from(b.totalBorrow))
            )
            ? -1
            : 1,
      },
      totalAsset: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalAsset).lte(BigNumber.from(b.totalAsset))
            ? -1
            : 1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalAsset).gte(BigNumber.from(b.totalAsset))
            ? -1
            : 1,
      },
      totalBorrow: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalBorrow).lte(BigNumber.from(b.totalBorrow))
            ? 1
            : -1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.totalBorrow).gte(BigNumber.from(b.totalBorrow))
            ? -1
            : 1,
      },
      supplyAPY: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.supplyAPR).lte(BigNumber.from(b.supplyAPR)) ? -1 : 1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.supplyAPR).gte(BigNumber.from(b.supplyAPR)) ? -1 : 1,
      },
      borrowAPY: {
        asc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.borrowAPR).lte(BigNumber.from(b.borrowAPR)) ? -1 : 1,
        desc: (a: KashiPair, b: KashiPair) =>
          BigNumber.from(a.borrowAPR).gte(BigNumber.from(b.borrowAPR)) ? -1 : 1,
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
    <div className="overflow-x-auto bg-white border rounded shadow-md">
      <h3 className="px-8 py-4 font-semibold">{title}</h3>
      <table className="w-full pair-market-table">
        <thead>
          <MarketTableHead
            onSort={handleSort}
            orderBy={orderBy}
            orderDirection={orderDirection}
          />
        </thead>
        {loading ? (
          <tbody>
            <MarketTableRowLoading />
            <MarketTableRowLoading />
            <MarketTableRowLoading />
            <MarketTableRowLoading />
          </tbody>
        ) : (
          // <InfiniteScroll
          //   loadMore={handleLoadMore}
          //   hasMore={list.length < data.length}
          //   useWindow
          //   threshold={10}
          // >
          <tbody>
            {sortedList.map((data, index) => (
              <MarketTableRow key={`${data.id}`} data={data} index={index} />
            ))}
          </tbody>
          // </InfiniteScroll>
        )}
      </table>
    </div>
  );
};
export default PairMarketTable;
