import { FiatCurrency, PriceFeed, TokenInfo, ChainInfo } from '../src/types';

// locations to find coin metadata:
// https://docs.coingecko.com/reference/coins-list
// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap

export const CHAIN_MAPPINGS = [
  {
    name: 'mainnet',
    chainLink: 'mainnet',
    coinGecko: 'ethereum',
    chainId: 1,
  },
  {
    name: 'polygon',
    chainLink: 'matic-mainnet',
    coinGecko: 'polygon-pos',
    chainId: 137,
  },
  { name: 'gnosis', chainLink: 'xdai-mainnet', coinGecko: null, chainId: 100 },
  {
    name: 'arbitrum',
    chainLink: 'ethereum-mainnet-arbitrum-1',
    coinGecko: 'arbitrum-one',
    chainId: 42161,
  },
  {
    name: 'base',
    chainLink: 'ethereum-mainnet-base-1',
    coinGecko: 'base',
    chainId: 8453,
  },
  {
    name: 'optimism',
    chainLink: 'ethereum-mainnet-optimism-1',
    coinGecko: 'optimistic-ethereum',
    chainId: 10,
  },
  {
    name: 'bsc',
    chainLink: 'bsc-mainnet',
    coinGecko: 'binance-smart-chain',
    chainId: 56,
  },
];

export const CONFLICT_OVERRIDES = {
  [1]: {
    USDE: '0x4c9edd5852cd905f086c759e8383e09bff1e68b3',
    LUSD: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
    BNB: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
  },
};

let timestamp;

export const setTimestamp = () => {
  timestamp = new Date().toISOString();
};

export const getTimestamp = () => timestamp;

const getCoinGeckoUrl = (chainName: string) => {
  return `https://tokens.coingecko.com/${chainName}/all.json`;
};

const getChainLinkFeed = (chainName: string) => {
  return `https://reference-data-directory.vercel.app/feeds-${chainName}.json`;
};

const FIAT_SYMBOLS = {
  YEN: '¥',
  EUR: '€',
  USD: '$',
  CHF: 'CHF',
  AUD: '$',
  CAD: '$',
  CNY: '¥',
  THB: '฿',
  GBP: '£',
  SEK: 'kr',
  SGD: '$',
};

export const fetchChainLinkFeed = async (chainName: string, fetchFunc?) => {
  const defaultFetch = async (chainName: string) => {
    const resp = await fetch(getChainLinkFeed(chainName));
    return await resp.json();
  };
  const func = fetchFunc ? fetchFunc : defaultFetch;
  return await func(getChainLinkFeed(chainName));
};

const parseFeed = (f: any, chainId: number) => {
  let updateInterval = 600; // 10 minutes
  if (f.pair[0] === 'MATIC' && chainId === 137) {
    updateInterval = 10;
  }
  return {
    decimals: f.decimals,
    chainId: chainId,
    name: f.name,
    assetName: f.docs.baseAsset,
    address: f.proxyAddress,
    path: f.path,
    input: f.pair[0],
    output: f.pair[1],
    deviation: f.deviation,
    type: f.feedType.toLowerCase() === 'crypto' ? 'crypto' : 'fiat',
    updateInterval: updateInterval,
  } as PriceFeed;
};

const basicSort = (a: any, b: any) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};

export const splitFeeds = (feeds: any, chainId: number) => {
  // filter out equities
  const filteredFeeds = feeds.filter((row: any) =>
    ['Forex', 'Crypto'].includes(row.feedType)
  );

  const fiatCurrencies = {} as {
    string: FiatCurrency;
  };

  const fiatFeeds = filteredFeeds
    .filter((f: any) => f.feedType === 'Forex')
    .sort(basicSort)
    .map((f: any) => {
      if (!fiatCurrencies[f.assetName]) {
        fiatCurrencies[f.assetName] = {
          name: f.assetName,
          code: f.docs.baseAsset,
          symbol: FIAT_SYMBOLS[f.docs.baseAsset]
            ? FIAT_SYMBOLS[f.docs.baseAsset]
            : f.docs.baseAsset,
        } as FiatCurrency;
      }
      return parseFeed(f, chainId);
    })
    .filter((f: PriceFeed) => f.path.endsWith('usd'));

  const tokenFeeds = filteredFeeds
    .filter((f: any) => f.feedType === 'Crypto')
    .sort(basicSort)
    .map((f: any) => parseFeed(f, chainId))
    .filter((f: PriceFeed) => f.path.endsWith('usd'));

  return [fiatFeeds, tokenFeeds];
};

export const resolveChainData = async (
  chain: ChainInfo,
  fetchFeed?,
  fetchCoinGecko?
) => {
  const chainMapping = CHAIN_MAPPINGS.find(m => m.chainId == chain.chainId)!;
  const func = fetchFeed ? fetchFeed : fetchChainLinkFeed;
  const feeds = await func(chainMapping.chainLink, fetchChainLinkFeed);
  const [fiatFeeds, tokenFeeds] = splitFeeds(feeds, chain.chainId);
  (chain as any).timestamp = getTimestamp();
  const fiatMap = {};
  fiatFeeds.map(f => {
    fiatMap[f.input] = f.address;
  });
  const tokenMap = {};
  tokenFeeds.map(f => (tokenMap[f.assetName] = f.address));

  (chain as any).priceFeeds = fiatMap;
  (chain as any).tokenFeeds = tokenMap;
  const tokenSymbolList = new Set(tokenFeeds.map(f => f.assetName));
  return [chain, fiatFeeds, Array.from(tokenSymbolList)];
};

export const fetchTokenData = async (chainName: string) => {
  const resp = await fetch(getCoinGeckoUrl(chainName));
  return await resp.json();
};

export const resolveTokens = async (
  chainId: number,
  tokenSymbolList: string[],
  fetchTokensFunc?
) => {
  const chainMapping = CHAIN_MAPPINGS[chainId];
  const func = fetchTokensFunc ? fetchTokensFunc : fetchTokenData;

  const tokens: TokenInfo[] = (
    await func(getCoinGeckoUrl(chainMapping.coinGecko!))
  )
    .tokens!.filter((t: TokenInfo) => tokenSymbolList.includes(t.symbol))
    .sort(basicSort);

  // If we find duplicate symbols, drop the tokens on the floor
  // unless we have a value to determine which is correct
  const dumpList: string[] = [];
  tokenSymbolList.forEach(s => {
    const matchingTokens = tokens.filter((t: TokenInfo) => t.symbol === s);
    if (matchingTokens.length > 1) {
      matchingTokens.forEach((t: TokenInfo) => {
        if (CONFLICT_OVERRIDES[chainId][s] !== t.address) {
          console.log(
            `Duplicate symbol found. Excluding token: \n symbol: ${t.symbol}, name: "${t.name}", address: ${t.address}`
          );
          dumpList.push(t.address);
        }
      });
    }
  });

  return tokens.filter((t: TokenInfo) => !dumpList.includes(t.address));
};
