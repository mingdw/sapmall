import type {
  RewardsSummary,
  RewardSourceBreakdown,
  TierInfo,
  RewardRecord,
  RewardsUserProfile,
  RewardSourceType,
  RewardStatus,
  VipTier,
} from './types';

// ========== 标签映射 ==========

export const REWARD_SOURCE_LABELS: Record<RewardSourceType, string> = {
  trading_rebate: '交易返佣',
  community: '社区活动',
  referral: '邀请奖励',
  staking: '质押收益',
  merchant_bonus: '商家奖励',
  airdrop: '空投',
};

export const REWARD_SOURCE_ICONS: Record<RewardSourceType, string> = {
  trading_rebate: 'fas fa-exchange-alt',
  community: 'fas fa-users',
  referral: 'fas fa-user-plus',
  staking: 'fas fa-lock',
  merchant_bonus: 'fas fa-store',
  airdrop: 'fas fa-parachute-box',
};

export const REWARD_SOURCE_COLORS: Record<RewardSourceType, { bg: string; color: string }> = {
  trading_rebate: { bg: 'rgba(167, 139, 250, 0.12)', color: '#a78bfa' },
  community: { bg: 'rgba(96, 165, 250, 0.12)', color: '#60a5fa' },
  referral: { bg: 'rgba(52, 211, 153, 0.12)', color: '#34d399' },
  staking: { bg: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24' },
  merchant_bonus: { bg: 'rgba(248, 113, 113, 0.12)', color: '#f87171' },
  airdrop: { bg: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8' },
};

export const REWARD_STATUS_LABELS: Record<RewardStatus, string> = {
  available: '可领取',
  claimed: '已领取',
  pending: '待结算',
  expired: '已过期',
};

export const TIER_LABELS: Record<VipTier, string> = {
  bronze: '青铜',
  silver: '白银',
  gold: '黄金',
  platinum: '铂金',
  diamond: '钻石',
};

export const TIER_COLORS: Record<VipTier, { color: string; bg: string; border: string }> = {
  bronze: { color: '#d97706', bg: 'rgba(217, 119, 6, 0.12)', border: 'rgba(217, 119, 6, 0.35)' },
  silver: { color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.35)' },
  gold: { color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)', border: 'rgba(251, 191, 36, 0.35)' },
  platinum: { color: '#67e8f9', bg: 'rgba(103, 232, 249, 0.12)', border: 'rgba(103, 232, 249, 0.35)' },
  diamond: { color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)', border: 'rgba(167, 139, 250, 0.35)' },
};

export const TIER_POINT_THRESHOLDS: Record<VipTier, number> = {
  bronze: 0,
  silver: 1000,
  gold: 5000,
  platinum: 20000,
  diamond: 100000,
};

// ========== Mock 数据 ==========

export const mockRewardsProfile: RewardsUserProfile = {
  userId: 'U001',
  nickname: 'Alice',
  walletAddress: '0x8f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f',
  currentTier: 'gold',
  tierPoints: 7800,
  joinedAt: '2026-01-15',
};

export const mockRewardsSummary: RewardsSummary = {
  totalEarned: 4560.8,
  availableToClaim: 128.5,
  pendingRewards: 75.3,
  claimedThisMonth: 320.0,
};

export const mockSourceBreakdown: RewardSourceBreakdown[] = [
  { source: 'trading_rebate', amount: 2180.5, percentage: 47.8 },
  { source: 'community', amount: 980.0, percentage: 21.5 },
  { source: 'referral', amount: 720.3, percentage: 15.8 },
  { source: 'staking', amount: 430.0, percentage: 9.4 },
  { source: 'merchant_bonus', amount: 200.0, percentage: 4.4 },
  { source: 'airdrop', amount: 50.0, percentage: 1.1 },
];

export const mockTierInfo: TierInfo = {
  currentTier: 'gold',
  currentLevelName: '黄金会员',
  currentPoints: 7800,
  nextTier: 'platinum',
  nextTierName: '铂金会员',
  nextTierPoints: 20000,
  tierBenefits: [
    '交易返佣比例 +1.5%',
    '专属客服通道',
    '提现手续费 8 折',
    '社区活动优先参与',
  ],
  progressPercent: 39,
};

export const mockRewardRecords: RewardRecord[] = [
  { id: 1, source: 'trading_rebate', amount: 25.3, tokenSymbol: 'SAP', status: 'claimed', description: '1000 USDC → SAP 兑换返佣', createdAt: '2026-07-09 14:30:25', claimedAt: '2026-07-09 14:31:00', txHash: '0x7f5a2e45c0d3c9f0acef4e70c825f5c5c9e5c26f' },
  { id: 2, source: 'community', amount: 50.0, tokenSymbol: 'SAP', status: 'available', description: '7月社区问答活动奖励', createdAt: '2026-07-08 16:45:30', expireAt: '2026-07-31 23:59:59' },
  { id: 3, source: 'referral', amount: 15.7, tokenSymbol: 'SAP', status: 'claimed', description: '邀请用户 bob_eth 注册并完成首笔交易', createdAt: '2026-07-07 11:20:00', claimedAt: '2026-07-07 11:25:00', txHash: '0x3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b' },
  { id: 4, source: 'staking', amount: 12.0, tokenSymbol: 'SAP', status: 'pending', description: 'SAP 质押第 27 周收益', createdAt: '2026-07-06 00:00:00' },
  { id: 5, source: 'trading_rebate', amount: 8.5, tokenSymbol: 'SAP', status: 'available', description: '商品订单 #ORD-20260709-001 返佣', createdAt: '2026-07-09 12:15:10', expireAt: '2026-08-09 23:59:59' },
  { id: 6, source: 'merchant_bonus', amount: 100.0, tokenSymbol: 'SAP', status: 'claimed', description: '6月商家销售达标奖励', createdAt: '2026-07-01 10:00:00', claimedAt: '2026-07-01 10:05:00', txHash: '0x5e4d3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d' },
  { id: 7, source: 'airdrop', amount: 50.0, tokenSymbol: 'SAP', status: 'claimed', description: 'SAPMall 2.0 升级空投', createdAt: '2026-06-28 09:00:00', claimedAt: '2026-06-28 09:02:00', txHash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c' },
  { id: 8, source: 'community', amount: 30.0, tokenSymbol: 'SAP', status: 'expired', description: '6月测试网反馈奖励', createdAt: '2026-06-15 14:00:00', expireAt: '2026-06-30 23:59:59' },
  { id: 9, source: 'referral', amount: 10.0, tokenSymbol: 'SAP', status: 'pending', description: '邀请用户 carol_dao 注册奖励', createdAt: '2026-07-05 18:30:00' },
  { id: 10, source: 'staking', amount: 12.0, tokenSymbol: 'SAP', status: 'claimed', description: 'SAP 质押第 26 周收益', createdAt: '2026-06-29 00:00:00', claimedAt: '2026-06-29 00:05:00', txHash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e' },
];
