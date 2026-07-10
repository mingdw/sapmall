import React from 'react';
import type { RewardsSummary, RewardSourceBreakdown, TierInfo, RewardRecord } from '../types';
import {
  REWARD_SOURCE_LABELS,
  REWARD_SOURCE_ICONS,
  REWARD_SOURCE_COLORS,
  REWARD_STATUS_LABELS,
} from '../constants';
import styles from '../RewardsManager.module.scss';

interface RewardsOverviewProps {
  summary: RewardsSummary;
  sourceBreakdown: RewardSourceBreakdown[];
  tierInfo: TierInfo;
  recentRecords: RewardRecord[];
}

const STATS_CARDS = [
  { key: 'totalEarned', label: '累计获得', icon: 'fas fa-coins', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
  { key: 'availableToClaim', label: '可领取', icon: 'fas fa-gift', color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)' },
  { key: 'pendingRewards', label: '待结算', icon: 'fas fa-hourglass-half', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  { key: 'claimedThisMonth', label: '本月已领', icon: 'fas fa-check-circle', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
] as const;

const formatAmount = (val: number): string =>
  val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const STATUS_CLASS_MAP: Record<string, string> = {
  available: styles.statusAvailable,
  claimed: styles.statusClaimed,
  pending: styles.statusPending,
  expired: styles.statusExpired,
};

const RewardsOverview: React.FC<RewardsOverviewProps> = ({ summary, sourceBreakdown, tierInfo, recentRecords }) => {
  return (
    <div>
      {/* 统计卡片 */}
      <div className={styles.statsGrid}>
        {STATS_CARDS.map((card) => (
          <div key={card.key} className={styles.statsCard}>
            <div className={styles.statsCardHead}>
              <div className={styles.statsCardIcon} style={{ background: card.bg, color: card.color }}>
                <i className={card.icon} />
              </div>
              <span className={styles.statsCardLabel}>{card.label}</span>
            </div>
            <div>
              <span className={styles.statsCardValue}>{formatAmount(summary[card.key])}</span>
              <span className={styles.statsCardUnit}>SAP</span>
            </div>
          </div>
        ))}
      </div>

      {/* 奖励来源分布 */}
      <div className={styles.queryCard}>
        <h4 className={styles.sectionLabel}>
          <i className="fas fa-chart-pie" style={{ color: 'var(--rw-accent)' }} />
          奖励来源分布
        </h4>
        <div className={styles.sourceList}>
          {sourceBreakdown.map((item) => {
            const colors = REWARD_SOURCE_COLORS[item.source];
            return (
              <div key={item.source} className={styles.sourceItem}>
                <div
                  className={styles.sourceIcon}
                  style={{ background: colors.bg, color: colors.color }}
                >
                  <i className={REWARD_SOURCE_ICONS[item.source]} />
                </div>
                <div className={styles.sourceInfo}>
                  <span className={styles.sourceName}>{REWARD_SOURCE_LABELS[item.source]}</span>
                  <div className={styles.sourceBar}>
                    <div
                      className={styles.sourceBarFill}
                      style={{ width: `${item.percentage}%`, background: colors.color }}
                    />
                  </div>
                </div>
                <div className={styles.sourceAmount}>
                  <div className={styles.sourceAmountValue}>{formatAmount(item.amount)}</div>
                  <div className={styles.sourceAmountPercent}>{item.percentage}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 最近奖励动态 */}
      <div className={styles.queryCard}>
        <h4 className={styles.sectionLabel}>
          <i className="fas fa-bolt" style={{ color: 'var(--rw-accent)' }} />
          最近奖励动态
        </h4>
        <div className={styles.recentList}>
          {recentRecords.map((record) => {
            const colors = REWARD_SOURCE_COLORS[record.source];
            const statusClass = STATUS_CLASS_MAP[record.status] || '';
            return (
              <div key={record.id} className={styles.recentItem}>
                <div
                  className={styles.recentIcon}
                  style={{ background: colors.bg, color: colors.color }}
                >
                  <i className={REWARD_SOURCE_ICONS[record.source]} />
                </div>
                <div className={styles.recentBody}>
                  <div className={styles.recentTitleRow}>
                    <span className={styles.recentDesc}>{record.description}</span>
                    <span className={`${styles.statusPill} ${statusClass}`}>
                      {REWARD_STATUS_LABELS[record.status]}
                    </span>
                  </div>
                  <div className={styles.recentMeta}>
                    <span className={styles.recentSource}>{REWARD_SOURCE_LABELS[record.source]}</span>
                    <span className={styles.recentDot}>·</span>
                    <span className={styles.monoText}>{record.createdAt}</span>
                  </div>
                </div>
                <div className={styles.recentAmount}>
                  <span className={styles.amountValue}>+{formatAmount(record.amount)}</span>
                  <span className={styles.amountUnit}>{record.tokenSymbol}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RewardsOverview;
