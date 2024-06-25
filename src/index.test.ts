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
      '0x2BaE9Bb53BCe89c760dBfA55D854D43ab96EE19f'
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

    const agEurFeed = getPriceFeed(1, 'AGEUR', 'EUR');
    expect(agEurFeed?.address).toBe(
      '0xb4d5289C58CE36080b0748B47F859D8F50dFAACb'
    );

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

    const tokenFeeds = getTokenFeeds(1);
    expect(tokenFeeds[0].name).toBe('1INCH / ETH');
  });
});
