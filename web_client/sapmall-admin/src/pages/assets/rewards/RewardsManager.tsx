import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { RewardsOverview, RewardHistory, VipTierCard } from './components';
import { rewardsTheme } from './rewardsTheme';
import {
  mockRewardsProfile,
  mockRewardsSummary,
  mockSourceBreakdown,
  mockTierInfo,
  mockRewardRecords,
  TIER_LABELS,
  TIER_COLORS,
} from './constants';
import styles from './RewardsManager.module.scss';

const formatAmount = (val: number): string =>
  val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const RewardsManager: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');
  const tierInfo = mockTierInfo;
  const summary = mockRewardsSummary;
  const tierColor = TIER_COLORS[tierInfo.currentTier];

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-chart-line" />
          权益总览
        </span>
      ),
      children: (
        <RewardsOverview
          summary={summary}
          sourceBreakdown={mockSourceBreakdown}
          tierInfo={tierInfo}
          recentRecords={mockRewardRecords.slice(0, 4)}
        />
      ),
    },
    {
      key: 'history',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-history" />
          奖励记录
        </span>
      ),
      children: <RewardHistory records={mockRewardRecords} />,
    },
    {
      key: 'tier',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-crown" />
          权益等级
        </span>
      ),
      children: <VipTierCard tierInfo={tierInfo} />,
    },
  ];

  return (
    <ConfigProvider theme={rewardsTheme}>
      <div className={styles.rewardsPage}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h2 className={styles.pageTitle}>{t('assets.rewards.title')}</h2>
          </div>
        </div>
        {/* 等级进度 + 快捷领取横幅 */}
        <div className={styles.rewardBanner}>
          <div className={styles.rewardBannerTier}>
            <div
              className={styles.rewardBannerBadge}
              style={{ background: tierColor.bg, color: tierColor.color, border: `1px solid ${tierColor.border}` }}
            >
              <i className="fas fa-crown" />
            </div>
            <div className={styles.rewardBannerTierInfo}>
              <div className={styles.rewardBannerTierName}>
                {tierInfo.currentLevelName}
                <span className={styles.rewardBannerTierPoints}>
                  {tierInfo.currentPoints.toLocaleString()} pts
                </span>
              </div>
              <div className={styles.rewardBannerProgress}>
                <div
                  className={styles.rewardBannerProgressFill}
                  style={{ width: `${tierInfo.progressPercent}%` }}
                />
              </div>
              <div className={styles.rewardBannerProgressMeta}>
                <span>{TIER_LABELS[tierInfo.currentTier]}</span>
                {tierInfo.nextTier && (
                  <span>
                    距 {tierInfo.nextTierName} 还需 {(tierInfo.nextTierPoints - tierInfo.currentPoints).toLocaleString()} 积分
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rewardBannerClaim}>
            <div className={styles.rewardBannerClaimInfo}>
              <span className={styles.rewardBannerClaimLabel}>可领取奖励</span>
              <span className={styles.rewardBannerClaimValue}>
                {formatAmount(summary.availableToClaim)}
                <span className={styles.rewardBannerClaimUnit}>SAP</span>
              </span>
            </div>
            <button
              type="button"
              className={styles.rewardBannerClaimBtn}
              disabled={summary.availableToClaim <= 0}
            >
              <i className="fas fa-hand-holding" />
              一键领取
            </button>
          </div>
        </div>

        {/* 标签页内容 */}
        <Tabs
          className={styles.rewardsTabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          destroyInactiveTabPane={false}
        />
      </div>
    </ConfigProvider>
  );
};

export default RewardsManager;
