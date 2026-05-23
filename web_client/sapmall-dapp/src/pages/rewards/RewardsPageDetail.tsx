import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CAMPAIGNS } from './mocks/campaigns.mock';
import type { CampaignCategoryFilter, CampaignSortKey, CampaignStatus } from './types';
import RewardsWalletNotice from './components/RewardsWalletNotice';
import RewardsCampaignCard from './components/RewardsCampaignCard';
import styles from './RewardsPageDetail.module.scss';

const CATEGORY_FILTERS: CampaignCategoryFilter[] = [
  'all',
  'shopping',
  'newbie',
  'referral',
  'task',
  'dao',
  'bags',
];

const RewardsPageDetail: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<CampaignStatus>('ongoing');
  const [categoryFilter, setCategoryFilter] = useState<CampaignCategoryFilter>('all');
  const [sortKey, setSortKey] = useState<CampaignSortKey>('latest');

  const tabCounts = useMemo(
    () => ({
      ongoing: CAMPAIGNS.filter((c) => c.status === 'ongoing').length,
      upcoming: CAMPAIGNS.filter((c) => c.status === 'upcoming').length,
      ended: CAMPAIGNS.filter((c) => c.status === 'ended').length,
    }),
    [],
  );

  const filteredCampaigns = useMemo(() => {
    let list = CAMPAIGNS.filter((c) => c.status === activeTab);
    if (categoryFilter !== 'all') {
      list = list.filter((c) => c.category === categoryFilter);
    }

    const sorted = [...list];
    if (sortKey === 'latest') {
      sorted.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
    } else if (sortKey === 'participants') {
      sorted.sort((a, b) => (b.participants ?? 0) - (a.participants ?? 0));
    } else if (sortKey === 'deadline') {
      sorted.sort((a, b) => {
        const aEnd = a.isLongTerm ? Number.MAX_SAFE_INTEGER : a.endAt ? new Date(a.endAt).getTime() : Number.MAX_SAFE_INTEGER;
        const bEnd = b.isLongTerm ? Number.MAX_SAFE_INTEGER : b.endAt ? new Date(b.endAt).getTime() : Number.MAX_SAFE_INTEGER;
        return aEnd - bEnd;
      });
    }
    return sorted;
  }, [activeTab, categoryFilter, sortKey]);

  const tabs: CampaignStatus[] = ['ongoing', 'upcoming', 'ended'];

  return (
    <div className={styles.pageContent}>
      <header className={styles.hero}>
        <span className={styles.heroBadge}>
          <span className={styles.heroBadgeDot} aria-hidden />
          {t('rewards.badgeHub')}
        </span>
        <h1 className={styles.heroTitle}>{t('rewards.title')}</h1>
        <p className={styles.heroSubtitle}>{t('rewards.heroSubtitle')}</p>
      </header>

      <RewardsWalletNotice />

      <div className={styles.toolbar}>
        <div className={styles.tabList} role="tablist" aria-label={t('rewards.tabListAria')}>
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={styles.tabBtn}
              data-active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            >
              {t(`rewards.tabs.${tab}`, { count: tabCounts[tab] })}
            </button>
          ))}
        </div>

        <div className={styles.sortRow}>
          <label htmlFor="rewards-sort">{t('rewards.sortLabel')}</label>
          <select
            id="rewards-sort"
            className={styles.sortSelect}
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as CampaignSortKey)}
          >
            <option value="latest">{t('rewards.sortLatest')}</option>
            <option value="participants">{t('rewards.sortReward')}</option>
            <option value="deadline">{t('rewards.sortDeadline')}</option>
          </select>
        </div>
      </div>

      <div className={styles.categoryRow} role="group" aria-label={t('rewards.categoryFilterLabel')}>
        {CATEGORY_FILTERS.map((cat) => (
          <button
            key={cat}
            type="button"
            className={styles.categoryChip}
            data-active={categoryFilter === cat}
            onClick={() => setCategoryFilter(cat)}
          >
            {cat === 'all' ? t('rewards.filterAll') : t(`rewards.categories.${cat}`)}
          </button>
        ))}
      </div>

      <div className={styles.campaignGrid} role="tabpanel">
        {filteredCampaigns.length === 0 ? (
          <p className={styles.emptyState}>{t('rewards.empty')}</p>
        ) : (
          filteredCampaigns.map((campaign) => (
            <RewardsCampaignCard key={campaign.slug} campaign={campaign} />
          ))
        )}
      </div>
    </div>
  );
};

export default RewardsPageDetail;


