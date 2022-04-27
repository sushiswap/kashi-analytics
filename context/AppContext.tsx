import { createContext, ReactNode, useContext, useReducer } from "react";
import { API_URL } from "../config/constants";
import CoinGeckoService from "../services/data/CoinGeckoService";
import { DataService } from "../services/data/DataTypes";
import RestDataService from "../services/data/RestDataService";
import Reducer, { initialState } from "../stores/reducer";
import { ActionValues, State } from "../stores/types";

interface AppContextProps {
  state: State;
  dispatch: React.Dispatch<ActionValues>;
  dataService: DataService;
  coinGeckoService: CoinGeckoService;
}
const AppContext = createContext<AppContextProps>({} as AppContextProps);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const dataService = RestDataService(API_URL);
  const coinGeckoService = CoinGeckoService.getInstance();

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        dataService,
        coinGeckoService,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export const useDataService = () => {
  const { dataService } = useAppContext();
  return dataService;
};

export const useCoingeckoService = () => {
  const { coinGeckoService } = useAppContext();
  return coinGeckoService;
};
