import { getFaucetAddress, getTokens } from '../src';

describe('testnetFaucets', () => {
  it('getFaucetAddress() works', () => {
    const token = getTokens(5).find(t => {
      return t.address === '0x33ca3889bb0032e9c3794b608a242d27e7293353';
    });

    if (!token) {
      throw 'token not found';
    }

    const faucet = getFaucetAddress(token);
    expect(faucet.address).toEqual(
      '0xd2bc1d97793763b7262987a67f1945169c763389'
    );
  });
});
