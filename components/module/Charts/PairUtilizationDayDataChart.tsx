import classNames from "classnames";
import { BigNumber } from "ethers";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import TailwindConfig from "../../../config/tailwind";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const PairUtilizationDayDataChart = ({
  containerClass = "",
  title = "Utilization rate",
  data,
}: {
  containerClass?: string;
  title?: string;
  data?: KashiPairDayDataMap[];
}) => {
  const getSeries = () => {
    let utilizationData: any[] = [];
    data?.forEach((item) => {
      utilizationData.push({
        x: moment(item.date).valueOf(),
        y:
          BigNumber.from(item.avgUtilization).div(BigInt(1e14)).toNumber() /
          1e2,
      });
    });
    return [
      {
        type: "line",
        color: TailwindConfig.theme.colors.primary3.DEFAULT,
        name: "Utilization",
        data: utilizationData,
        tooltip: {
          pointFormat: "Utilization Rate&nbsp; {point.y}%",
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

export default PairUtilizationDayDataChart;
