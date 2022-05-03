import PairMarketTable from "../../components/module/Tables/PairMarketTable";
import { KashiPair } from "../../types/KashiPair";

const Market = ({ loading, data }: { loading: boolean; data: KashiPair[] }) => {
  return (
    <>
      <div className="mb-24 max-w-6xl mx-auto px-4">
        <PairMarketTable title={"All Markets"} loading={loading} data={data} />
      </div>
    </>
  );
};

export default Market;
