﻿import React, { useState } from 'react';
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
  getTierLabels,
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
  const tierLabels = getTierLabels(t);

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-chart-line" />
          {t('assets.rewards.tabs.overview')}
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
          {t('assets.rewards.tabs.history')}
        </span>
      ),
      children: <RewardHistory records={mockRewardRecords} />,
    },
    {
      key: 'tier',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-crown" />
          {t('assets.rewards.tabs.tier')}
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
                {tierLabels[tierInfo.currentTier]}
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
                <span>{tierLabels[tierInfo.currentTier]}</span>
                {tierInfo.nextTier && (
                  <span>
                    {t('assets.rewards.banner.pointsToNext', {
                      nextTier: tierLabels[tierInfo.nextTier],
                      points: (tierInfo.nextTierPoints - tierInfo.currentPoints).toLocaleString(),
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className={styles.rewardBannerClaim}>
            <div className={styles.rewardBannerClaimInfo}>
              <span className={styles.rewardBannerClaimLabel}>{t('assets.rewards.banner.claimableReward')}</span>
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
              {t('assets.rewards.banner.claimAll')}
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
