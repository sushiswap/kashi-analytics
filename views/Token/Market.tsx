import PairCard from "../../components/module/Cards/PairCard";
import PairInterestPerSecondDayDataChart from "../../components/module/Charts/PairInteresetPerSecondDayDataChart";
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
      <div className="container mx-auto -mt-16 mx-auto px-4 mb-16">
        <PairCard data={kashiPair} containerClass="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PairSupplyBorrowDayDataChart
            data={kashiPairDayData}
            containerClass="md:col-span-2"
          />
          <PairUtilizationDayDataChart data={kashiPairDayData} />
          <PairInterestPerSecondDayDataChart data={kashiPairDayData} />
        </div>
      </div>
    </>
  );
};

export default Market;
