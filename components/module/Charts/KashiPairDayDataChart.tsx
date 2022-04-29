import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { BigNumber } from "ethers";
import moment from "moment";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const KashiPairDayDataChart = ({
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
      selected: 0,
      buttons: [
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
    },
  };

  return (
    <div className="bg-white shadow-lg rounded">
      <div className="text-center text-lg font-medium pt-6">
        Total supply &amp; Total borrow&nbsp;
        <span className="text-sm">(USD)</span>
      </div>
      {loading || !data || data.length === 0 ? (
        <div>
          <div
            className="loading my-12 mx-4 rounded"
            style={{ height: "1px" }}
          ></div>
          <div
            className="loading my-12 mx-4 rounded"
            style={{ height: "1px" }}
          ></div>
          <div
            className="loading my-12 mx-4 rounded"
            style={{ height: "1px" }}
          ></div>
          <div
            className="loading my-12 mx-4 rounded"
            style={{ height: "1px" }}
          ></div>
          <div
            className="loading my-12 mx-4 rounded"
            style={{ height: "1px" }}
          ></div>
          <div
            className="loading my-12 mx-4 rounded"
            style={{ height: "1px" }}
          ></div>
        </div>
      ) : (
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      )}
    </div>
  );
};

export default KashiPairDayDataChart;
