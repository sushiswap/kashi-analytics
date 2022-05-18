import classNames from "classnames";
import { BigNumber } from "ethers";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts/highstock";
import moment from "moment";
import TailwindConfig from "../../../config/tailwind";
import { KashiPairDayDataMap } from "../../../types/KashiPairDayData";

const AttributesByType = {
  supply: {
    color: TailwindConfig.theme.colors.secondary1.DEFAULT,
    valueFunc: (item: KashiPairDayDataMap) => ({
      x: moment(item.date).valueOf(),
      y:
        BigNumber.from(item.totalAsset)
          .add(BigNumber.from(item.totalBorrow))
          .toNumber() / 100.0,
    }),
    tooltip: {
      pointFormat: "Supply&nbsp;&nbsp; ${point.y}",
    },
  },
  borrow: {
    color: TailwindConfig.theme.colors.primary2.DEFAULT,
    valueFunc: (item: KashiPairDayDataMap) => ({
      x: moment(item.date).valueOf(),
      y: BigNumber.from(item.totalBorrow).toNumber() / 100.0,
    }),
    tooltip: {
      pointFormat: "Borrow&nbsp;&nbsp; ${point.y}",
    },
  },
};

const PairSupplyBorrowMonthDataChart = ({
  // type = "supply",
  containerClass = "",
  title = "Monthly Net Supply & Borrow",
  data,
}: {
  // type?: "supply" | "borrow";
  containerClass?: string;
  title?: string;
  data?: KashiPairDayDataMap[];
}) => {
  const getSeries = () => {
    let borrowSeriesData: any[] = [];
    const borrowAttribute = AttributesByType["borrow"];

    let supplySeriesData: any[] = [];
    const supplyAttribute = AttributesByType["supply"]
    data?.forEach((item) => {
      borrowSeriesData.push(borrowAttribute.valueFunc(item));
      supplySeriesData.push(supplyAttribute.valueFunc(item));
    });
    return [
      {
        type: "area",
        color: supplyAttribute.color,
        data: supplySeriesData,
        pointIntervalUnit: "month",
        tooltip: supplyAttribute.tooltip,
      },
      {
        type: "area",
        color: borrowAttribute.color,
        data: borrowSeriesData,
        pointIntervalUnit: "month",
        tooltip: borrowAttribute.tooltip,
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
          type: "month",
          count: 5,
          text: "5m",
          title: "View 5 months",
        },
        {
          type: "month",
          count: 6,
          text: "6m",
          title: "View 6 months",
        },
        {
          type: "ytd",
          text: "YTD",
          title: "View year to date",
        },
        {
          type: "year",
          count: 1,
          text: "1y",
          title: "View 1 year",
        },
        {
          type: "all",
          text: "All",
          title: "View all",
        },
      ],
      selected: 0,
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

export default PairSupplyBorrowMonthDataChart;
