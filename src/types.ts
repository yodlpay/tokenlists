type ExtensionValue = string | number | boolean | null | undefined;

export enum TokenListTagNames {
  // Networks
  MAINNET = 'Mainnet',
  OPTIMISM = 'Optimism',
  ARBITRUM = 'Arbitrum',
  AVALANCHE = 'Avalanche',
  TESTNET = 'TESTNET',

  // Coin/currency
  STABLECOIN = 'Stablecoin',
  USD = 'USD',
  EUR = 'EUR',

  // Misc
  TOP_10 = 'Top10'
}

export interface RouterInfo {
  readonly chainId: number;
  readonly address: string;
  readonly timestamp: string;
  readonly version: string;
}

export interface TestnetFaucetInfo {
  readonly chainId: number;
  readonly address: string;
  readonly token: string;
}

export interface ChainInfo {
  readonly chainId: number;
  readonly chainName: string;
  readonly logoUri: string;
  readonly explorerUrl: string;
  readonly rpcUrls: string[];
  readonly feeTreasury?: string;
  readonly testnet: boolean;
  readonly priceFeeds?: {
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
