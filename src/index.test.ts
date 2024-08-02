import {
  getTokens,
  getChain,
  getChains,
  getTokenByAddress,
  getTokenBySymbol,
  getRouter,
  getLatestRouter,
  getPriceFeed,
  getPriceFeeds,
  getFiatCurrency,
  getFiatFeeds,
  getTokenFeeds,
  getRouters,
  getRouterByAddress,
  getNativeWrappedToken,
} from '../src';

describe('Test basic functionality', () => {
  test('getters', () => {
    const baseChain = getChains().find(c => c.chainName === 'Base')!;
    expect(baseChain.chainId === 8453);

    const chain = getChain(1);
    expect(chain.chainName).toBe('Ethereum');
    const tokens = getTokens(1);
    const eth = tokens.find(t => t.symbol === 'ETH');
    expect(eth?.address.toLowerCase()).toBe(
      '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
    );
    const token = getTokenByAddress(
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      1
    );
    expect(token?.name).toBe('Ether');

    const allTokens = getTokens();
    expect(allTokens[0].chainId).toBe(1);

    expect(getTokenBySymbol('ZZZZZZZZZZ', 1)).toBeNull();
    expect(getTokenBySymbol('ETH', 1)?.symbol).toBe('ETH');

    // ensure we can find a token from generated list
    expect(getTokenBySymbol('BNB', 1)?.address).toBe(
      '0xb8c77482e45f1f44de1745f52c74426c631bdd52'
    );

    const opRouter = getRouter(10, '0.2');
    expect(opRouter!.address).toBe(
      '0x408EB3F5A578b3eEcFe2c0cD58988fAb306885b4'
    );

    const latestOpRouter = getLatestRouter(10);
    expect(latestOpRouter.address).toBe(
      '0x42EcF39814824a684529d57e1635D30a90Fb9c33'
    );

    const allRouters = getRouters(1);
    expect(allRouters[0].address).toBe(
      '0x4cafd841df0df6da5739f729491887d64ad2794c'
    );

    const firstRouter = getRouterByAddress(
      '0x4cafd841df0df6da5739f729491887d64ad2794c'
    );
    expect(firstRouter?.chainId).toBe(1);

    const secondRouter = getRouterByAddress(
      '0x3E30748c33981E97CBA36d4Fc5eD0237E8Bab52A',
      1
    );
    expect(secondRouter?.version).toBe('0.3');


    const nextRouter = getRouterByAddress(
      '0x0642f4e4fcfa014db0134d6c96accbb2bdd77ba4'
    );
    expect(nextRouter?.chainId).toBe(137);

    const feed = getPriceFeed(1, 'ETH');
    expect(feed?.address === '0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419');

    const jpyFeed = getPriceFeed(1, 'JPY');
    expect(jpyFeed?.address).toBe('0xBcE206caE7f0ec07b545EddE332A47C2F75bbeb3');

    const pricefeeds = getPriceFeeds(1);
    expect(pricefeeds.length === 131);

    const jpy = getFiatCurrency('JPY');
    expect(jpy?.symbol).toBe('JPY');
    expect(jpy?.sign).toBe('¥');

    const fiatFeeds = getFiatFeeds(1);
    expect(fiatFeeds[0].name).toBe('AUD / USD');

    // const tokenFeeds = getTokenFeeds(1);
    // expect(tokenFeeds[0].name).toBe('1INCH / ETH');
  });
  test('test fetching native wrapped token', () => {
    const weth = getNativeWrappedToken(1);
    expect(weth.address).toBe('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');

    const wmatic = getNativeWrappedToken(137);
    expect(wmatic.address).toBe('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270');

    const wethArb = getNativeWrappedToken(42161);
    expect(wethArb.address).toBe('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1');

    const wethOp = getNativeWrappedToken(10);
    expect(wethOp.address).toBe('0x4200000000000000000000000000000000000006');

    const wethBase = getNativeWrappedToken(8453);
    expect(wethBase.address).toBe('0x4200000000000000000000000000000000000006');

    const wXDAI = getNativeWrappedToken(100);
    expect(wXDAI.address).toBe('0xe91d153e0b41518a2ce8dd3d7944fa863463a97d');

    const wBNB = getNativeWrappedToken(56);
    expect(wBNB.address).toBe('0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c');

    expect(() => getNativeWrappedToken(999999)).toThrow(Error);
  });
});
