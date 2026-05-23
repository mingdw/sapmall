import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { DAO_DISCORD_URL } from './constants';
import { DAO_DEFAULT_VIEW_TAB } from './constants/daoViewTabs';
import DaoMainListCard from './components/DaoMainListCard';
import DaoParticipationCard from './components/DaoParticipationCard';
import DaoProposalRulesCard from './components/DaoProposalRulesCard';
import DaoTabOverviewCard from './components/DaoTabOverviewCard';
import DaoDiscussionTopicTagsCard from './components/DaoDiscussionTopicTagsCard';
import type { DaoDiscussionTopicTagFilter } from './constants/discussionTopicTags';
import type { DaoDiscussionCategoryFilter, DaoEventFilter, DaoProposalFilter, DaoViewTab } from './types';
import { daoEventPath, daoProposalCreatePath, daoProposalPath, daoDiscussionPath, isDaoViewTab } from './utils/daoNavigation';
import {
  getMockUserParticipatedDiscussionIds,
  getMockUserParticipatedProposalIds,
} from './utils/daoProposalVote.mock';
import styles from './DaoPage.module.scss';

type DaoParticipatedListFocus = 'proposals' | 'discussions';

const DaoHomePage: React.FC = () => {
  const { t, ready } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { address } = useAccount();
  const mainListRef = useRef<HTMLDivElement>(null);
  const tabFromUrl = searchParams.get('tab');
  const initialTab: DaoViewTab = isDaoViewTab(tabFromUrl) ? tabFromUrl : DAO_DEFAULT_VIEW_TAB;

  const [tab, setTab] = useState<DaoViewTab>(initialTab);
  const [participatedFocus, setParticipatedFocus] = useState<DaoParticipatedListFocus | null>(null);
  const [proposalFilter, setProposalFilter] = useState<DaoProposalFilter>('all');
  const [discussionCategoryFilter, setDiscussionCategoryFilter] =
    useState<DaoDiscussionCategoryFilter>('all');
  const [discussionTagFilter, setDiscussionTagFilter] = useState<DaoDiscussionTopicTagFilter>('all');
  const [eventFilter, setEventFilter] = useState<DaoEventFilter>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (isDaoViewTab(tabFromUrl) && tabFromUrl !== tab) {
      setTab(tabFromUrl);
      setPage(1);
      setParticipatedFocus(null);
    }
  }, [tabFromUrl, tab]);

  const openDiscord = useCallback(() => {
    window.open(DAO_DISCORD_URL, '_blank', 'noopener,noreferrer');
  }, []);

  useEffect(() => {
    if (!address) {
      setParticipatedFocus(null);
    }
  }, [address]);

  const participatedIds = useMemo(() => {
    if (!address || !participatedFocus) return null;
    if (participatedFocus === 'proposals') {
      return getMockUserParticipatedProposalIds(address);
    }
    return getMockUserParticipatedDiscussionIds(address);
  }, [address, participatedFocus]);

  const onTabChange = useCallback(
    (next: DaoViewTab) => {
      setTab(next);
      setPage(1);
      setParticipatedFocus(null);
      setSearchParams(next === DAO_DEFAULT_VIEW_TAB ? {} : { tab: next }, { replace: true });
      if (next !== 'discussions') {
        setDiscussionCategoryFilter('all');
        setDiscussionTagFilter('all');
      }
    },
    [setSearchParams],
  );

  const onViewParticipated = useCallback(
    (focus: DaoParticipatedListFocus) => {
      setTab(focus);
      setParticipatedFocus(focus);
      setPage(1);
      setSearchParams({ tab: focus }, { replace: true });
      if (focus !== 'discussions') {
        setDiscussionCategoryFilter('all');
        setDiscussionTagFilter('all');
      }
      mainListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    [setSearchParams],
  );

  const onProposalFilterChange = useCallback((f: DaoProposalFilter) => {
    setProposalFilter(f);
    setPage(1);
  }, []);

  const onDiscussionCategoryFilterChange = useCallback((f: DaoDiscussionCategoryFilter) => {
    setDiscussionCategoryFilter(f);
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

  const onEventClick = useCallback(
    (id: string) => {
      navigate(daoEventPath(id));
    },
    [navigate],
  );

  const onProposalClick = useCallback(
    (id: string) => {
      navigate(daoProposalPath(id));
    },
    [navigate],
  );

  const onDiscussionClick = useCallback(
    (id: string) => {
      navigate(daoDiscussionPath(id));
    },
    [navigate],
  );

  const onCreateProposal = useCallback(() => {
    navigate(daoProposalCreatePath);
  }, [navigate]);

  if (!ready) {
    return (
      <div className="p-6 text-sm text-slate-400" aria-busy="true">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className={styles.contentZoneInner}>
      <div ref={mainListRef}>
        <DaoMainListCard
          tab={tab}
          onTabChange={onTabChange}
          participatedIds={participatedIds}
          proposalFilter={proposalFilter}
          discussionCategoryFilter={discussionCategoryFilter}
          discussionTagFilter={discussionTagFilter}
          eventFilter={eventFilter}
          onProposalFilterChange={onProposalFilterChange}
          onDiscussionCategoryFilterChange={onDiscussionCategoryFilterChange}
          onDiscussionTagFilterChange={onDiscussionTagFilterChange}
          onEventFilterChange={onEventFilterChange}
          page={page}
          onPageChange={setPage}
          onDiscussionClick={onDiscussionClick}
          onProposalClick={onProposalClick}
          onEventClick={onEventClick}
        />
      </div>
      <div className={styles.sidebarColumn}>
        <DaoParticipationCard
          onCreateProposal={onCreateProposal}
          onStartDiscussion={openDiscord}
          onViewParticipated={onViewParticipated}
        />
        <DaoTabOverviewCard tab={tab} onTrendingItemClick={onDiscussionClick} />
        {tab === 'proposals' ? <DaoProposalRulesCard /> : null}
        {tab === 'discussions' ? (
          <DaoDiscussionTopicTagsCard
            activeFilter={discussionTagFilter}
            onFilterChange={onDiscussionTagFilterChange}
          />
        ) : null}
      </div>
    </div>
  );
};

export default DaoHomePage;



