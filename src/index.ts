import tokenlist from './tokenlist-v1.json';
import chainlist from './chainlist-v1.json';
import routerlist from './routerlist-v1.json';
import tokenschema from './tokenlist-v1.json';
import { ChainInfo, RouterInfo, TokenInfo } from './types';

export * from './types';
export * from './isVersionUpdate';
export * from './getVersionUpgrade';
export * from './diffTokenLists';
export * from './minVersionBump';
export * from './nextVersion';
export * from './versionComparator';

export { tokenschema, tokenlist, chainlist, routerlist };

export function getChain(chainId: number): ChainInfo {
  return chainlist.chains.find((needle: any) => {
    return needle.chainId === chainId;
  }) as ChainInfo;
}

export function getTokens(chainId: number): TokenInfo[] {
  return tokenlist.tokens.filter((needle: any) => {
    return needle.chainId === chainId;
  }) as TokenInfo[];
}

export function getRouters(chainId: number): RouterInfo[] {
  return routerlist.routers.filter((needle: any) => {
    return needle.chainId === chainId;
  }) as RouterInfo[];
}

export function latestRouter(chainId: number): RouterInfo {
  const sorted = getRouters(chainId).sort((a, b) => {
    return Date.parse(a.timestamp) - Date.parse(b.timestamp);
  });
  return sorted[sorted.length - 1];
}
