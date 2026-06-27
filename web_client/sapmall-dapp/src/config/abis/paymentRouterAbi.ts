/** PaymentRouter 最小 ABI — 供 dapp 调用 payOrder 与校验 paymentToken */
export const paymentRouterAbi = [
  {
    type: 'function',
    name: 'payOrder',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'intentId', type: 'string' },
      { name: 'orderRef', type: 'string' },
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
  {
    type: 'function',
    name: 'paymentToken',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
  },
  {
    type: 'function',
    name: 'expectedChainId',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'isTokenSupported',
    stateMutability: 'view',
    inputs: [
      { name: 'chainId', type: 'uint256' },
      { name: 'token', type: 'address' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    type: 'function',
    name: 'isIntentPaid',
    stateMutability: 'view',
    inputs: [{ name: 'intentId', type: 'string' }],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;
