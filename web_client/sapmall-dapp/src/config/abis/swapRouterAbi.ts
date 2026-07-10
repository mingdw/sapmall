/** SAPSwapRouter ABI — 供兑换页调用 swap / quoteSwap / 读取配置 */
export const swapRouterAbi = [
  {
    type: 'function',
    name: 'swap',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'direction', type: 'uint8' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'quoteSwap',
    stateMutability: 'view',
    inputs: [
      { name: 'tokenIn', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'direction', type: 'uint8' },
    ],
    outputs: [
      { name: 'amountOut', type: 'uint256' },
      { name: 'fee', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getSupportedStablecoins',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address[]' }],
  },
  {
    type: 'function',
    name: 'getStablecoinConfig',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [
      { name: 'decimals', type: 'uint8' },
      { name: 'symbol', type: 'string' },
      { name: 'rateToSAP', type: 'uint256' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  {
    type: 'function',
    name: 'isStablecoinSupported',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'getSwapStats',
    stateMutability: 'view',
    inputs: [],
    outputs: [
      { name: 'totalSAPMinted', type: 'uint256' },
      { name: 'totalStablecoinReceived', type: 'uint256' },
      { name: 'totalFeesCollected', type: 'uint256' },
    ],
  },
  {
    type: 'function',
    name: 'getStablecoinBalance',
    stateMutability: 'view',
    inputs: [{ name: 'token', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'totalWithdrawn',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'MIN_SWAP_AMOUNT',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'function',
    name: 'feeBps',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    type: 'event',
    name: 'Swap',
    inputs: [
      { name: 'user', type: 'address', indexed: true },
      { name: 'direction', type: 'uint8', indexed: false },
      { name: 'tokenIn', type: 'address', indexed: false },
      { name: 'tokenOut', type: 'address', indexed: false },
      { name: 'amountIn', type: 'uint256', indexed: false },
      { name: 'amountOut', type: 'uint256', indexed: false },
      { name: 'fee', type: 'uint256', indexed: false },
      { name: 'timestamp', type: 'uint256', indexed: false },
    ],
  },
] as const;

/** SwapDirection enum values matching the Solidity enum */
export const SwapDirection = {
  STABLE_TO_SAP: 0,
  SAP_TO_STABLE: 1,
} as const;
