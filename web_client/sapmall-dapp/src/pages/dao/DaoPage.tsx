import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { message } from 'antd';
import { DAO_DISCORD_URL } from './constants';
import DaoHeroSection from './components/DaoHeroSection';
import DaoMainListCard from './components/DaoMainListCard';
import DaoParticipationCard from './components/DaoParticipationCard';
import DaoProposalRulesCard from './components/DaoProposalRulesCard';
import DaoTabOverviewCard from './components/DaoTabOverviewCard';
import type { DaoDiscussionTopicTagFilter } from './constants/discussionTopicTags';
import type { DaoEventFilter, DaoProposalFilter, DaoViewTab } from './types';
import DaoDiscussionTopicTagsCard from './components/DaoDiscussionTopicTagsCard';
import styles from './DaoPage.module.scss';

const DaoPage: React.FC = () => {
  const { t, ready } = useTranslation();
  const [tab, setTab] = useState<DaoViewTab>('proposals');
  const [proposalFilter, setProposalFilter] = useState<DaoProposalFilter>('all');
  const [discussionTagFilter, setDiscussionTagFilter] = useState<DaoDiscussionTopicTagFilter>('all');
  const [eventFilter, setEventFilter] = useState<DaoEventFilter>('all');
  const [page, setPage] = useState(1);

  const onComingSoon = useCallback(() => {
    message.info(t('dao.toast.comingSoon'));
  }, [t]);

  const openDiscord = useCallback(() => {
    window.open(DAO_DISCORD_URL, '_blank', 'noopener,noreferrer');
  }, []);

  const onTabChange = useCallback((next: DaoViewTab) => {
    setTab(next);
    setPage(1);
    if (next !== 'discussions') {
      setDiscussionTagFilter('all');
    }
  }, []);

  const onProposalFilterChange = useCallback((f: DaoProposalFilter) => {
    setProposalFilter(f);
    setPage(1);
  }, []);

  const onDiscussionTagFilterChange = useCallback((f: DaoDiscussionTopicTagFilter) => {
    setDiscussionTagFilter(f);
    setPage(1);
  }, []);

  const onEventFilterChange = useCallback((f: DaoEventFilter) => {
    setEventFilter(f);
    setPage(1);
  }, []);

  if (!ready) {
    return (
      <div className="p-6 text-sm text-slate-400" aria-busy="true">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className={styles.pageRoot}>
      <div className={styles.pageShell}>
        <DaoHeroSection />

        <section className={styles.contentZone} aria-label={t('dao.list.tabListAria')}>
          <div className={styles.contentZoneInner}>
            <DaoMainListCard
              tab={tab}
              onTabChange={onTabChange}
              proposalFilter={proposalFilter}
              discussionTagFilter={discussionTagFilter}
              eventFilter={eventFilter}
              onProposalFilterChange={onProposalFilterChange}
              onDiscussionTagFilterChange={onDiscussionTagFilterChange}
              onEventFilterChange={onEventFilterChange}
              page={page}
              onPageChange={setPage}
              onRowClick={onComingSoon}
            />
            <div className={styles.sidebarColumn}>
              <DaoParticipationCard
                onCreateProposal={onComingSoon}
                onStartDiscussion={openDiscord}
                onVote={onComingSoon}
              />
              <DaoTabOverviewCard tab={tab} onTrendingItemClick={onComingSoon} />
              {tab === 'proposals' ? <DaoProposalRulesCard /> : null}
              {tab === 'discussions' ? (
                <DaoDiscussionTopicTagsCard
                  activeFilter={discussionTagFilter}
                  onFilterChange={onDiscussionTagFilterChange}
                />
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DaoPage;
