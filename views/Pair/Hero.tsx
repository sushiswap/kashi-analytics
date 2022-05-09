/* eslint-disable @next/next/no-img-element */
import { useAppContext } from "../../context/AppContext";
import { KashiPair } from "../../types/KashiPair";

const Hero = ({ data }: { data?: KashiPair }) => {
  const { tokenUtilService, handleLogoError } = useAppContext();

  return (
    <div className="bg-black">
      <div className="container px-4 py-24 mx-auto">
        {!data ? (
          <div className="flex items-center col-span-2">
            <div>
              <div className="inline-block w-8 h-8 rounded-full loading-black"></div>
              <div className="inline-block w-8 h-8 -ml-2 rounded-full loading-black"></div>
            </div>
            <div className="ml-2">
              <div>
                <div className="inline-block w-40 h-8 rounded loading-black"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center col-span-2">
            <div>
              <img
                src={tokenUtilService.logo(data?.asset?.symbol)}
                width="30px"
                height="30px"
                className="inline-block rounded-full"
                onError={handleLogoError}
                alt={tokenUtilService.symbol(data?.symbol)}
              />
              <img
                src={tokenUtilService.logo(data?.collateral?.symbol)}
                width="30px"
                height="30px"
                onError={handleLogoError}
                className="inline-block -ml-2 rounded-full"
                alt={data?.symbol}
              />
            </div>
            <div className="ml-2">
              <h2 className="text-3xl font-medium text-white">
                {tokenUtilService.symbol(data?.asset?.symbol)}/
                {tokenUtilService.symbol(data?.collateral?.symbol)}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
