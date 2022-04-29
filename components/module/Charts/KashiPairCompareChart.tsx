import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { BigNumber } from "ethers";
import moment from "moment";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const KashiPairCompareChart = ({
  loading,
  data,
}: {
  loading: boolean;
  data: KashiPairDayDataMap[];
}) => {
  const getSeries = () => {
    let seriesData: any[] = [];
    data.forEach((item) => {
      const percent =
        BigNumber.from(item.totalBorrows)
          .mul(BigNumber.from("10000"))
          .div(
            BigNumber.from(item.totalAssets).add(
              BigNumber.from(item.totalBorrows)
            )
          )
          .toNumber() / 100;
      seriesData.push({
        x: moment(item.date).valueOf(),
        y: percent,
      });
    });

    return [
      {
        type: "column",
        color: "#10b981",
        name: "Ratio",
        data: seriesData,
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
    series: getSeries(),
  };

  return (
    <div className="bg-white shadow-lg rounded">
      <div className="text-center text-lg font-medium pt-6">
        Borrow vs Supply ratio&nbsp;
        <span className="text-sm">(%)</span>
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

export default KashiPairCompareChart;
