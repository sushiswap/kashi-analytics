import classNames from "classnames";
import { BigNumber } from "ethers";
import numeral from "numeral";
import { KashiPair } from "../../../types/KashiPair";

const PairCard = ({
  containerClass = "",
  data,
}: {
  containerClass?: string;
  data?: KashiPair;
  borrow?: "borrow" | "asset" | "supply";
  loading?: boolean;
}) => {
  return (
    <div
      className={classNames({
        [containerClass]: true,
        "bg-white border rounded shadow-md": true,
      })}
    >
      <div className="border-b px-8 py-5 font-semibold">Info</div>
      <div className="px-8 py-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
        <div className="flex align-center justify-between w-full">
          <span className="font-semibold">Supply&nbsp;</span>
          {!data ? (
            <div className="inline-block loading h-6 w-36 rounded"></div>
          ) : (
            <span>
              {numeral(
                BigNumber.from(data?.totalAsset)
                  .add(BigNumber.from(data.totalBorrow))
                  .toNumber() / 100.0
              ).format("($0,0.00)")}
            </span>
          )}
        </div>
        <div className="flex align-center justify-between w-full">
          <span className="font-semibold">Utilization&nbsp;</span>
          {!data ? (
            <div className="inline-block loading h-6 w-24 rounded"></div>
          ) : (
            <span>
              {numeral(
                BigNumber.from(data?.utilization)
                  .div(BigNumber.from("100000000000000"))
                  .toNumber() / 10000.0
              ).format("(0,0.00%)")}
            </span>
          )}
        </div>
        <div className="flex align-center justify-between w-full">
          <span className="font-semibold">Available</span>
          {!data ? (
            <div className="inline-block loading h-6 w-36 rounded"></div>
          ) : (
            <span>
              {numeral(Number(data?.totalAsset) / 100.0).format("($0,0.00)")}
            </span>
          )}
        </div>
        <div className="flex align-center justify-between w-full">
          <span className="font-semibold">Borrow&nbsp;</span>
          {!data ? (
            <div className="inline-block loading h-6 w-36 rounded"></div>
          ) : (
            <span>
              {numeral(Number(data?.totalBorrow) / 100.0).format("($0,0.00)")}
            </span>
          )}
        </div>
        <div className="flex align-center justify-between w-full">
          <span className="font-semibold">Supply APY&nbsp;</span>
          {!data ? (
            <div className="inline-block loading h-6 w-14 rounded"></div>
          ) : (
            <span>
              {numeral(
                BigNumber.from(data?.supplyAPR)
                  .div(BigNumber.from("1000000000000"))
                  .toNumber() / 100000
              ).format("%0.00")}
            </span>
          )}
        </div>
        <div className="flex align-center justify-between w-full">
          <span className="font-semibold">Borrow APY&nbsp;</span>
          {!data ? (
            <div className="inline-block loading h-6 w-14 rounded"></div>
          ) : (
            <span>
              {numeral(
                BigNumber.from(data?.borrowAPR)
                  .div(BigNumber.from("1000000000000"))
                  .toNumber() / 100000
              ).format("%0.00")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PairCard;
