import { getFaucetAddress, getTokens } from '../src';

describe('testnetFaucets', () => {
  it('getFaucetAddress() works', () => {
    const token = getTokens(43113).find(t => {
      return t.address === '0x2601Df86814DcC0F3f98C7Ab97176ae19713503d';
    });

    if (!token) {
      throw 'token not found';
    }

    const faucet = getFaucetAddress(token);

    expect(faucet.address).toEqual(
      '0xC0efF52B3f06B7255ce51FBbF034a70DA037cDBC'
    );
  });
});
