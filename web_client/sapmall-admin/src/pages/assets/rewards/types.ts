// ========== 权益管理类型定义（个人视角）==========

/** 奖励来源类型 */
export type RewardSourceType =
  | 'trading_rebate'    // 交易返佣
  | 'community'         // 社区活动
  | 'referral'          // 邀请奖励
  | 'staking'           // 质押收益
  | 'merchant_bonus'    // 商家奖励
  | 'airdrop';          // 空投

/** 奖励状态 */
export type RewardStatus = 'available' | 'claimed' | 'pending' | 'expired';

/** 权益等级 */
export type VipTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

/** 代币符号 */
export type TokenSymbol = 'SAP' | 'USDC' | 'EURC';

// ========== 权益总览 ==========

/** 奖励统计概览 */
export interface RewardsSummary {
  totalEarned: number;        // 累计获得 SAP
  availableToClaim: number;   // 可领取 SAP
  pendingRewards: number;     // 待结算 SAP
  claimedThisMonth: number;   // 本月已领取 SAP
}

/** 奖励来源占比 */
export interface RewardSourceBreakdown {
  source: RewardSourceType;
  amount: number;
  percentage: number;
}

/** 等级信息 */
export interface TierInfo {
  currentTier: VipTier;
  currentLevelName: string;
  currentPoints: number;
  nextTier: VipTier | null;
  nextTierName: string;
  nextTierPoints: number;
  tierBenefits: string[];
  progressPercent: number;
}

// ========== 奖励记录 ==========

/** 奖励记录条目 */
export interface RewardRecord {
  id: number;
  source: RewardSourceType;
  amount: number;
  tokenSymbol: TokenSymbol;
  status: RewardStatus;
  description: string;
  createdAt: string;
  claimedAt?: string;
  expireAt?: string;
  txHash?: string;
}

// ========== 用户信息 ==========

/** 权益页用户信息 */
export interface RewardsUserProfile {
  userId: string;
  nickname: string;
  walletAddress: string;
  currentTier: VipTier;
  tierPoints: number;
  joinedAt: string;
}
