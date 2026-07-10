import React from 'react';
import type { TierInfo, VipTier } from '../types';
import { TIER_LABELS, TIER_COLORS, TIER_POINT_THRESHOLDS } from '../constants';
import styles from '../RewardsManager.module.scss';

interface VipTierCardProps {
  tierInfo: TierInfo;
}

interface TierData {
  tier: VipTier;
  points: number;
  benefits: string[];
  icon: string;
}

interface UpgradeQuest {
  icon: string;
  title: string;
  desc: string;
  reward: number;
  current: number;
  target: number;
  color: string;
  bg: string;
}

const ALL_TIERS: TierData[] = [
  {
    tier: 'bronze',
    points: TIER_POINT_THRESHOLDS.bronze,
    icon: 'fas fa-shield',
    benefits: ['基础交易返佣 0.5%', '社区活动参与权', '标准提现速度'],
  },
  {
    tier: 'silver',
    points: TIER_POINT_THRESHOLDS.silver,
    icon: 'fas fa-shield-alt',
    benefits: ['交易返佣 0.8%', '提现手续费 9 折', '活动提前通知'],
  },
  {
    tier: 'gold',
    points: TIER_POINT_THRESHOLDS.gold,
    icon: 'fas fa-crown',
    benefits: ['交易返佣 1.5%', '专属客服通道', '提现手续费 8 折', '社区活动优先参与'],
  },
  {
    tier: 'platinum',
    points: TIER_POINT_THRESHOLDS.platinum,
    icon: 'fas fa-gem',
    benefits: ['交易返佣 2.0%', '专属客户经理', '提现手续费 6 折', '优先参与内测功能', '大额提现加速'],
  },
  {
    tier: 'diamond',
    points: TIER_POINT_THRESHOLDS.diamond,
    icon: 'fas fa-diamond',
    benefits: ['交易返佣 3.0%', '1v1 专属服务', '提现手续费全免', 'VIP 专享活动', '链上优先确认', '定制化 API 接口'],
  },
];

const NEXT_TIER_QUESTS: UpgradeQuest[] = [
  {
    icon: 'fas fa-exchange-alt',
    title: '完成交易消费',
    desc: '交易消费累计 SAP 等值资产',
    reward: 5000,
    current: 3200,
    target: 5000,
    color: '#a78bfa',
    bg: 'rgba(167, 139, 250, 0.12)',
  },
  {
    icon: 'fas fa-lock',
    title: '增加 SAP 质押',
    desc: '质押 SAP 获取持续积分收益',
    reward: 3000,
    current: 1500,
    target: 3000,
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.12)',
  },
  {
    icon: 'fas fa-user-plus',
    title: '邀请好友交易',
    desc: '邀请好友完成首笔交易',
    reward: 2000,
    current: 1200,
    target: 2000,
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.12)',
  },
  {
    icon: 'fas fa-users',
    title: '参与社区活动',
    desc: '完成社区问答/测试任务',
    reward: 2200,
    current: 1900,
    target: 2200,
    color: '#60a5fa',
    bg: 'rgba(96, 165, 250, 0.12)',
  },
];

const VipTierCard: React.FC<VipTierCardProps> = ({ tierInfo }) => {
  const pointsToNext = tierInfo.nextTier ? tierInfo.nextTierPoints - tierInfo.currentPoints : 0;
  const nextTierData = tierInfo.nextTier ? ALL_TIERS.find((t) => t.tier === tierInfo.nextTier) : null;
  const currentTierIdx = ALL_TIERS.findIndex((t) => t.tier === tierInfo.currentTier);

  return (
    <div>
      {/* 升级任务路径 */}
      {tierInfo.nextTier && nextTierData && (
        <div className={styles.queryCard}>
          <h4 className={styles.sectionLabel}>
            <i className="fas fa-rocket" style={{ color: 'var(--rw-accent)' }} />
            升级任务 — 冲刺 {tierInfo.nextTierName}
          </h4>
          <div className={styles.questHint}>
            还需 <span className={styles.questHintNum}>{pointsToNext.toLocaleString()}</span> 积分升级至 {tierInfo.nextTierName}，完成以下任务加速获取积分
          </div>
          <div className={styles.questGrid}>
            {NEXT_TIER_QUESTS.map((quest, idx) => {
              const percent = Math.min(100, Math.round((quest.current / quest.target) * 100));
              const isComplete = quest.current >= quest.target;
              return (
                <div key={idx} className={styles.questCard}>
                  <div className={styles.questHeader}>
                    <div className={styles.questIcon} style={{ background: quest.bg, color: quest.color }}>
                      <i className={quest.icon} />
                    </div>
                    <div className={styles.questTitleWrap}>
                      <span className={styles.questTitle}>{quest.title}</span>
                      <span className={styles.questReward}>
                        <i className="fas fa-coins" /> +{quest.reward.toLocaleString()} pts
                      </span>
                    </div>
                    {isComplete && (
                      <span className={styles.questCompleteBadge}>
                        <i className="fas fa-check" /> 已完成
                      </span>
                    )}
                  </div>
                  <div className={styles.questDesc}>{quest.desc}</div>
                  <div className={styles.questProgressRow}>
                    <div className={styles.questProgressBar}>
                      <div
                        className={styles.questProgressFill}
                        style={{
                          width: `${percent}%`,
                          background: isComplete ? '#34d399' : quest.color,
                        }}
                      />
                    </div>
                    <span className={styles.questProgressText}>
                      {quest.current.toLocaleString()} / {quest.target.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 所有等级对比 */}
      <div className={styles.queryCard}>
        <h4 className={styles.sectionLabel}>
          <i className="fas fa-trophy" style={{ color: 'var(--rw-accent)' }} />
          等级权益对比
        </h4>
        <div className={styles.tierComparison}>
          {ALL_TIERS.map((tierData, idx) => {
            const colors = TIER_COLORS[tierData.tier];
            const isCurrent = tierData.tier === tierInfo.currentTier;
            const isUnlocked = idx <= currentTierIdx;
            return (
              <div
                key={tierData.tier}
                className={`${styles.tierCompareCard} ${isCurrent ? styles.tierCompareCardCurrent : ''}`}
                style={{ opacity: isUnlocked ? 1 : 0.6 }}
              >
                <div className={styles.tierCompareHeader}>
                  <div
                    className={styles.tierCompareIcon}
                    style={{ background: colors.bg, color: colors.color, border: `1px solid ${colors.border}` }}
                  >
                    <i className={tierData.icon} />
                  </div>
                  <span className={styles.tierCompareName}>{TIER_LABELS[tierData.tier]}</span>
                  {isCurrent && <span className={styles.tierCurrentBadge}>当前</span>}
                  {!isUnlocked && (
                    <span className={styles.tierLockedBadge}>
                      <i className="fas fa-lock" /> {tierData.points.toLocaleString()} pts
                    </span>
                  )}
                </div>
                <div className={styles.tierComparePoints}>
                  {tierData.points === 0 ? '注册即得' : `${tierData.points.toLocaleString()} 积分`}
                </div>
                <div className={styles.tierCompareBenefits}>
                  {tierData.benefits.map((benefit, bidx) => (
                    <div key={bidx} className={styles.tierCompareBenefit}>
                      <i className={`fas ${isUnlocked ? 'fa-check' : 'fa-lock'}`} />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 积分获取说明 */}
      <div className={styles.queryCard}>
        <h4 className={styles.sectionLabel}>
          <i className="fas fa-info-circle" style={{ color: 'var(--rw-accent)' }} />
          积分获取方式
        </h4>
        <div className={styles.earnGrid}>
          {[
            { icon: 'fas fa-exchange-alt', title: '交易消费', desc: '每消费 1 SAP 等值资产获得 1 积分', color: '#a78bfa' },
            { icon: 'fas fa-lock', title: '质押 SAP', desc: '每质押 100 SAP 每天 1 积分', color: '#fbbf24' },
            { icon: 'fas fa-user-plus', title: '邀请好友', desc: '好友首笔交易奖励 50 积分', color: '#34d399' },
            { icon: 'fas fa-users', title: '社区贡献', desc: '参与问答/测试活动获得积分', color: '#60a5fa' },
          ].map((item, idx) => (
            <div key={idx} className={styles.earnCard}>
              <div
                className={styles.earnIcon}
                style={{ background: `${item.color}1a`, color: item.color }}
              >
                <i className={item.icon} />
              </div>
              <div>
                <div className={styles.earnTitle}>{item.title}</div>
                <div className={styles.earnDesc}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VipTierCard;
