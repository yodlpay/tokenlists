import * as fs from 'fs';
import * as path from 'path';
import { ChainInfo } from '../src/types';
import {
  CHAIN_MAPPINGS,
  setTimestamp,
  resolveChainData,
  resolveTokens,
} from 'update';

async function run() {
  const chainIds = [56]; //CHAIN_MAPPINGS.map(m => m.chainId);

  const chainData = JSON.parse(
    fs
      .readFileSync(path.resolve(__dirname, '../src/chainlist-v1.json'))
      .toString()
  );
  for (const chainId of chainIds) {
    const chainInfo = chainData.chains.find(
      c => c.chainId === chainId
    )! as ChainInfo;
    setTimestamp();
    const [
      updatedChainInfo,
      fiatFeeds,
      tokenSymbolList,
    ] = await resolveChainData(chainInfo);

    // Coingecko doesn't provide data for gnosis
    if (chainId != 100) {
      const tokens = await resolveTokens(chainInfo.chainId, tokenSymbolList);
      const eth = tokens.filter(t => t.symbol == 'ETH');
    }
  }
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
