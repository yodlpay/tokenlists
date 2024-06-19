import * as fs from 'fs';
import * as path from 'path';
import { ChainInfo } from '../src/types';
import {
  CHAIN_MAPPINGS,
  CONFLICT_OVERRIDES,
  resolveChainData,
  resolveTokens,
  fetchChainLinkFeed,
  splitFeeds,
  setTimestamp,
  getTimestamp,
} from './update';

describe('Parse saved page', () => {
  const fakeChainLinkFetch = async (chainName: string) => {
    const jsonFile = path.resolve(__dirname, 'data/feeds-mainnet.json');
    const jsonBuf = fs.readFileSync(jsonFile);
    return JSON.parse(jsonBuf.toString());
  };

  test('finds 131 feeds', async () => {
    const feeds = await fetchChainLinkFeed(
      CHAIN_MAPPINGS[0].chainLink,
      fakeChainLinkFetch
    );

    expect(feeds.length === 131);
    const [fiatFeeds, tokenFeeds] = splitFeeds(feeds, 1);

    expect(fiatFeeds[0].name === 'AUD / USD');
    expect(fiatFeeds[fiatFeeds.length - 1].name === 'TRY / USD');
    expect(fiatFeeds.length == 12);

    expect(tokenFeeds[0].name === '1INCH / ETH');
    expect(tokenFeeds[tokenFeeds.length - 1].name === 'weETH / ETH');
    expect(tokenFeeds.length == 41);
    const oneInch = feeds[0]!;

    expect(oneInch.pair === '1INCH / ETH');
    expect(oneInch.deviation === 2);
    expect(oneInch.address === '0x72afaecf99c9d9c8215ff44c77b94b99c28741e8');
    expect(oneInch.decimals === 18);
    expect(oneInch.name === '1inch');
    expect(oneInch.type === 'crypto');
  });

  test('Sets correct values for priceFeeds and tokenFeeds', async () => {
    const chainData = JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, '../src/chainlist-v1.json'))
        .toString()
    );
    const chain = chainData.chains.find(c => c.chainId === 1)! as ChainInfo;
    setTimestamp();
    const [updatedChain, fiatFeeds, tokenSymbolList] = await resolveChainData(
      chain,
      fakeChainLinkFetch
    );
    expect(tokenSymbolList[0] === '1INCH');
    expect(tokenSymbolList[tokenSymbolList.length - 1] === 'ZRX');

    expect(updatedChain.timestamp === getTimestamp());
    expect(updatedChain.priceFeeds).toEqual({
      AUD: '0x77F9710E7d0A19669A13c055F62cd80d313dF022',
      CAD: '0xa34317DB73e77d453b1B8d04550c44D10e981C8e',
      CHF: '0x449d117117838fFA61263B61dA6301AA2a88B13A',
      CNY: '0xeF8A4aF35cd47424672E3C590aBD37FBB7A7759a',
      EUR: '0xb49f677943BC038e9857d61E7d053CaA2C1734C1',
      GBP: '0x5c0Ab2d9b5a7ed9f470386e82BB36A3613cDd4b5',
      IDR: '0x91b99C9b75aF469a71eE1AB528e8da994A5D7030',
      JPY: '0xBcE206caE7f0ec07b545EddE332A47C2F75bbeb3',
      KRW: '0x01435677FB11763550905594A16B645847C1d0F3',
      NZD: '0x3977CFc9e4f29C184D4675f4EB8e0013236e5f3e',
      SGD: '0xe25277fF4bbF9081C75Ab0EB13B4A13a721f3E13',
      TRY: '0xB09fC5fD3f11Cf9eb5E1C5Dba43114e3C9f477b5',
    });
    expect(
      updatedChain.tokenFeeds['1INCH'] ===
        '0x72AFAECF99C9d9C8215fF44C77B94B99C28741e8'
    );
    expect(
      updatedChain.tokenFeeds['AAVE'] ===
        '0x6Df09E975c830ECae5bd4eD9d90f3A95a4f88012'
    );
    expect(Object.keys(updatedChain.tokenFeeds).length == 41);
    expect(fiatFeeds.length == 12);
    expect(fiatFeeds[0].name == 'AUD / USD');
    expect(fiatFeeds[fiatFeeds.length - 1].name == 'TRY / USD');
  });

  test('Correctly parses all tokens', async () => {
    const fakeTokensFetch = async (chainName: string) => {
      const jsonFile = path.resolve(__dirname, 'data/coingecko-ethereum.json');
      const jsonBuf = fs.readFileSync(jsonFile);
      return JSON.parse(jsonBuf.toString());
    };

    const chainData = JSON.parse(
      fs
        .readFileSync(path.resolve(__dirname, '../src/chainlist-v1.json'))
        .toString()
    );
    const chain = chainData.chains.find(c => c.chainId === 1)! as ChainInfo;
    setTimestamp();
    const [updatedChain, fiatFeeds, tokenSymbolList] = await resolveChainData(
      chain,
      fakeChainLinkFetch
    );

    const tokens = await resolveTokens(
      chain.chainId,
      tokenSymbolList,
      fakeTokensFetch
    );
    expect(tokens.length === 54);
    tokenSymbolList.forEach(symbol => {
      expect(tokens.filter(t => t.symbol === symbol).length === 1);
    });
    const bnbTokens = tokens.filter(t => t.symbol === 'BNB');
    expect(bnbTokens.length === 1);
    expect(bnbTokens[0].address === CONFLICT_OVERRIDES[1]['BNB']);
  });
});
