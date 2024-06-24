import featuredTokenlist from './tokenlist-featured.json';
import generatedTokenlist from './tokenlist-generated.json';
import chainlist from './chainlist-v1.json';
import routerlist from './routerlist-v1.json';
import testnetfaucets from './testnet-faucets-v1.json';
import priceFeeds from './pricefeeds.json';
import fiatCurrencies from './fiatCurrencies.json';
import { ChainInfo, RouterInfo, TokenInfo, TestnetFaucetInfo } from './types';

export * from './abis';
export * from './types';
export * from './isVersionUpdate';
export * from './getVersionUpgrade';
export * from './diffTokenLists';
export * from './minVersionBump';
export * from './nextVersion';
export * from './versionComparator';

const tokenlist = featuredTokenlist.tokens.concat(
  //@ts-ignore
  generatedTokenlist.tokens as TokenInfo[]
);

export function getChain(chainId: number): ChainInfo {
  return chainlist.chains.find((needle: any) => {
    return needle.chainId === chainId;
  }) as ChainInfo;
}

export function getTokenByAddress(
  tokenAddress: string,
  chainId?: number
): TokenInfo | null {
  return (
    (tokenlist.find((token: any) => {
      return (
        token.address.toLowerCase() === tokenAddress.toLowerCase() &&
        (!chainId || token.chainId === chainId)
      );
    }) as TokenInfo) ?? null
  );
}

export function getPriceFeeds(chainId: number) {
  return priceFeeds.filter(f => f.chainId === chainId);
}

export function getTokenFeeds(chainId: number) {
  return priceFeeds.filter(f => f.chainId === chainId && f.type === 'crypto');
}

export function getFiatFeeds(chainId: number) {
  return priceFeeds.filter(f => f.chainId === chainId && f.type === 'fiat');
}

export function getFiatCurrency(symbol: string) {
  return fiatCurrencies.find(
    c => c.symbol.toLowerCase() === symbol.toLowerCase()
  );
}

export function getPriceFeed(
  chainId: number,
  baseSymbol: string,
  quoteSymbol?: string
) {
  const _quoteSymbol = quoteSymbol ? quoteSymbol : 'USD';
  const feed = priceFeeds.find(
    f =>
      f.input?.toLowerCase() === baseSymbol.toLowerCase() &&
      f.output === _quoteSymbol &&
      f.chainId === chainId
  );
  if (feed) {
    return feed;
  } else {
    // feed not found, find any feed that matches the base symbol
    return priceFeeds.find(
      f =>
        f.input?.toLowerCase() === baseSymbol.toLowerCase() &&
        f.chainId === chainId
    );
  }
}

export function getFeaturedTokenBySymbol(
  tokenSymbol: string,
  chainId?: number
): TokenInfo | null {
  return (
    (featuredTokenlist.tokens.find((token: any) => {
      return (
        token.symbol.toLowerCase() === tokenSymbol.toLowerCase() &&
        (!chainId || token.chainId === chainId)
      );
    }) as TokenInfo) ?? null
  );
}

export function getTokenBySymbol(
  tokenSymbol: string,
  chainId?: number
): TokenInfo | null {
  const tokens = tokenlist.filter((token: any) => {
    return (
      token.symbol.toLowerCase() === tokenSymbol.toLowerCase() &&
      (!chainId || token.chainId === chainId)
    );
  }) as TokenInfo[];

  if (tokens && tokens.length > 1) {
    throw new Error(`Duplicate tokens found for symbol ${tokenSymbol}`);
  }

  return tokens.length > 0 ? tokens[0] : null;
}

export function getTokens(chainId: number): TokenInfo[] {
  return tokenlist.filter((needle: any) => {
    return needle.chainId === chainId;
  }) as TokenInfo[];
}

export function getFaucetAddress(tokenInfo: TokenInfo): TestnetFaucetInfo {
  return testnetfaucets.faucets.find((needle: any) => {
    return (
      needle.token.toLowerCase() === tokenInfo.address.toLowerCase() &&
      needle.chainId === tokenInfo.chainId
    );
  }) as TestnetFaucetInfo;
}

export function getRouters(chainId: number): RouterInfo[] {
  return routerlist.routers.filter((needle: any) => {
    return needle.chainId === chainId;
  }) as RouterInfo[];
}

export function getRouter(chainId: number, version: string): RouterInfo {
  return routerlist.routers.find((needle: any) => {
    return needle.chainId === chainId && needle.version === version;
  }) as RouterInfo;
}

export function getLatestRouter(chainId: number): RouterInfo {
  const sorted = getRouters(chainId).sort((a, b) => {
    return Date.parse(a.timestamp) - Date.parse(b.timestamp);
  });
  return sorted[sorted.length - 1];
}

export function getShortNames(): string[] {
  return chainlist.chains.map(chain => chain.shortName);
}
