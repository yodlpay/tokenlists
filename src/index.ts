import tokenlist from "./tokenlist-v1.json";
import chainlist from "./chainlist-v1.json";
import routerlist from "./routerlist-v1.json";
import tokenschema from "./tokenlist-v1.json";

export * from "./types";
export * from "./isVersionUpdate";
export * from "./getVersionUpgrade";
export * from "./diffTokenLists";
export * from "./minVersionBump";
export * from "./nextVersion";
export * from "./versionComparator";

export { tokenschema, tokenlist, chainlist, routerlist };

export function getChain(chainId: number) {
  return chainlist.chains.find((needle: any) => {
    return needle.chainId === chainId;
  });
}

export function getTokens(chainId: number) {
  return tokenlist.tokens.filter((needle: any) => {
    return needle.chainId === chainId;
  });
}

export function getRouters(chainId: number) {
  return routerlist.routers.filter((needle: any) => {
    return needle.chainId === chainId;
  });
}
