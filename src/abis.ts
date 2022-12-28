export const abis = {
  '0_1': [
    'function payWithToken(bytes32 _memo, uint256 _amount, address[] _priceFeeds, address _token, address _receiver, address _extraFeeReceiver, uint256 _extraFeeDivisor) returns (bool)',
    'event Payment(address indexed sender, address indexed receiver, address token, uint256 amount, uint256 fees, bytes32 memo)',
    'event Convert(address indexed priceFeed, int256 price)',
  ],
};
