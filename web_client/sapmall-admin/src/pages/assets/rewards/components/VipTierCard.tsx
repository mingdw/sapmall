import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TierInfo, VipTier } from '../types';
import { getTierLabels, TIER_COLORS, TIER_POINT_THRESHOLDS } from '../constants';
import styles from '../RewardsManager.module.scss';

interface VipTierCardProps {
  tierInfo: TierInfo;
}

interface TierData {
  tier: VipTier;
  points: number;
  icon: string;
}

interface UpgradeQuest {
  key: string;
  icon: string;
  reward: number;
  current: number;
  target: number;
  color: string;
  bg: string;
}

const ALL_TIERS: TierData[] = [
  { tier: 'bronze',   points: TIER_POINT_THRESHOLDS.bronze,   icon: 'fas fa-shield' },
  { tier: 'silver',   points: TIER_POINT_THRESHOLDS.silver,   icon: 'fas fa-shield-alt' },
  { tier: 'gold',     points: TIER_POINT_THRESHOLDS.gold,     icon: 'fas fa-crown' },
  { tier: 'platinum', points: TIER_POINT_THRESHOLDS.platinum, icon: 'fas fa-gem' },
  { tier: 'diamond',  points: TIER_POINT_THRESHOLDS.diamond,  icon: 'fas fa-diamond' },
];

const NEXT_TIER_QUESTS: UpgradeQuest[] = [
  { key: 'trading',   icon: 'fas fa-exchange-alt', reward: 5000, current: 3200, target: 5000, color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.12)' },
  { key: 'staking',   icon: 'fas fa-lock',         reward: 3000, current: 1500, target: 3000, color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.12)' },
  { key: 'referral',  icon: 'fas fa-user-plus',    reward: 2000, current: 1200, target: 2000, color: '#34d399', bg: 'rgba(52, 211, 153, 0.12)' },
  { key: 'community', icon: 'fas fa-users',        reward: 2200, current: 1900, target: 2200, color: '#60a5fa', bg: 'rgba(96, 165, 250, 0.12)' },
];

const EARN_METHODS = [
  { key: 'trading',   icon: 'fas fa-exchange-alt', color: '#a78bfa' },
  { key: 'staking',   icon: 'fas fa-lock',         color: '#fbbf24' },
  { key: 'referral',  icon: 'fas fa-user-plus',    color: '#34d399' },
  { key: 'community', icon: 'fas fa-users',        color: '#60a5fa' },
];

const VipTierCard: React.FC<VipTierCardProps> = ({ tierInfo }) => {
  const { t } = useTranslation();
  const tierLabels = getTierLabels(t);
  const pointsToNext = tierInfo.nextTier ? tierInfo.nextTierPoints - tierInfo.currentPoints : 0;
  const nextTierData = tierInfo.nextTier ? ALL_TIERS.find((td) => td.tier === tierInfo.nextTier) : null;
  const currentTierIdx = ALL_TIERS.findIndex((td) => td.tier === tierInfo.currentTier);
  const nextTierName = tierInfo.nextTier ? tierLabels[tierInfo.nextTier] : '';

  return (
    <div>
      {/* 升级任务路径 */}
      {tierInfo.nextTier && nextTierData && (
        <div className={styles.queryCard}>
          <h4 className={styles.sectionLabel}>
            <i className="fas fa-rocket" style={{ color: 'var(--rw-accent)' }} />
            {t('assets.rewards.tierSection.upgradeQuests', { nextTier: nextTierName })}
          </h4>
          <div className={styles.questHint}>
            {t('assets.rewards.tierSection.questHint', { points: pointsToNext.toLocaleString(), nextTier: nextTierName })}
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
                      <span className={styles.questTitle}>{t(`assets.rewards.tierSection.quests.${quest.key}.title`)}</span>
                      <span className={styles.questReward}>
                        <i className="fas fa-coins" /> +{quest.reward.toLocaleString()} pts
                      </span>
                    </div>
                    {isComplete && (
                      <span className={styles.questCompleteBadge}>
                        <i className="fas fa-check" /> {t('assets.rewards.tierSection.questCompleted')}
                      </span>
                    )}
                  </div>
                  <div className={styles.questDesc}>{t(`assets.rewards.tierSection.quests.${quest.key}.desc`)}</div>
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
          {t('assets.rewards.tierSection.tierComparison')}
        </h4>
        <div className={styles.tierComparison}>
          {ALL_TIERS.map((tierData, idx) => {
            const colors = TIER_COLORS[tierData.tier];
            const isCurrent = tierData.tier === tierInfo.currentTier;
            const isUnlocked = idx <= currentTierIdx;
            const benefits = t(`assets.rewards.tierSection.benefits.${tierData.tier}`, { returnObjects: true }) as string[];
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
                  <span className={styles.tierCompareName}>{tierLabels[tierData.tier]}</span>
                  {isCurrent && <span className={styles.tierCurrentBadge}>{t('assets.rewards.tierSection.currentBadge')}</span>}
                  {!isUnlocked && (
                    <span className={styles.tierLockedBadge}>
                      <i className="fas fa-lock" /> {tierData.points.toLocaleString()} pts
                    </span>
                  )}
                </div>
                <div className={styles.tierComparePoints}>
                  {tierData.points === 0
                    ? t('assets.rewards.tierSection.registerToGet')
                    : t('assets.rewards.tierSection.pointsUnit', { points: tierData.points.toLocaleString() })}
                </div>
                <div className={styles.tierCompareBenefits}>
                  {benefits.map((benefit, bidx) => (
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
          {t('assets.rewards.tierSection.earnMethodsTitle')}
        </h4>
        <div className={styles.earnGrid}>
          {EARN_METHODS.map((item, idx) => (
            <div key={idx} className={styles.earnCard}>
              <div
                className={styles.earnIcon}
                style={{ background: `${item.color}1a`, color: item.color }}
              >
                <i className={item.icon} />
              </div>
              <div>
                <div className={styles.earnTitle}>{t(`assets.rewards.tierSection.earnMethods.${item.key}.title`)}</div>
                <div className={styles.earnDesc}>{t(`assets.rewards.tierSection.earnMethods.${item.key}.desc`)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VipTierCard;
