/* eslint-disable @next/next/no-img-element */
import { useAppContext } from "../../context/AppContext";
import { Token } from "../../types/Token";

const Hero = ({ data: token }: { data?: Token }) => {
  const { tokenUtilService } = useAppContext();
  const handleLogoError = (event: React.SyntheticEvent) => {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = "/icon-quiz.jpg";
  };

  return (
    <div className="bg-black">
      <div className="container px-4 mx-auto py-24">
        {!token ? (
          <div className="col-span-2 items-center flex">
            <div>
              <div className="inline-block loading-black h-8 w-8 rounded-full"></div>
            </div>
            <div className="ml-2">
              <div>
                <div className="inline-block loading-black h-8 w-40 rounded"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-2 items-center flex">
            <div>
              <img
                src={tokenUtilService.logo(token?.symbol)}
                width="30px"
                height="30px"
                className="inline-block rounded-full"
                onError={handleLogoError}
                alt={token?.symbol}
              />
            </div>
            <div className="ml-2">
              <h2 className="text-white text-3xl font-medium">
                {tokenUtilService.symbol(token?.symbol)}
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hero;
