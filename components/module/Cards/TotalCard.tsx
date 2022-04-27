import classNames from "classnames";
import Progress from "../../base/Progress/Progress";
import numeral from "numeral";
import { KashiPair } from "../../../types/KashiPair";
import { BigNumber } from "ethers";

type TotalData = {
  amount: BigInt;
  volumeIn24H: BigInt;
  totalUsers: BigInt;
  topMarkets: KashiPair[];
};

type AttributesByBorrowType = {
  progressColor: "purple" | "emerald";
  title: string;
  users: string;
};

type AttributesMapByBorrowType = {
  borrow: AttributesByBorrowType;
  supply: AttributesByBorrowType;
};

const AttributesMapByBorrow = {
  borrow: {
    progressColor: "purple",
    title: "Total Borrow",
    users: "Borrowers",
  },
  supply: {
    progressColor: "emerald",
    title: "Total Supply",
    users: "Suppliers",
  },
} as AttributesMapByBorrowType;

const TotalCard = ({
  containerClass = "",
  data,
  borrow = "borrow",
  loading = false,
}: {
  containerClass?: string;
  data: TotalData;
  borrow?: "borrow" | "supply";
  loading?: boolean;
}) => {
  const attributes = AttributesMapByBorrow[borrow];
  const isLoading = data.amount === BigInt(0) || loading;

  return (
    <div
      className={classNames({
        [containerClass]: true,
        "bg-white border rounded shadow-md": true,
      })}
    >
      <div className="border-b px-8 py-5 font-semibold">{attributes.title}</div>
      <div className="px-8 py-8">
        <div className="text-xl font-medium mb-4">
          {isLoading ? (
            <div className="inline-block loading h-5 w-48 rounded"></div>
          ) : (
            numeral(Number(data.amount) / 100.0).format("($0,0.00)")
          )}
        </div>
        <div className="text-sm text-gray-400 font-medium mb-4">
          Top {data.topMarkets.length} Markets
        </div>
        {isLoading ? (
          <>
            <Progress loading={isLoading} containerClass="mb-4" />
            <Progress loading={isLoading} containerClass="mb-4" />
            <Progress loading={isLoading} containerClass="mb-4" />
          </>
        ) : (
          data.topMarkets.map((marketData) => (
            <Progress
              loading={isLoading}
              key={marketData.name}
              containerClass="mb-4"
              title={`${marketData.asset?.symbol}/${marketData.collateral?.symbol}`}
              color={attributes.progressColor}
              progress={
                BigNumber.from(
                  borrow === "borrow"
                    ? marketData.totalBorrow
                    : marketData.totalAsset
                )
                  .mul(BigNumber.from("10000"))
                  .div(BigNumber.from(data.amount))
                  .toNumber() / 10000
              }
            />
          ))
        )}
        <div className="mt-8 border-t pt-6">
          <div className="flex justify-between">
            <div>
              {/* <div className="text-sm text-gray-400 font-semibold">
                24H Supply Volume
              </div>
              <div className="mt-2">
                {isLoading ? (
                  <div className="loading h-5 w-32 rounded"></div>
                ) : (
                  numeral(data.volumeIn24H).format("$0,0.00")
                )}
              </div> */}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400 font-semibold">
                # of {attributes.users}
              </div>
              <div className="mt-2">
                {isLoading ? (
                  <div className="ml-auto loading h-5 w-20 rounded"></div>
                ) : (
                  data.totalUsers
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TotalCard;
