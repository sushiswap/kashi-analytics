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
  return (
    <div className="container px-4 mx-auto mb-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
