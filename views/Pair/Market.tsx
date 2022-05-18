import PairCard from "../../components/module/Cards/PairCard";
import PairInterestPerSecondDayDataChart from "../../components/module/Charts/PairInteresetPerSecondDayDataChart";
import PairSupplyAccruedInterestDayDataChart from "../../components/module/Charts/PairSupplyAccruedInterestDayDataChart";
import PairSupplyBorrowDayDataChart from "../../components/module/Charts/PairSupplyBorrowDayDataChart";
import PairSupplyBorrowMonthDataChart from "../../components/module/Charts/PairSupplyBorrowMonthDataChart";
import PairUtilizationDayDataChart from "../../components/module/Charts/PairUtilizationDayDataChart";
import { KashiPair } from "../../types/KashiPair";
import { KashiPairDayDataMap } from "../../types/KashiPairDayData";

const Market = ({
  kashiPair,
  kashiPairDayData,
  kashiPairDayDataMonthly,
}: {
  kashiPair?: KashiPair;
  kashiPairDayData?: KashiPairDayDataMap[];
  kashiPairDayDataMonthly?: KashiPairDayDataMap[];
}) => {
  return (
    <>
      <div className="container px-4 mx-auto mb-16 -mt-16">
        <PairCard data={kashiPair} containerClass="mb-4" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <PairSupplyBorrowMonthDataChart
            containerClass="col-span-2"
            title="Monthly Net Supply &amp; Borrow"
            data={kashiPairDayDataMonthly}
          />
          <PairSupplyBorrowDayDataChart
            type="supply"
            title="Supply"
            data={kashiPairDayData}
          />
          <PairSupplyBorrowDayDataChart
            type="borrow"
            title="Borrow"
            data={kashiPairDayData}
          />
          <PairInterestPerSecondDayDataChart data={kashiPairDayData} />
          <PairUtilizationDayDataChart data={kashiPairDayData} />
          <PairSupplyAccruedInterestDayDataChart data={kashiPairDayData} />
        </div>
      </div>
    </>
  );
};

export default Market;
