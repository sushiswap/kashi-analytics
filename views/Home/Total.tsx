import TotalCard, { TotalData } from "../../components/module/Cards/TotalCard";
import { KashiPair } from "../../types/KashiPair";

const Total = ({
  loading,
  supply,
  asset,
  borrow,
}: {
  loading: boolean;
  supply: TotalData;
  asset: TotalData;
  borrow: TotalData;
}) => {
  return (
    <div className="container grid grid-cols-1 gap-4 px-4 mx-auto mb-4 -mt-16 lg:grid-cols-3">
      <TotalCard
        containerClass="col-span-1"
        loading={loading}
        borrow="supply"
        data={supply}
      />
      <TotalCard
        containerClass="col-span-1"
        loading={loading}
        borrow="asset"
        data={asset}
      />
      <TotalCard
        containerClass="col-span-1"
        loading={loading}
        borrow="borrow"
        data={borrow}
      />
    </div>
  );
};

export default Total;
