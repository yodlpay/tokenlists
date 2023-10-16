import tokenlist from './tokenlist-v1.json';
import chainlist from './chainlist-v1.json';
import routerlist from './routerlist-v1.json';
import tokenschema from './tokenlist-v1.json';
import testnetfaucets from './testnet-faucets-v1.json';
import { ChainInfo, RouterInfo, TokenInfo, TestnetFaucetInfo } from './types';

export * from './abis';
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

export function getTokenByAddress(
  tokenAddress: string,
  chainId?: number
): TokenInfo | null {
  return (
    (tokenlist.tokens.find((token: any) => {
      return (
        token.address === tokenAddress &&
        (!chainId || token.chainId === chainId)
      );
    }) as TokenInfo) ?? null
  );
}

export function getTokenBySymbol(
  tokenSymbol: string,
  chainId?: number
): TokenInfo | null {
  return (
    (tokenlist.tokens.find((token: any) => {
      return (
        token.symbol === tokenSymbol && (!chainId || token.chainId === chainId)
      );
    }) as TokenInfo) ?? null
  );
}

export function getTokens(chainId: number): TokenInfo[] {
  return tokenlist.tokens.filter((needle: any) => {
    return needle.chainId === chainId;
  }) as TokenInfo[];
}

export function getFaucetAddress(tokenInfo: TokenInfo): TestnetFaucetInfo {
  return testnetfaucets.faucets.find((needle: any) => {
    return (
      needle.token === tokenInfo.address && needle.chainId === tokenInfo.chainId
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
