import { BigNumber } from "ethers";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import TailwindConfig from "../../../config/tailwind";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const TotalDayDataChart = ({
  loading,
  data,
}: {
  loading: boolean;
  data: KashiPairDayDataMap[];
}) => {
  const getSeries = () => {
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
        color: TailwindConfig.theme.colors.secondary1.DEFAULT,
        name: "Supply",
        data: supplyData,
        tooltip: {
          pointFormat: "Supply&nbsp;&nbsp; ${point.y}",
        },
      },
      {
        type: "line",
        color: TailwindConfig.theme.colors.primary2.DEFAULT,
        name: "Borrow",
        data: borrowData,
        tooltip: {
          pointFormat: "Borrow&nbsp;&nbsp; ${point.y}",
        },
      },
    ];
  };

  const options = {
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
    series: getSeries(),
    rangeSelector: {
      buttons: [
        {
          type: "week",
          count: 1,
          text: "1w",
          title: "View 1 week",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
          title: "View 1 month",
        },
        {
          type: "month",
          count: 3,
          text: "3m",
          title: "View 3 months",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
          title: "View 6 months",
        },
      ],
      selected: 1,
    },
  };

  return (
    <div className="overflow-hidden bg-white rounded shadow-lg">
      <div className="pt-6 text-lg font-medium text-center">
        Total Supply &amp; Total Borrow
      </div>
      {loading || !data || data.length === 0 ? (
        <div>
          <div
            className="mx-4 my-12 rounded loading"
            style={{ height: "1px" }}
          ></div>
          <div
            className="mx-4 my-12 rounded loading"
            style={{ height: "1px" }}
          ></div>
          <div
            className="mx-4 my-12 rounded loading"
            style={{ height: "1px" }}
          ></div>
          <div
            className="mx-4 my-12 rounded loading"
            style={{ height: "1px" }}
          ></div>
          <div
            className="mx-4 my-12 rounded loading"
            style={{ height: "1px" }}
          ></div>
          <div
            className="mx-4 my-12 rounded loading"
            style={{ height: "1px" }}
          ></div>
        </div>
      ) : (
        <>
          <HighchartsReact
            highcharts={Highcharts}
            constructorType={"stockChart"}
            options={options}
          />
        </>
      )}
    </div>
  );
};

export default TotalDayDataChart;
