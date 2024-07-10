type ExtensionValue = string | number | boolean | null | undefined;

export enum TokenListTagNames {
  // Networks
  MAINNET = 'Mainnet',
  OPTIMISM = 'Optimism',
  ARBITRUM = 'Arbitrum',
  AVALANCHE = 'Avalanche',
  BASE = 'Base',
  TESTNET = 'TESTNET',

  // Coin/currency
  STABLECOIN = 'Stablecoin',
  USD = 'USD',
  EUR = 'EUR',

  // Misc
  TOP_10 = 'Top10',
  NATIVE_TOKEN = 'Native Token',
}

export interface RouterInfo {
  readonly chainId: number;
  readonly address: string;
  readonly timestamp: string;
  readonly version: string;
  readonly fee: string;
}

export interface TestnetFaucetInfo {
  readonly chainId: number;
  readonly address: string;
  readonly token: string;
}

export interface ChainInfo {
  readonly chainId: number;
  readonly chainName: string;
  // shortName is the EIP3770 short name
  // chain details can be found here: https://github.com/ethereum-lists/chains/tree/master/_data/chains
  readonly shortName: string;
  readonly logoUri: string;
  readonly explorerUrl: string;
  readonly timestamp: string;
  readonly rpcUrls: string[];
  readonly wrappedNativeToken: string;
  readonly nativeTokenName: string;
  readonly feeTreasury?: string;
  readonly testnet: boolean;
  readonly priceFeeds?: {
    readonly [key: string]: string | undefined;
  };
  readonly tokenFeeds?: {
    readonly [key: string]: string | undefined;
  };
  readonly curveRouterAddress?: string;
}

export interface TokenInfo {
  readonly chainId: number;
  readonly address: string;
  readonly name: string;
  readonly decimals: number;
  readonly symbol: string;
  readonly coinGeckoId?: string;
  readonly currency?: string;
  readonly logoUri?: string;
  readonly tags?: TokenListTagNames[];
  readonly extensions?: {
    readonly [key: string]:
      | {
          [key: string]:
            | {
                [key: string]: ExtensionValue;
              }
            | ExtensionValue;
        }
      | ExtensionValue;
  };
}

export interface Version {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
}

export interface TokenList {
  readonly name: string;
  readonly timestamp: string;
  readonly version: Version;
  readonly tokens: TokenInfo[];
  readonly keywords?: string[];
  readonly tags?: any;
  readonly logoUri?: string;
}

export interface PriceFeed {
  readonly address: string;
  readonly name: string;
  readonly assetName: string;
  readonly type: string;
  readonly path: string;
  readonly input: string;
  readonly output: string;
  readonly deviation: number;
  readonly decimals: number;
  readonly updateInterval: number;
  readonly chainId: number;
}

export interface FiatCurrency {
  readonly name: string;
  readonly symbol: string;
  readonly sign: string;
}
