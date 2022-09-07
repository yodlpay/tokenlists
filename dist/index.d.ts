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
export declare function getChain(chainId: number): {
    chainId: number;
    logoURI: string;
    rpcUrls: string[];
    explorerURL: string;
    timestamp: string;
} | undefined;
export declare function getTokens(chainId: number): {
    chainId: number;
    address: string;
    decimals: number;
    name: string;
    symbol: string;
    tags: string[];
    logoURI: string;
}[];
export declare function getRouters(chainId: number): {
    chainId: number;
    address: string;
    timestamp: string;
}[];
