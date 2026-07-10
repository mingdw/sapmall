// ========== 余额管理类型定义（个人视角）==========

/** 用户状态 */
export type UserStatus = 'active' | 'inactive' | 'frozen';

/** 交易类型：支付 / 退款 / 兑换 / 奖励 */
export type TransactionType = 'payment' | 'refund' | 'swap' | 'reward';

/** 交易状态 */
export type TransactionStatus = 'confirmed' | 'pending' | 'failed';

/** 调账操作类型 */
export type AdjustmentType = 'credit' | 'debit' | 'freeze' | 'unfreeze';

/** 调账状态 */
export type AdjustmentStatus = 'completed' | 'pending' | 'rejected';

/** 代币符号 */
export type TokenSymbol = 'SAP' | 'USDC' | 'EURC' | 'cirBTC';

// ========== 个人余额总览 ==========

/** 单条链上的代币余额 */
export interface ChainTokenBalance {
  symbol: TokenSymbol;
  balance: number;
  decimals: number;
}

/** 单条链的余额信息 */
export interface ChainBalanceInfo {
  chainId: number;
  chainName: string;
  nativeSymbol: string;
  tokens: ChainTokenBalance[];
}

/** 登录用户信息 */
export interface UserProfile {
  userId: string;
  username: string;
  nickname: string;
  walletAddress: string;
  status: UserStatus;
  registeredAt: string;
  lastActiveAt: string;
  chainBalances: ChainBalanceInfo[];
}

// ========== 交易记录 ==========

/** 交易记录信息 */
export interface TransactionRecord {
  id: number;
  txHash: string;
  type: TransactionType;
  from: string;
  to: string;
  amount: number;
  tokenSymbol: TokenSymbol;
  chainId: number;
  chainName: string;
  status: TransactionStatus;
  blockNumber: number;
  confirmations: number;
  timestamp: string;
  memo?: string;
}

// ========== 余额操作 ==========

/** 调账记录 */
export interface AdjustmentRecord {
  id: number;
  operator: string;
  type: AdjustmentType;
  amount: number;
  tokenSymbol: TokenSymbol;
  chainName: string;
  status: AdjustmentStatus;
  reason: string;
  memo?: string;
  createdAt: string;
  reviewedAt?: string;
  reviewer?: string;
}

/** 新增调账请求 */
export interface AdjustmentRequest {
  type: AdjustmentType;
  amount: number;
  tokenSymbol: TokenSymbol;
  chainId: number;
  reason: string;
  memo?: string;
}
