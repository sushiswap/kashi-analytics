import { BigNumber } from "ethers";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const TotalCompareChart = ({
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
        BigNumber.from(item.totalBorrow)
          .mul(BigNumber.from("10000"))
          .div(
            BigNumber.from(item.totalAsset).add(
              BigNumber.from(item.totalBorrow)
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
        tooltip: {
          pointFormat: "Ratio {point.y}%",
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
    rangeSelector: {
      selected: 0,
    },
    series: getSeries(),
  };

  return (
    <div className="bg-white shadow-lg rounded overflow-hidden">
      <div className="text-center text-lg font-medium pt-6">
        Borrow vs Supply ratio
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

export default TotalCompareChart;
