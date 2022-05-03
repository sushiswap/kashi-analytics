import TokenMarketTable from "../../components/module/Tables/TokenMarketTable";
import { Token } from "../../types/Token";

const Market = ({ loading, data }: { loading: boolean; data: Token[] }) => {
  return (
    <>
      <div className="-mt-14 mb-24 max-w-6xl mx-auto px-4">
        <TokenMarketTable title={"All Markets"} loading={loading} data={data} />
      </div>
    </>
  );
};

export default Market;
