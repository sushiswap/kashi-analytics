import PairCard from "../../components/module/Cards/PairCard";
import PairInterestPerSecondDayDataChart from "../../components/module/Charts/PairInteresetPerSecondDayDataChart";
import PairSupplyAccruedInterestDayDataChart from "../../components/module/Charts/PairSupplyAccruedInterestDayDataChart";
import PairSupplyBorrowDayDataChart from "../../components/module/Charts/PairSupplyBorrowDayDataChart";
import PairUtilizationDayDataChart from "../../components/module/Charts/PairUtilizationDayDataChart";
import { KashiPair } from "../../types/KashiPair";
import { KashiPairDayDataMap } from "../../types/KashiPairDayData";

const Market = ({
  kashiPair,
  kashiPairDayData,
}: {
  kashiPair?: KashiPair;
  kashiPairDayData?: KashiPairDayDataMap[];
}) => {
  return (
    <>
      <div className="container -mt-16 mx-auto px-4 mb-16">
        <PairCard data={kashiPair} containerClass="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
