import { KashiPairDayDataMap } from "../../types/KashiPairDayData";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { BigNumber } from "ethers";
import moment from "moment";
import KashiPairDayDataChart from "../../components/module/Charts/KashiPairDayDataChart";
import KashiPairCompareChart from "../../components/module/Charts/KashiPairCompareChart";

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
          BigNumber.from(item.totalAssets)
            .add(BigNumber.from(item.totalBorrows))
            .toNumber() / 100.0,
      });
      borrowData.push({
        x: moment(item.date).valueOf(),
        y: BigNumber.from(item.totalBorrows).toNumber() / 100.0,
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

  const optionsSupplyBorrow = {
    title: {
      style: {
        height: "50px",
        padding: "24px",
        fontWeight: "bold",
        fontSize: "18px",
      },
    },
    scrollbar: {
      enabled: false,
    },
    series: getSeriesSupplyBorrow(),
  };

  return (
    <div className="mb-4 container mx-auto px-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-1">
          <KashiPairDayDataChart loading={loading} data={data} />
        </div>
        <div className="col-span-1">
          <KashiPairCompareChart loading={loading} data={data} />
        </div>
      </div>
    </div>
  );
};

export default Charts;
