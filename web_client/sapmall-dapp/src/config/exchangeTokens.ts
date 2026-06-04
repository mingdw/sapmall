/** 兑换页 SwapCard 支持的上游代币（Base Sepolia / Linea Sepolia 结算页同源） */
export const EXCHANGE_SWAP_TOKENS = ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB', 'SOL'] as const;

export type ExchangeSwapToken = (typeof EXCHANGE_SWAP_TOKENS)[number];
