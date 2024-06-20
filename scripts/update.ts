import * as fs from 'fs';
import * as path from 'path';
import { ChainInfo, FiatCurrency, TokenInfo } from '../src/types';
import {
  CHAIN_MAPPINGS,
  setTimestamp,
  resolveChainData,
  resolveTokens,
  hydrateFiatCurrencies,
  getTimestamp,
} from 'update';
import dotenv from 'dotenv';

const objectsAreEqual = (obj1, obj2) => {
  return JSON.stringify(obj1, null, 2) === JSON.stringify(obj2, null, 2);
};

const readFiatCurrencies = () => {
  const fiatCurrenciesFile = path.resolve(
    __dirname,
    '../src/fiatCurrencies.json'
  );
  if (!fs.existsSync(fiatCurrenciesFile)) {
    return [];
  }
  const fiatCurrencies = JSON.parse(
    fs.readFileSync(fiatCurrenciesFile).toString()
  );
  return fiatCurrencies;
};

const readPriceFeeds = () => {
  const priceFeedsFile = path.resolve(__dirname, '../src/pricefeeds.json');
  if (!fs.existsSync(priceFeedsFile)) {
    return [];
  }
  const feeds = JSON.parse(fs.readFileSync(priceFeedsFile).toString());
  return feeds;
};

const readTokens = () => {
  const tokensFile = path.resolve(__dirname, '../src/tokenlist-generated.json');
  if (!fs.existsSync(tokensFile)) {
    return [];
  }
  const tokens = JSON.parse(fs.readFileSync(tokensFile).toString());
  return tokens.tokens;
};

const writeTokensIfChanged = (tokens: any, oldTokens: any) => {
  if (objectsAreEqual(tokens, oldTokens)) {
    console.log(
      'The tokens list has not changed. Not incrementing the version number. Not writing to file'
    );
  } else {
    console.log('The token list has changed');
    const tokenObj = { timestamp: getTimestamp(), tokens: tokens };
    fs.writeFileSync(
      path.resolve(__dirname, '../src/tokenlist-generated.json'),
      JSON.stringify(tokenObj, null, 2)
    );
  }
};

const writeFiatCurrenciesIfChanged = (
  fiatCurrencies: any,
  oldFiatCurrencies: any
) => {
  if (objectsAreEqual(fiatCurrencies, oldFiatCurrencies)) {
    console.log(
      'The fiatCurrencies list has not changed. Not incrementing the version number. Not writing to file'
    );
  } else {
    console.log('The fiat currency list has changed');
    fs.writeFileSync(
      path.resolve(__dirname, '../src/fiatCurrencies.json'),
      JSON.stringify(fiatCurrencies, null, 2)
    );
  }
};

const writePriceFeedsIfChanged = (newPriceFeeds, oldPriceFeeds) => {
  if (objectsAreEqual(newPriceFeeds, oldPriceFeeds)) {
    console.log('The pricefeeds list has not changed. Not writing to file');
  } else {
    console.log('The pricefeeds list has changed');
    fs.writeFileSync(
      path.resolve(__dirname, '../src/pricefeeds.json'),
      JSON.stringify(newPriceFeeds, null, 2)
    );
  }
};

const loadDotEnv = () => {
  const envFile = path.resolve(__dirname, '../.env');
  if (!fs.existsSync(envFile)) {
    throw new Error('Cannot load .env file');
  }
  dotenv.config();
};

async function run() {
  loadDotEnv();
  setTimestamp();
  const chainIds = CHAIN_MAPPINGS.map(m => m.chainId);
  const oldFiatCurrencies = readFiatCurrencies();
  const oldPriceFeeds = readPriceFeeds();
  const oldTokens = readTokens();
  let allFiatSymbols = new Set<string>();
  let allPriceFeeds = [];
  let allTokens = [] as TokenInfo[];

  for (const chainId of chainIds) {
    const [fiatFeeds, tokenFeeds, tokenSymbolList] = await resolveChainData(
      chainId
    );

    const tokens = await resolveTokens(chainId, tokenSymbolList);

    fiatFeeds.forEach(f => allFiatSymbols.add(f.assetName));
    allPriceFeeds = allPriceFeeds.concat(fiatFeeds, tokenFeeds);
    allTokens = allTokens.concat(tokens);
  }
  const fiatCurrencies = await hydrateFiatCurrencies(
    Array.from(allFiatSymbols)
  );

  writeFiatCurrenciesIfChanged(fiatCurrencies, oldFiatCurrencies);
  writePriceFeedsIfChanged(allPriceFeeds, oldPriceFeeds);
  writeTokensIfChanged(allTokens, oldTokens);
}

run()
  .then(() => {
    console.log('complete');
    process.exit(0);
  })
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
