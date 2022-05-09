/* eslint-disable @next/next/no-img-element */
import TokenCard from "../../components/module/Cards/TokenCard";
import PairCollateralPieChart from "../../components/module/Charts/PairCollateralPieChart";
import PairSupplyBorrowDayDataChart from "../../components/module/Charts/PairSupplyBorrowDayDataChart";
import { useAppContext } from "../../context/AppContext";
import { KashiPair } from "../../types/KashiPair";
import {
  KashiPairDayDataMap,
  KashiPairDayDataMapsCollateral,
} from "../../types/KashiPairDayData";
import { Token } from "../../types/Token";

const Market = ({
  token,
  totalAsset = BigInt(0),
  totalBorrow = BigInt(0),
  kashiPairs,
  kashiPairDayDataMaps,
  kashiPairDayDataMapsCollaterals,
  priceMap,
}: {
  token?: Token;
  totalAsset?: BigInt;
  totalBorrow?: BigInt;
  kashiPairs?: KashiPair[];
  kashiPairDayDataMaps?: KashiPairDayDataMap[];
  kashiPairDayDataMapsCollaterals?: KashiPairDayDataMapsCollateral[];
  priceMap?: { [key: string]: BigInt };
}) => {
  const { tokenUtilService, handleLogoError } = useAppContext();
  return (
    <>
      <div className="container px-4 mx-auto mb-16 -mt-16">
        <TokenCard
          data={token}
          totalAsset={totalAsset}
          totalBorrow={totalBorrow}
          containerClass="mb-4"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <PairCollateralPieChart
            title="Total supply"
            type={"supply"}
            data={kashiPairs}
          />
          <PairCollateralPieChart
            title="Total available"
            type={"asset"}
            data={kashiPairs}
          />
          <PairCollateralPieChart
            title="Total borrow"
            type={"borrow"}
            data={kashiPairs}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-2">
          <PairSupplyBorrowDayDataChart
            data={kashiPairDayDataMaps}
            type="supply"
            title="Total supply"
          />
          <PairSupplyBorrowDayDataChart
            data={kashiPairDayDataMaps}
            type="borrow"
            title="Total borrow"
          />
        </div>
        <div className="mt-4">
          {kashiPairDayDataMapsCollaterals
            ?.filter((value) => value.kashiPairsMaps.length > 0)
            .map((value) => {
              const { collateral, kashiPairsMaps } = value;
              return (
                <div key={collateral.id} className="mt-8">
                  <div className="flex items-center col-span-2">
                    <div>
                      <img
                        src={tokenUtilService.logo(token?.symbol)}
                        width="25px"
                        height="25px"
                        className="inline-block rounded-full"
                        onError={handleLogoError}
                        alt={tokenUtilService.symbol(token?.symbol)}
                      />
                      <img
                        src={tokenUtilService.logo(collateral?.symbol)}
                        width="25px"
                        height="25px"
                        onError={handleLogoError}
                        className="inline-block -ml-2 rounded-full"
                        alt={collateral?.symbol}
                      />
                    </div>
                    <div className="ml-2">
                      <h3 className="text-xl font-medium">
                        {tokenUtilService.symbol(token?.symbol)}/
                        {tokenUtilService.symbol(collateral?.symbol)}
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 mt-2 md:grid-cols-2">
                    <PairSupplyBorrowDayDataChart
                      data={kashiPairsMaps}
                      type="supply"
                      title="Supply"
                    />
                    <PairSupplyBorrowDayDataChart
                      data={kashiPairsMaps}
                      type="borrow"
                      title="Borrow"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Market;
