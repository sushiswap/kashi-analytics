import classNames from "classnames";
import { BigNumber } from "ethers";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useAppContext } from "../../../context/AppContext";
import { KashiPair } from "../../../types/KashiPair";

const PairCollateralPieChart = ({
  containerClass = "",
  type = "supply",
  title = "Supply",
  data,
}: {
  type?: "supply" | "asset" | "borrow";
  containerClass?: string;
  title?: string;
  data?: KashiPair[];
}) => {
  const { tokenUtilService } = useAppContext();
  const valueFuncs = {
    supply: (kashiPair: KashiPair) =>
      BigNumber.from(kashiPair.totalAsset)
        .add(BigNumber.from(kashiPair.totalBorrow))
        .toNumber() / 100.0,
    asset: (kashiPair: KashiPair) =>
      BigNumber.from(kashiPair.totalAsset).toNumber() / 100.0,
    borrow: (kashiPair: KashiPair) =>
      BigNumber.from(kashiPair.totalBorrow).toNumber() / 100.0,
  };

  const getSeries = () => {
    let seriesData: any[] = [];
    data?.forEach((item) => {
      seriesData.push({
        name: tokenUtilService.pairSymbol(
          item.asset?.symbol,
          item.collateral?.symbol
        ),
        y: valueFuncs[type](item),
      });
    });
    return [
      {
        name: title,
        data: seriesData,
        tooltip: {
          pointFormat: "${point.y}",
        },
      },
    ];
  };

  const options = {
    title: {
      text: "",
    },
    chart: {
      type: "pie",
    },
    series: getSeries(),
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
          <div className="mx-auto my-12 rounded-full loading w-72 h-72"></div>
        </div>
      ) : (
        <>
          <HighchartsReact highcharts={Highcharts} options={options} />
        </>
      )}
    </div>
  );
};

export default PairCollateralPieChart;
