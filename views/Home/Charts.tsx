import { BigNumber } from "ethers";
import moment from "moment";
import TotalCompareChart from "../../components/module/Charts/TotalCompareChart";
import TotalDayDataChart from "../../components/module/Charts/TotalDayDataChart";
import { KashiPairDayDataMap } from "../../types/KashiPairDayData";

const Charts = ({
  loading,
  data,
}: {
  loading: boolean;
  data: KashiPairDayDataMap[];
}) => {
  const getSeriesSupplyBorrow = () => {
    let supplyData: any[] = [];
    let borrowData: any[] = [];
    data.forEach((item) => {
      supplyData.push({
        x: moment(item.date).valueOf(),
        y:
          BigNumber.from(item.totalAsset)
            .add(BigNumber.from(item.totalBorrow))
            .toNumber() / 100.0,
      });
      borrowData.push({
        x: moment(item.date).valueOf(),
        y: BigNumber.from(item.totalBorrow).toNumber() / 100.0,
      });
    });
    return [
      {
        type: "line",
        color: "#10b981",
        name: "Supply",
        data: supplyData,
      },
      {
        type: "line",
        color: "#a855f7",
        name: "Borrow",
        data: borrowData,
      },
    ];
  };

  return (
    <div className="mb-4 container mx-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <TotalDayDataChart loading={loading} data={data} />
        </div>
        <div className="col-span-1">
          <TotalCompareChart loading={loading} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
