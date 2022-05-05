import classNames from "classnames";
import { BigNumber } from "ethers";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const PairInterestPerSecondDayDataChart = ({
  containerClass = "",
  title = "Supply & Borrow APR",
  data,
}: {
  containerClass?: string;
  title?: string;
  data?: KashiPairDayDataMap[];
}) => {
  const getSeries = () => {
    let borrowData: any[] = [];
    let supplyData: any[] = [];
    data?.forEach((item) => {
      borrowData.push({
        x: moment(item.date).valueOf(),
        y:
          BigNumber.from(item.avgInterestPerSecond)
            .mul(3600 * 24 * 365)
            .div(1e14)
            .toNumber() / 1e2,
      });
      supplyData.push({
        x: moment(item.date).valueOf(),
        y:
          BigNumber.from(item.avgInterestPerSecond)
            .mul(3600 * 24 * 365)
            .mul(BigNumber.from(item.avgUtilization))
            .div(1e14)
            .div(1e14)
            .div(1e4)
            .toNumber() / 1e2,
      });
    });
    return [
      {
        type: "line",
        color: "#10b981",
        data: supplyData,
        tooltip: {
          pointFormat: "Supply APR&nbsp; {point.y}%",
        },
      },
      {
        type: "line",
        color: "#a855f7",
        data: borrowData,
        tooltip: {
          pointFormat: "Borrow APR&nbsp; {point.y}%",
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
    <div
      className={classNames({
        [containerClass]: true,
        "bg-white shadow-lg rounded over overflow-hidden": true,
      })}
    >
      <div className="pt-6 text-lg font-medium text-center">{title}</div>
      {!data || data.length === 0 ? (
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

export default PairInterestPerSecondDayDataChart;
