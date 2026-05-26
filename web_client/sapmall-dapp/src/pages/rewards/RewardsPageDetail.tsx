import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SlidersHorizontal } from 'lucide-react';
import { CAMPAIGNS } from './mocks/campaigns.mock';
import type { CampaignCategory, CampaignCategoryFilter, CampaignSortKey, CampaignStatus } from './types';
import { computeRewardsHubStats, pickFeaturedCampaigns } from './utils/rewardsHubStats';
import RewardsHeroSection from './components/RewardsHeroSection';
import RewardsStatsStrip from './components/RewardsStatsStrip';
import RewardsFeaturedRow from './components/RewardsFeaturedRow';
import RewardsCategoryBrowse from './components/RewardsCategoryBrowse';
import RewardsSidebar from './components/RewardsSidebar';
import RewardsCampaignCard from './components/RewardsCampaignCard';
import styles from './RewardsPageDetail.module.scss';

const RewardsPageDetail: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<CampaignStatus>('ongoing');
  const [categoryFilter, setCategoryFilter] = useState<CampaignCategoryFilter>('all');
  const [sortKey, setSortKey] = useState<CampaignSortKey>('latest');

  const hubStats = useMemo(() => computeRewardsHubStats(CAMPAIGNS), []);

  const tabCounts = useMemo(
    () => ({
      ongoing: CAMPAIGNS.filter((c) => c.status === 'ongoing').length,
      upcoming: CAMPAIGNS.filter((c) => c.status === 'upcoming').length,
      ended: CAMPAIGNS.filter((c) => c.status === 'ended').length,
    }),
    [],
  );

  const featuredCampaigns = useMemo(
    () => (activeTab === 'ongoing' ? pickFeaturedCampaigns(CAMPAIGNS, 'ongoing', 3) : []),
    [activeTab],
  );

  const featuredSlugs = useMemo(
    () => new Set(featuredCampaigns.map((c) => c.slug)),
    [featuredCampaigns],
  );

  const countByCategory = useMemo(() => {
    const map: Record<CampaignCategory, number> = {
      shopping: 0,
      newbie: 0,
      referral: 0,
      task: 0,
      dao: 0,
      bags: 0,
    };
    for (const campaign of CAMPAIGNS.filter((c) => c.status === activeTab)) {
      map[campaign.category] += 1;
    }
    return map;
  }, [activeTab]);

  const filteredCampaigns = useMemo(() => {
    let list = CAMPAIGNS.filter((c) => c.status === activeTab);
    if (activeTab === 'ongoing' && featuredSlugs.size > 0) {
      list = list.filter((c) => !featuredSlugs.has(c.slug));
    }
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
        const aEnd = a.isLongTerm
          ? Number.MAX_SAFE_INTEGER
          : a.endAt
            ? new Date(a.endAt).getTime()
            : Number.MAX_SAFE_INTEGER;
        const bEnd = b.isLongTerm
          ? Number.MAX_SAFE_INTEGER
          : b.endAt
            ? new Date(b.endAt).getTime()
            : Number.MAX_SAFE_INTEGER;
        return aEnd - bEnd;
      });
    }
    return sorted;
  }, [activeTab, categoryFilter, sortKey, featuredSlugs]);

  const tabs: CampaignStatus[] = ['ongoing', 'upcoming', 'ended'];

  return (
    <div className={styles.pageContent}>
      <RewardsHeroSection />
      <RewardsStatsStrip stats={hubStats} />

      <div className={styles.pageLayout}>
        <main className={styles.mainColumn}>
          {featuredCampaigns.length > 0 ? (
            <RewardsFeaturedRow campaigns={featuredCampaigns} />
          ) : null}

          <div className={styles.listPanel} data-zone="minimal">
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
                    data-tab={tab}
                    onClick={() => setActiveTab(tab)}
                  >
                    {t(`rewards.tabs.${tab}`, { count: tabCounts[tab] })}
                  </button>
                ))}
              </div>

              <div className={styles.sortRow}>
                <SlidersHorizontal size={14} aria-hidden />
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

            <RewardsCategoryBrowse
              activeCategory={categoryFilter}
              countByCategory={countByCategory}
              onCategorySelect={setCategoryFilter}
            />

            <div className={styles.campaignGrid} role="tabpanel">
              {filteredCampaigns.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>{t('rewards.empty')}</p>
                  <button
                    type="button"
                    className={styles.emptyReset}
                    onClick={() => setCategoryFilter('all')}
                  >
                    {t('rewards.emptyReset')}
                  </button>
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <RewardsCampaignCard key={campaign.slug} campaign={campaign} variant="minimal" />
                ))
              )}
            </div>
          </div>
        </main>

        <RewardsSidebar />
      </div>
    </div>
  );
};

export default RewardsPageDetail;
