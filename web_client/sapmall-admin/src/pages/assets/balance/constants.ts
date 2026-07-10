import type {
  UserProfile,
  TransactionRecord,
  AdjustmentRecord,
  TransactionType,
  TransactionStatus,
  AdjustmentType,
  AdjustmentStatus,
  UserStatus,
} from './types';

// ========== 标签映射 ==========

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  payment: '支付', refund: '退款', swap: '兑换', reward: '奖励',
};
export const TRANSACTION_TYPE_ICONS: Record<TransactionType, string> = {
  payment: 'fas fa-shopping-cart', refund: 'fas fa-undo', swap: 'fas fa-exchange-alt', reward: 'fas fa-gift',
};
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  confirmed: '已确认', pending: '确认中', failed: '失败',
};
export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  active: '正常', inactive: '未激活', frozen: '已冻结',
};
export const ADJUSTMENT_TYPE_LABELS: Record<AdjustmentType, string> = {
  credit: '充值', debit: '扣减', freeze: '冻结', unfreeze: '解冻',
};
export const ADJUSTMENT_TYPE_ICONS: Record<AdjustmentType, string> = {
  credit: 'fas fa-plus-circle', debit: 'fas fa-minus-circle',
  freeze: 'fas fa-lock', unfreeze: 'fas fa-lock-open',
};
export const ADJUSTMENT_STATUS_LABELS: Record<AdjustmentStatus, string> = {
  completed: '已完成', pending: '待审核', rejected: '已拒绝',
};

// ========== Mock 数据 — 当前登录用户 ==========

export const mockUserProfile: UserProfile = {
  userId: 'U001',
  username: 'alice_crypto',
  nickname: 'Alice',
  walletAddress: '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f',
  status: 'active',
  registeredAt: '2026-01-15',
  lastActiveAt: '2026-07-09 14:30',
  chainBalances: [
    {
      chainId: 5042002,
      chainName: 'Arc Testnet',
      nativeSymbol: 'USDC',
      tokens: [
        { symbol: 'SAP', balance: 12500.5, decimals: 18 },
        { symbol: 'USDC', balance: 3400.0, decimals: 6 },
        { symbol: 'EURC', balance: 580.0, decimals: 6 },
        { symbol: 'cirBTC', balance: 0.0125, decimals: 8 },
      ],
    },
    {
      chainId: 59141,
      chainName: 'Linea Sepolia',
      nativeSymbol: 'ETH',
      tokens: [
        { symbol: 'SAP', balance: 5600.0, decimals: 18 },
        { symbol: 'USDC', balance: 1200.0, decimals: 6 },
      ],
    },
  ],
};

export const mockTransactions: TransactionRecord[] = [
  { id: 1, txHash: '0x7f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f8f5a2e45c0d3c9f0acef4e70', type: 'swap', from: '0x8f5a...c26f', to: '0xSwap...Router', amount: 1000, tokenSymbol: 'USDC', chainId: 5042002, chainName: 'Arc Testnet', status: 'confirmed', blockNumber: 1234567, confirmations: 24, timestamp: '2026-07-09 14:30:25', memo: '1000 USDC → 100000 SAP' },
  { id: 2, txHash: '0x3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b', type: 'payment', from: '0x8f5a...c26f', to: '0xPayment...Router', amount: 129.9, tokenSymbol: 'SAP', chainId: 5042002, chainName: 'Arc Testnet', status: 'confirmed', blockNumber: 1234580, confirmations: 89, timestamp: '2026-07-09 12:15:10', memo: '商品订单支付 #ORD-20260709-001' },
  { id: 3, txHash: '0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d', type: 'reward', from: '0xReward...Pool', to: '0x8f5a...c26f', amount: 25.3, tokenSymbol: 'SAP', chainId: 5042002, chainName: 'Arc Testnet', status: 'confirmed', blockNumber: 1234500, confirmations: 189, timestamp: '2026-07-08 16:45:30', memo: '社区活动奖励' },
  { id: 4, txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c', type: 'refund', from: '0xPayment...Router', to: '0x8f5a...c26f', amount: 89.5, tokenSymbol: 'SAP', chainId: 5042002, chainName: 'Arc Testnet', status: 'confirmed', blockNumber: 1234400, confirmations: 289, timestamp: '2026-07-07 11:20:00', memo: '订单退款 #ORD-20260705-002' },
  { id: 5, txHash: '0x8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e', type: 'payment', from: '0x8f5a...c26f', to: '0xPayment...Router', amount: 45.0, tokenSymbol: 'USDC', chainId: 5042002, chainName: 'Arc Testnet', status: 'pending', blockNumber: 1234300, confirmations: 3, timestamp: '2026-07-06 13:22:15', memo: '商品订单支付 #ORD-20260706-001' },
  { id: 6, txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', type: 'swap', from: '0x8f5a...c26f', to: '0xSwap...Router', amount: 500, tokenSymbol: 'USDC', chainId: 59141, chainName: 'Linea Sepolia', status: 'confirmed', blockNumber: 9876543, confirmations: 120, timestamp: '2026-07-05 09:10:00', memo: '500 USDC → 50000 SAP' },
  { id: 7, txHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a', type: 'reward', from: '0xReward...Pool', to: '0x8f5a...c26f', amount: 15.7, tokenSymbol: 'SAP', chainId: 59141, chainName: 'Linea Sepolia', status: 'confirmed', blockNumber: 9876400, confirmations: 250, timestamp: '2026-07-04 14:00:00', memo: '交易返佣奖励' },
  { id: 8, txHash: '0xf0e1d2c3b4a5968778695a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', type: 'payment', from: '0x8f5a...c26f', to: '0xPayment...Router', amount: 230.0, tokenSymbol: 'SAP', chainId: 5042002, chainName: 'Arc Testnet', status: 'failed', blockNumber: 1234050, confirmations: 0, timestamp: '2026-07-03 10:00:00', memo: '支付失败 — 余额不足' },
];

export const mockAdjustments: AdjustmentRecord[] = [
  { id: 1, operator: 'charlie_admin', type: 'credit', amount: 500, tokenSymbol: 'SAP', chainName: 'Arc Testnet', status: 'completed', reason: '活动奖励补发', memo: '2026年7月社区活动奖励', createdAt: '2026-07-08 10:00:00', reviewedAt: '2026-07-08 10:05:00', reviewer: 'charlie_admin' },
  { id: 2, operator: 'charlie_admin', type: 'freeze', amount: 200, tokenSymbol: 'SAP', chainName: 'Arc Testnet', status: 'completed', reason: '异常交易调查', memo: '检测到异常转账行为，暂时冻结部分余额', createdAt: '2026-07-06 14:00:00', reviewedAt: '2026-07-06 14:10:00', reviewer: 'charlie_admin' },
  { id: 3, operator: 'charlie_admin', type: 'debit', amount: 50, tokenSymbol: 'SAP', chainName: 'Linea Sepolia', status: 'pending', reason: '手续费扣除', memo: '账户维护手续费', createdAt: '2026-07-09 08:00:00' },
];
