import { JsonRpcProvider } from "@ethersproject/providers";
import { CHAIN_RPC_URLS } from "../../config/constants";
import { ChainIdEnum } from "../../types/Enums";

class ProviderService {
  protected static instance: ProviderService;
  protected providerMap: Map<ChainIdEnum, JsonRpcProvider>;

  constructor() {
    this.providerMap = new Map<ChainIdEnum, JsonRpcProvider>();
  }

  getProvider(chainId: ChainIdEnum): JsonRpcProvider {
    let provider = this.providerMap.get(chainId);
    if (provider) {
      return provider;
    }
    provider = new JsonRpcProvider(CHAIN_RPC_URLS[chainId]);
    this.providerMap.set(chainId, provider);
    return provider;
  }

  static getInstance() {
    if (ProviderService.instance) {
      return ProviderService.instance;
    }
    ProviderService.instance = new ProviderService();
    return ProviderService.instance;
  }
}

export default ProviderService;
