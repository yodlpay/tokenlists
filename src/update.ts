import { FiatCurrency, PriceFeed, TokenInfo, ChainInfo } from './types';
import { getFeaturedTokenBySymbol } from './index';

// locations to find coin metadata:
// https://docs.coingecko.com/reference/coins-list
// https://coinmarketcap.com/api/documentation/v1/#operation/getV1CryptocurrencyMap

export const deepCopy = (obj: any) => JSON.parse(JSON.stringify(obj));

export const CHAIN_MAPPINGS = [
  {
    name: 'mainnet',
    chainLink: 'mainnet',
    coinGecko: 'ethereum',
    chainId: 1,
    nativeTokenSymbol: 'ETH',
  },
  {
    name: 'polygon',
    chainLink: 'matic-mainnet',
    coinGecko: 'polygon-pos',
    chainId: 137,
    nativeTokenSymbol: 'ETH',
  },
  {
    name: 'gnosis',
    chainLink: 'xdai-mainnet',
    coinGecko: null,
    chainId: 100,
  },
  {
    name: 'arbitrum',
    chainLink: 'ethereum-mainnet-arbitrum-1',
    coinGecko: 'arbitrum-one',
    chainId: 42161,
    nativeTokenSymbol: 'ETH',
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
  // BSC not supported at this time
  /* {
    name: 'bsc',
    chainLink: 'bsc-mainnet',
    coinGecko: 'binance-smart-chain',
    chainId: 56,
  }, */
];

// canonical USDC addresses here:
export const CONFLICT_OVERRIDES = {
  [1]: {
    USDE: '0x4c9edd5852cd905f086c759e8383e09bff1e68b3',
    LUSD: '0x5f98805a4e8be255a32880fdec7f6728c6568ba0',
    BNB: '0xb8c77482e45f1f44de1745f52c74426c631bdd52',
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  },
  [10]: {
    USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
  },
  [137]: {
    USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    WBTC: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
  },
  [42161]: {
    USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  },
  [8453]: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
};

const ethereumNative = {
  chainId: 1,
  coinGeckoId: 'ethereum',
  name: 'Ether',
  symbol: 'ETH',
  logoUri:
    'https://raw.githubusercontent.com/yodlpay/tokenlists/main/logos/tokens/ETH.svg',
  decimals: 18,
  tags: ['Mainnet', 'Native Token', 'Top10'],
  address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
};

const optimismNative = Object.assign(deepCopy(ethereumNative), { chainId: 10 });
const baseNative = Object.assign(deepCopy(ethereumNative), { chainId: 8453 });
const arbitrumNative = Object.assign(deepCopy(ethereumNative), {
  chainId: 42161,
});

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

export const fetchChainLinkFeed = async (chainName: string) => {
  const url = getChainLinkFeed(chainName);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Fetching chainlink feed Failed with ${resp.statusText}`);
  }
  return await resp.json();
};

const parseFeed = (f: any, chainId: number) => {
  let updateInterval = 600; // 10 minutes
  if (f.docs.baseAsset === 'MATIC' && chainId === 137) {
    updateInterval = 10;
  }
  return {
    decimals: f.decimals,
    chainId: chainId,
    name: f.name,
    assetName: f.docs.baseAsset,
    address: f.proxyAddress,
    path: f.path,
    input: f.docs.baseAsset,
    output: f.docs.quoteAsset,
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

  const fiatFeeds = filteredFeeds
    .filter((f: any) => f.feedType === 'Forex')
    .sort(basicSort)
    .map((f: any) => parseFeed(f, chainId));

  const tokenFeeds = filteredFeeds
    .filter((f: any) => f.feedType === 'Crypto')
    .sort(basicSort)
    .map((f: any) => parseFeed(f, chainId));

  return [fiatFeeds, tokenFeeds];
};

export const resolveChainData = async (
  chainId: number,
  fetchFeed?,
  fetchCoinGecko?
) => {
  const chainMapping = CHAIN_MAPPINGS.find(m => m.chainId === chainId)!;
  const func = fetchFeed ? fetchFeed : fetchChainLinkFeed;
  const feeds = await func(chainMapping.chainLink);
  const [fiatFeeds, tokenFeeds] = splitFeeds(feeds, chainId);

  const tokenSymbolList = new Set(tokenFeeds.map(f => f.assetName));
  return [fiatFeeds, tokenFeeds, Array.from(tokenSymbolList)];
};

export const fetchTokenData = async (chainName: string) => {
  const url = getCoinGeckoUrl(chainName);
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(
      `Fetching token data from o for failed with ${resp.statusText}`
    );
  }
  return await resp.json();
};

export const resolveTokens = async (
  chainId: number,
  tokenSymbolList: string[],
  fetchTokensFunc?
) => {
  const chainMapping = CHAIN_MAPPINGS.find(c => c.chainId === chainId)!;
  let tokens: TokenInfo[];

  // coingecko doesn't have coins for GNOSIS
  if (chainId === 100) {
    return [];
  } else {
    const func = fetchTokensFunc ? fetchTokensFunc : fetchTokenData;
    const data = await func(chainMapping.coinGecko!);
    tokens = data
      .tokens!.filter((t: TokenInfo) => tokenSymbolList.includes(t.symbol))
      .filter(
        (t: TokenInfo) => getFeaturedTokenBySymbol(t.symbol, chainId) === null
      )
      .map((t: any) => {
        // fix the logoUri attribute
        const logo = t.logoURI;
        delete t['logoURI']
        t.logoUri = logo;
        return t;
      })
      .sort(basicSort);
  }

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

// Use symbols of input currency in pricefeeds
// And all currency data from CoinMarketCap to create FiatCurrency objects
export const hydrateFiatCurrencies = async (fiatSymbols: string[]) => {
  if (!process.env.CMC_API_KEY) {
    throw new Error(
      'The environment variable CMC_API_KEY must be defined in .env'
    );
  }
  const cmcUrl = 'https://pro-api.coinmarketcap.com/v1/fiat/map';
  const resp = await fetch(cmcUrl, {
    headers: { 'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY },
  });
  if (!resp.ok) {
    throw new Error(
      `Request to ${cmcUrl} failed with status: ${resp.statusText}`
    );
  }
  const allCurrencies = (await resp.json()).data;
  const currencies = allCurrencies
    .map(c => {
      return { name: c.name, symbol: c.symbol, sign: c.sign } as FiatCurrency;
    })
    .filter(c => fiatSymbols.includes(c.symbol));

  return currencies;
};
