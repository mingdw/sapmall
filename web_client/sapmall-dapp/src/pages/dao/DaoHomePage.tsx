import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { DAO_DEFAULT_VIEW_TAB } from './constants/daoViewTabs';
import DaoMainListCard from './components/DaoMainListCard';
import DaoParticipationCard from './components/DaoParticipationCard';
import DaoProposalRulesCard from './components/DaoProposalRulesCard';
import DaoTabOverviewCard from './components/DaoTabOverviewCard';
import DaoDiscussionTopicTagsCard from './components/DaoDiscussionTopicTagsCard';
import type { DaoDiscussionTopicTagFilter } from './constants/discussionTopicTags';
import type { DaoDiscussionCategoryFilter, DaoEventFilter, DaoProposalFilter, DaoViewTab } from './types';
import {
  DAO_DISCUSSION_BOARD_PARAM,
  daoEventPath,
  daoProposalCreatePath,
  daoProposalPath,
  daoDiscussionPath,
  daoDiscussionCreatePath,
  isDaoViewTab,
  readDaoDiscussionBoardFromSearch,
} from './utils/daoNavigation';
import {
  getMockUserParticipatedDiscussionIds,
  getMockUserParticipatedProposalIds,
} from './utils/daoProposalVote.mock';
import pageLayoutStyles from './styles/dao.pageLayout.module.scss';

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
    useState<DaoDiscussionCategoryFilter>(() =>
      initialTab === 'discussions'
        ? readDaoDiscussionBoardFromSearch(
            searchParams.toString() ? `?${searchParams.toString()}` : '',
          )
        : 'all',
    );
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

  useEffect(() => {
    if (tab !== 'discussions') return;
    const board = readDaoDiscussionBoardFromSearch(
      searchParams.toString() ? `?${searchParams.toString()}` : '',
    );
    setDiscussionCategoryFilter((prev) => {
      if (prev === board) return prev;
      setPage(1);
      return board;
    });
  }, [searchParams, tab]);

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

  const syncDiscussionBoardToUrl = useCallback(
    (board: DaoDiscussionCategoryFilter) => {
      const params = new URLSearchParams({ tab: 'discussions' });
      if (board !== 'all') {
        params.set(DAO_DISCUSSION_BOARD_PARAM, board);
      }
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  const onTabChange = useCallback(
    (next: DaoViewTab) => {
      setTab(next);
      setPage(1);
      setParticipatedFocus(null);
      if (next === 'discussions') {
        syncDiscussionBoardToUrl(discussionCategoryFilter);
      } else {
        setSearchParams(next === DAO_DEFAULT_VIEW_TAB ? {} : { tab: next }, { replace: true });
        setDiscussionCategoryFilter('all');
        setDiscussionTagFilter('all');
      }
    },
    [discussionCategoryFilter, setSearchParams, syncDiscussionBoardToUrl],
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

  const onDiscussionCategoryFilterChange = useCallback(
    (f: DaoDiscussionCategoryFilter) => {
      setDiscussionCategoryFilter(f);
      setPage(1);
      if (tab === 'discussions') {
        syncDiscussionBoardToUrl(f);
      }
    },
    [syncDiscussionBoardToUrl, tab],
  );

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

  const onStartDiscussion = useCallback(() => {
    navigate(daoDiscussionCreatePath);
  }, [navigate]);

  if (!ready) {
    return (
      <div className="p-6 text-sm text-slate-400" aria-busy="true">
        {t('common.loading')}
      </div>
    );
  }

  return (
    <div className={pageLayoutStyles.contentZoneInner}>
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
      <div className={pageLayoutStyles.sidebarColumn}>
        <DaoParticipationCard
          onCreateProposal={onCreateProposal}
          onStartDiscussion={onStartDiscussion}
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



