import type {
  TxType,
  TxStatus,
  TxDirection,
  TokenSymbol,
  TxRecord,
  TxSummary,
  ChainInfo,
} from './types';

// ========== 链网络 ==========

export const CHAIN_LIST: ChainInfo[] = [
  { chainId: 5042002, chainName: 'Arc Testnet', nativeSymbol: 'USDC', explorerUrl: 'https://testnet.arcscan.io' },
  { chainId: 59141, chainName: 'Linea Sepolia', nativeSymbol: 'ETH', explorerUrl: 'https://sepolia.lineascan.build' },
  { chainId: 84532, chainName: 'Base Sepolia', nativeSymbol: 'ETH', explorerUrl: 'https://sepolia.basescan.org' },
];

export const CHAIN_MAP: Record<number, ChainInfo> = Object.fromEntries(
  CHAIN_LIST.map((c) => [c.chainId, c]),
);

// ========== 标签映射 ==========

export const TX_TYPE_LABELS: Record<TxType, string> = {
  payment: '商品支付',
  refund: '退款',
  swap: '兑换',
  transfer: '转账',
  stake: '质押',
  unstake: '解除质押',
  claim: '领取奖励',
  approval: '授权',
  contract: '合约交互',
};

export const TX_TYPE_ICONS: Record<TxType, string> = {
  payment: 'fas fa-shopping-cart',
  refund: 'fas fa-undo',
  swap: 'fas fa-exchange-alt',
  transfer: 'fas fa-paper-plane',
  stake: 'fas fa-lock',
  unstake: 'fas fa-lock-open',
  claim: 'fas fa-gift',
  approval: 'fas fa-check-double',
  contract: 'fas fa-file-code',
};

export const TX_TYPE_COLORS: Record<TxType, { bg: string; color: string }> = {
  payment:    { bg: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa' },
  refund:     { bg: 'rgba(52, 211, 153, 0.12)', color: '#34d399' },
  swap:       { bg: 'rgba(167, 139, 250, 0.12)', color: '#a78bfa' },
  transfer:   { bg: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' },
  stake:      { bg: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' },
  unstake:    { bg: 'rgba(253, 186, 116, 0.12)', color: '#fdba74' },
  claim:      { bg: 'rgba(16, 185, 129, 0.12)', color: '#10b981' },
  approval:   { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8' },
  contract:   { bg: 'rgba(244, 114, 182, 0.12)', color: '#f472b6' },
};

export const TX_STATUS_LABELS: Record<TxStatus, string> = {
  success: '成功',
  pending: '确认中',
  failed: '失败',
  dropped: '已丢弃',
};

export const TX_DIRECTION_LABELS: Record<TxDirection, string> = {
  in: '转入',
  out: '转出',
  self: '内部',
};

export const TX_DIRECTION_ICONS: Record<TxDirection, string> = {
  in: 'fas fa-arrow-down-left',
  out: 'fas fa-arrow-up-right',
  self: 'fas fa-arrows-rotate',
};

export const TX_DIRECTION_COLORS: Record<TxDirection, { bg: string; color: string }> = {
  in:   { bg: 'rgba(52, 211, 153, 0.12)', color: '#34d399' },
  out:  { bg: 'rgba(248, 113, 113, 0.12)', color: '#f87171' },
  self: { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8' },
};

export const TOKEN_LABELS: Record<TokenSymbol, string> = {
  SAP: 'SAP',
  USDC: 'USDC',
  EURC: 'EURC',
  cirBTC: 'cirBTC',
  ETH: 'ETH',
};

// ========== Mock 统计 ==========

export const mockTxSummary: TxSummary = {
  totalCount: 48,
  successCount: 42,
  pendingCount: 2,
  failedCount: 4,
  totalVolumeUSD: 28450.75,
  totalGasFeeUSD: 12.86,
  successRate: 87.5,
  avgGasFeeUSD: 0.27,
};

// ========== Mock 交易记录 ==========

const WALLET = '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f';

export const mockTxRecords: TxRecord[] = [
  {
    id: 1, txHash: '0x7f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f8f5a2e45c0d3c9f0acef4e70',
    type: 'swap', direction: 'self', from: WALLET, to: '0xSwapRouter2Ae3...8Bf1',
    contractAddress: '0xSAPSwapRouter0000000000000000000000000000008Bf1',
    methodName: 'swapExactTokensForTokens', amount: 1000, tokenSymbol: 'USDC', tokenDecimals: 6,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1234567,
    confirmations: 124, nonce: 87, gasUsed: 145000, gasPrice: 0.8, gasFeeNative: 0.000116,
    gasFeeUSD: 0.12, timestamp: '2026-07-09 14:30:25', memo: '1000 USDC → 100,000 SAP',
  },
  {
    id: 2, txHash: '0x3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b',
    type: 'payment', direction: 'out', from: WALLET, to: '0xPaymentRouter7c3...4D9e',
    contractAddress: '0xPaymentRouter000000000000000000000000000004D9e',
    methodName: 'payOrder', amount: 129.9, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1234580,
    confirmations: 89, nonce: 88, gasUsed: 92000, gasPrice: 0.8, gasFeeNative: 0.0000736,
    gasFeeUSD: 0.08, timestamp: '2026-07-09 12:15:10', memo: '商品订单支付', orderId: 'ORD-20260709-001',
  },
  {
    id: 3, txHash: '0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d',
    type: 'claim', direction: 'in', from: '0xRewardPoolA1b2...c3D4', to: WALLET,
    contractAddress: '0xRewardPool000000000000000000000000000000c3D4',
    methodName: 'claimReward', amount: 25.3, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1234500,
    confirmations: 189, nonce: 86, gasUsed: 68000, gasPrice: 0.8, gasFeeNative: 0.0000544,
    gasFeeUSD: 0.06, timestamp: '2026-07-08 16:45:30', memo: '社区活动奖励',
  },
  {
    id: 4, txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    type: 'refund', direction: 'in', from: '0xPaymentRouter7c3...4D9e', to: WALLET,
    contractAddress: '0xPaymentRouter000000000000000000000000000004D9e',
    methodName: 'refundOrder', amount: 89.5, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1234400,
    confirmations: 289, nonce: 85, gasUsed: 78000, gasPrice: 0.8, gasFeeNative: 0.0000624,
    gasFeeUSD: 0.07, timestamp: '2026-07-07 11:20:00', memo: '订单退款', orderId: 'ORD-20260705-002',
  },
  {
    id: 5, txHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e',
    type: 'payment', direction: 'out', from: WALLET, to: '0xPaymentRouter7c3...4D9e',
    contractAddress: '0xPaymentRouter000000000000000000000000000004D9e',
    methodName: 'payOrder', amount: 45.0, tokenSymbol: 'USDC', tokenDecimals: 6,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'pending', blockNumber: 1234300,
    confirmations: 3, nonce: 89, gasUsed: 0, gasPrice: 0.8, gasFeeNative: 0,
    gasFeeUSD: 0, timestamp: '2026-07-06 13:22:15', memo: '商品订单支付（确认中）', orderId: 'ORD-20260706-001',
  },
  {
    id: 6, txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
    type: 'swap', direction: 'self', from: WALLET, to: '0xSwapRouter2Ae3...8Bf1',
    contractAddress: '0xSAPSwapRouter0000000000000000000000000000008Bf1',
    methodName: 'swapExactTokensForTokens', amount: 500, tokenSymbol: 'USDC', tokenDecimals: 6,
    chainId: 59141, chainName: 'Linea Sepolia', status: 'success', blockNumber: 9876543,
    confirmations: 120, nonce: 42, gasUsed: 152000, gasPrice: 1.2, gasFeeNative: 0.0001824,
    gasFeeUSD: 0.42, timestamp: '2026-07-05 09:10:00', memo: '500 USDC → 50,000 SAP',
  },
  {
    id: 7, txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a',
    type: 'stake', direction: 'out', from: WALLET, to: '0xStakingVaultF5e...a1B2',
    contractAddress: '0xStakingVault0000000000000000000000000000a1B2',
    methodName: 'stake', amount: 2000, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1234200,
    confirmations: 350, nonce: 84, gasUsed: 110000, gasPrice: 0.8, gasFeeNative: 0.000088,
    gasFeeUSD: 0.09, timestamp: '2026-07-04 15:30:00', memo: '质押 2000 SAP',
  },
  {
    id: 8, txHash: '0xf0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d',
    type: 'payment', direction: 'out', from: WALLET, to: '0xPaymentRouter7c3...4D9e',
    contractAddress: '0xPaymentRouter000000000000000000000000000004D9e',
    methodName: 'payOrder', amount: 230.0, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'failed', blockNumber: 1234050,
    confirmations: 0, nonce: 83, gasUsed: 21000, gasPrice: 0.8, gasFeeNative: 0.0000168,
    gasFeeUSD: 0.02, timestamp: '2026-07-03 10:00:00', memo: '支付失败 — 余额不足', orderId: 'ORD-20260703-001',
  },
  {
    id: 9, txHash: '0xa1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    type: 'unstake', direction: 'in', from: '0xStakingVaultF5e...a1B2', to: WALLET,
    contractAddress: '0xStakingVault0000000000000000000000000000a1B2',
    methodName: 'unstake', amount: 500, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1233900,
    confirmations: 420, nonce: 82, gasUsed: 95000, gasPrice: 0.8, gasFeeNative: 0.000076,
    gasFeeUSD: 0.08, timestamp: '2026-07-02 18:00:00', memo: '解除质押 500 SAP',
  },
  {
    id: 10, txHash: '0xb2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    type: 'transfer', direction: 'out', from: WALLET, to: '0xbob3th0wR1...d4E5f6',
    amount: 100, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 59141, chainName: 'Linea Sepolia', status: 'success', blockNumber: 9876000,
    confirmations: 200, nonce: 41, gasUsed: 21000, gasPrice: 1.2, gasFeeNative: 0.0000252,
    gasFeeUSD: 0.06, timestamp: '2026-07-01 09:45:00', memo: '转账给 bob_eth',
  },
  {
    id: 11, txHash: '0xc3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
    type: 'approval', direction: 'self', from: WALLET, to: '0xSwapRouter2Ae3...8Bf1',
    contractAddress: '0xSAPSwapRouter0000000000000000000000000000008Bf1',
    methodName: 'approve', amount: 0, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1233800,
    confirmations: 480, nonce: 81, gasUsed: 46000, gasPrice: 0.8, gasFeeNative: 0.0000368,
    gasFeeUSD: 0.04, timestamp: '2026-06-30 14:00:00', memo: '授权 SwapRouter 使用 SAP',
  },
  {
    id: 12, txHash: '0xd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    type: 'contract', direction: 'self', from: WALLET, to: '0xPlatformConfig3...c2B3',
    contractAddress: '0xPlatformConfig000000000000000000000000000c2B3',
    methodName: 'updateFeeRate', amount: 0, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1233700,
    confirmations: 520, nonce: 80, gasUsed: 38000, gasPrice: 0.8, gasFeeNative: 0.0000304,
    gasFeeUSD: 0.03, timestamp: '2026-06-29 11:30:00', memo: '更新平台费率配置',
  },
  {
    id: 13, txHash: '0xe5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    type: 'claim', direction: 'in', from: '0xRewardPoolA1b2...c3D4', to: WALLET,
    contractAddress: '0xRewardPool000000000000000000000000000000c3D4',
    methodName: 'claimReward', amount: 15.7, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 59141, chainName: 'Linea Sepolia', status: 'success', blockNumber: 9875500,
    confirmations: 300, nonce: 40, gasUsed: 65000, gasPrice: 1.2, gasFeeNative: 0.000078,
    gasFeeUSD: 0.18, timestamp: '2026-06-28 09:00:00', memo: '交易返佣奖励',
  },
  {
    id: 14, txHash: '0xf6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    type: 'swap', direction: 'self', from: WALLET, to: '0xSwapRouter2Ae3...8Bf1',
    contractAddress: '0xSAPSwapRouter0000000000000000000000000000008Bf1',
    methodName: 'swapExactETHForTokens', amount: 0.5, tokenSymbol: 'ETH', tokenDecimals: 18,
    chainId: 59141, chainName: 'Linea Sepolia', status: 'failed', blockNumber: 9875400,
    confirmations: 0, nonce: 39, gasUsed: 21000, gasPrice: 1.5, gasFeeNative: 0.0000315,
    gasFeeUSD: 0.07, timestamp: '2026-06-27 16:20:00', memo: '兑换失败 — 滑点过高',
  },
  {
    id: 15, txHash: '0xa7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    type: 'transfer', direction: 'in', from: '0xcarol_dao7E3...f8G9', to: WALLET,
    amount: 50, tokenSymbol: 'SAP', tokenDecimals: 18,
    chainId: 5042002, chainName: 'Arc Testnet', status: 'success', blockNumber: 1233600,
    confirmations: 580, nonce: 0, gasUsed: 21000, gasPrice: 0.8, gasFeeNative: 0.0000168,
    gasFeeUSD: 0.02, timestamp: '2026-06-26 10:15:00', memo: '收到 carol_dao 转账',
  },
];
