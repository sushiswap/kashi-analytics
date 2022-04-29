import MarketTable from "../../components/module/Tables/MarketTable";
import { KashiPair } from "../../types/KashiPair";

const Market = ({ loading, data }: { loading: boolean; data: KashiPair[] }) => {
  return (
    <>
      <div className="mb-24 max-w-6xl mx-auto px-4">
        <MarketTable title={"All Markets"} loading={loading} data={data} />
      </div>
    </>
  );
};

export default Market;
