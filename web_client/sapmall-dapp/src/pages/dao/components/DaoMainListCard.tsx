import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Pagination, Select } from 'antd';
import type { LucideIcon } from 'lucide-react';
import { Eye, FileText, MessageCircle, MessagesSquare, Search, Sparkles } from 'lucide-react';
import { DAO_PAGE_SIZE, getDaoEventFallbackImageUrl } from '../constants';
import { DAO_VIEW_TAB_ORDER } from '../constants/daoViewTabs';
import { DAO_EVENTS, DAO_PROPOSALS } from '../mocks/dao.mock';
import { getMergedDaoDiscussions } from '../utils/daoDiscussionsList';
import {
  getDiscussionChannel,
  getDiscussionExcerpt,
  getDiscussionTitle,
} from '../utils/daoDiscussionDisplay';
import { discussionMatchesCategoryFilter } from '../constants/discussionCategories';
import DaoDiscussionCategoryBrowse, {
  type DaoDiscussionCategoryCounts,
} from './DaoDiscussionCategoryBrowse';
import {
  discussionMatchesTopicTagFilter,
  sortDiscussionTopicTags,
  sortDiscussionsForList,
  type DaoDiscussionTopicTagFilter,
} from '../constants/discussionTopicTags';
import type {
  DaoDiscussionCategory,
  DaoDiscussionCategoryFilter,
  DaoDiscussionItem,
  DaoEventFilter,
  DaoEventItem,
  DaoProposalFilter,
  DaoProposalItem,
  DaoViewTab,
} from '../types';
import { shortenWalletAddress } from '../utils/walletAddress';
import listTagStyles from '../styles/dao.listTags.module.scss';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoMainListCard.module.scss';

const PROPOSAL_FILTER_OPTIONS: DaoProposalFilter[] = ['all', 'active', 'passed', 'pending'];
const EVENT_FILTER_OPTIONS: DaoEventFilter[] = ['all', 'ama', 'grant', 'milestone', 'announcement'];

const statusClass: Record<DaoProposalItem['status'], string> = {
  active: listTagStyles.statusActive,
  passed: listTagStyles.statusPassed,
  pending: listTagStyles.statusPending,
};

const topicTagClass: Record<string, string> = {
  'dao.list.proposals.tags.governance': listTagStyles.topicTagGovernance,
  'dao.list.proposals.tags.treasury': listTagStyles.topicTagTreasury,
  'dao.list.proposals.tags.marketplace': listTagStyles.topicTagMarketplace,
  'dao.list.proposals.tags.staking': listTagStyles.topicTagStaking,
  'dao.list.proposals.tags.grant': listTagStyles.topicTagGrant,
  'dao.list.proposals.tags.multisig': listTagStyles.topicTagMultisig,
  'dao.list.proposals.tags.security': listTagStyles.topicTagSecurity,
};

const eventCategoryClass: Record<DaoEventItem['category'], string> = {
  ama: listTagStyles.eventTagAma,
  grant: listTagStyles.eventTagGrant,
  milestone: listTagStyles.eventTagMilestone,
  announcement: listTagStyles.eventTagAnnouncement,
};

const listTabIconMap: Record<DaoViewTab, LucideIcon> = {
  events: Sparkles,
  discussions: MessageCircle,
  proposals: FileText,
};

type Props = {
  tab: DaoViewTab;
  onTabChange: (tab: DaoViewTab) => void;
  participatedIds?: string[] | null;
  proposalFilter: DaoProposalFilter;
  discussionCategoryFilter: DaoDiscussionCategoryFilter;
  discussionTagFilter: DaoDiscussionTopicTagFilter;
  eventFilter: DaoEventFilter;
  onProposalFilterChange: (f: DaoProposalFilter) => void;
  onDiscussionCategoryFilterChange: (f: DaoDiscussionCategoryFilter) => void;
  onDiscussionTagFilterChange: (f: DaoDiscussionTopicTagFilter) => void;
  onEventFilterChange: (f: DaoEventFilter) => void;
  page: number;
  onPageChange: (p: number) => void;
  onDiscussionClick: (id: string) => void;
  onProposalClick: (id: string) => void;
  onEventClick: (id: string) => void;
};

const DaoMainListCard: React.FC<Props> = ({
  tab,
  onTabChange,
  participatedIds = null,
  proposalFilter,
  discussionCategoryFilter,
  discussionTagFilter,
  eventFilter,
  onProposalFilterChange,
  onDiscussionCategoryFilterChange,
  onDiscussionTagFilterChange,
  onEventFilterChange,
  page,
  onPageChange,
  onDiscussionClick,
  onProposalClick,
  onEventClick,
}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const participatedIdSet = useMemo(
    () => (participatedIds && participatedIds.length > 0 ? new Set(participatedIds) : null),
    [participatedIds],
  );

  const proposalFiltered = useMemo(() => {
    let list = DAO_PROPOSALS;
    if (participatedIdSet && tab === 'proposals') {
      list = list.filter((p) => participatedIdSet.has(p.id));
    }
    if (proposalFilter !== 'all') {
      list = list.filter((p) => p.status === proposalFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const hay = `${t(p.titleKey)} ${t(p.summaryKey)} ${p.authorAddress}`.toLowerCase();
      return hay.includes(q);
    });
  }, [proposalFilter, search, t, participatedIdSet, tab]);

  const discussionCategoryCounts = useMemo((): DaoDiscussionCategoryCounts => {
    let list = getMergedDaoDiscussions().filter((d) =>
      discussionMatchesTopicTagFilter(d, discussionTagFilter),
    );
    if (participatedIdSet && tab === 'discussions') {
      list = list.filter((d) => participatedIdSet.has(d.id));
    }
    const byCategory: Record<DaoDiscussionCategory, number> = {
      hot: 0,
      marketplace: 0,
      community: 0,
    };
    for (const item of list) {
      byCategory[item.category] += 1;
    }
    return { total: list.length, byCategory };
  }, [discussionTagFilter, participatedIdSet, tab]);

  const discussionFiltered = useMemo(() => {
    let list = getMergedDaoDiscussions().filter(
      (d) =>
        discussionMatchesCategoryFilter(d, discussionCategoryFilter) &&
        discussionMatchesTopicTagFilter(d, discussionTagFilter),
    );
    if (participatedIdSet && tab === 'discussions') {
      list = list.filter((d) => participatedIdSet.has(d.id));
    }
    list = sortDiscussionsForList(list);
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((d) => {
      const tagHay = d.tags.map((tag) => t(`dao.topicTags.${tag}`)).join(' ');
      const hay = `${getDiscussionTitle(d, t)} ${getDiscussionExcerpt(d, t)} ${getDiscussionChannel(d, t)} ${tagHay}`.toLowerCase();
      return hay.includes(q);
    });
  }, [discussionCategoryFilter, discussionTagFilter, search, t, participatedIdSet, tab]);

  const eventFiltered = useMemo(() => {
    let list = DAO_EVENTS;
    if (eventFilter !== 'all') {
      list = list.filter((e) => e.category === eventFilter);
    }
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter((e) => {
      const hay = `${t(e.titleKey)} ${t(e.excerptKey)} ${t(e.categoryKey)}`.toLowerCase();
      return hay.includes(q);
    });
  }, [eventFilter, search, t]);

  const activeList =
    tab === 'proposals'
      ? proposalFiltered
      : tab === 'discussions'
        ? discussionFiltered
        : eventFiltered;

  const pageItems = useMemo(() => {
    const start = (page - 1) * DAO_PAGE_SIZE;
    return activeList.slice(start, start + DAO_PAGE_SIZE);
  }, [activeList, page]);

  const onTabSwitch = (next: DaoViewTab) => {
    setSearch('');
    onTabChange(next);
  };

  const showToolbarFilter = tab !== 'discussions';

  const filterValue = tab === 'proposals' ? proposalFilter : eventFilter;

  const filterOptions: { value: string; label: string }[] =
    tab === 'proposals'
      ? PROPOSAL_FILTER_OPTIONS.map((f) => ({ value: f, label: t(`dao.filters.proposals.${f}`) }))
      : EVENT_FILTER_OPTIONS.map((f) => ({ value: f, label: t(`dao.filters.events.${f}`) }));

  const onFilterSelect = (value: string) => {
    if (tab === 'proposals') {
      onProposalFilterChange(value as DaoProposalFilter);
    } else {
      onEventFilterChange(value as DaoEventFilter);
    }
  };

  const formatViews = (views: number) => views.toLocaleString();

  return (
    <div className={`${sharedStyles.panelCard} ${styles.mainListCard}`}>
      <div className={styles.listToolbar}>
        <div className={styles.listTabRail} role="tablist" aria-label={t('dao.list.tabListAria')}>
          {DAO_VIEW_TAB_ORDER.map((tabKey) => {
            const TabIcon = listTabIconMap[tabKey];
            return (
              <button
                key={tabKey}
                type="button"
                role="tab"
                aria-selected={tab === tabKey}
                className={styles.listTabBtn}
                data-active={tab === tabKey}
                data-tab={tabKey}
                onClick={() => onTabSwitch(tabKey)}
              >
                <TabIcon className={styles.listTabIcon} strokeWidth={2.25} aria-hidden />
                <span>{t(`dao.tabs.${tabKey}`)}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.listToolbarRight}>
          {showToolbarFilter ? (
            <label className={styles.filterLabel}>
              <span className="sr-only">{t('dao.list.filterLabel')}</span>
              <Select
                className={styles.filterSelect}
                value={filterValue}
                options={filterOptions}
                onChange={onFilterSelect}
                popupMatchSelectWidth={false}
              />
            </label>
          ) : null}
          <Input
            className={styles.searchInput}
            placeholder={t('dao.list.searchPlaceholder')}
            prefix={<Search className="h-4 w-4 text-slate-400" aria-hidden />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onPageChange(1);
            }}
            allowClear
          />
        </div>
      </div>

      {tab === 'discussions' ? (
        <DaoDiscussionCategoryBrowse
          activeCategory={discussionCategoryFilter}
          counts={discussionCategoryCounts}
          onCategorySelect={(category) => {
            onDiscussionCategoryFilterChange(category);
            onPageChange(1);
          }}
        />
      ) : null}

      <div className={tab === 'events' ? styles.listBodyEvents : styles.listBody}>
        {pageItems.length === 0 ? (
          <p className={styles.emptyState}>{t('dao.list.empty')}</p>
        ) : tab === 'proposals' ? (
          (pageItems as DaoProposalItem[]).map((row) => {
            const total = row.votesFor + row.votesAgainst;
            const forPct = total > 0 ? (row.votesFor / total) * 100 : 0;
            const againstPct = total > 0 ? (row.votesAgainst / total) * 100 : 0;
            const forPctRounded = Math.round(forPct);
            const showVotes = row.status !== 'pending' && total > 0;

            return (
              <button
                key={row.id}
                type="button"
                className={`${styles.listRow} ${styles.listRowProposal}`}
                onClick={() => onProposalClick(row.id)}
              >
                <div className={styles.proposalHead}>
                  <FileText className={styles.proposalLeadIcon} strokeWidth={2} aria-hidden />
                  <div className={styles.proposalTitleRow}>
                    <div className={styles.proposalTitleMain}>
                      <div className={styles.proposalTitleLine}>
                        <span className={styles.listRowTitle}>{t(row.titleKey)}</span>
                        <div className={styles.proposalTagRow}>
                          <span className={statusClass[row.status]}>{t(row.statusKey)}</span>
                          {row.tagKeys.map((tagKey) => (
                            <span
                              key={tagKey}
                              className={`${styles.proposalTopicTag} ${topicTagClass[tagKey] ?? ''}`}
                            >
                              {t(tagKey)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className={styles.proposalAuthor}>
                        <span className={styles.proposalAuthorLabel}>
                          {t('dao.list.proposerLabel')}
                        </span>
                        <span className={styles.proposalAuthorAddr}>
                          {shortenWalletAddress(row.authorAddress)}
                        </span>
                      </p>
                      <p className={`${styles.listRowDesc} ${styles.proposalSummary}`}>
                        {t(row.summaryKey)}
                      </p>
                      {showVotes ? (
                        <div className={styles.proposalVotesWrap}>
                          <p className={styles.proposalVotes}>
                            <span className={styles.proposalVotesLeft}>
                              <span className={styles.voteForText}>
                                {t('dao.list.voteFor', { count: row.votesFor })}
                              </span>
                              <span className={styles.voteAgainstText}>
                                {t('dao.list.voteAgainst', { count: row.votesAgainst })}
                              </span>
                            </span>
                            <span
                              className={`${styles.voteForPct} ${
                                forPctRounded >= 50 ? styles.voteForPctHigh : styles.voteForPctLow
                              }`}
                            >
                              {t('dao.list.voteForPct', { pct: forPctRounded })}
                            </span>
                          </p>
                          <div className={styles.voteBar} aria-hidden>
                            <div className={styles.voteBarFor} style={{ width: `${forPct}%` }} />
                            <div
                              className={styles.voteBarAgainst}
                              style={{ width: `${againstPct}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div className={styles.proposalTimeRange}>
                      <span
                        className={styles.proposalTimeItemStart}
                        title={t('dao.list.startsAt', { date: t(row.startAtKey) })}
                      >
                        <span className={styles.proposalTimeLabel}>
                          {t('dao.list.startsAtLabel')}
                        </span>
                        <span className={styles.proposalTimeDate}>{t(row.startAtKey)}</span>
                      </span>
                      <span
                        className={styles.proposalTimeItemEnd}
                        title={t('dao.list.endsAt', { date: t(row.endAtKey) })}
                      >
                        <span className={styles.proposalTimeLabel}>
                          {t('dao.list.endsAtLabel')}
                        </span>
                        <span className={styles.proposalTimeDate}>{t(row.endAtKey)}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : tab === 'discussions' ? (
          (pageItems as DaoDiscussionItem[]).map((row) => (
            <button
              key={row.id}
              type="button"
              className={`${styles.listRow} ${styles.listRowDiscussion}`}
              onClick={() => onDiscussionClick(row.id)}
            >
              <div className={styles.discussionHead}>
                <MessageCircle className={styles.discussionLeadIcon} aria-hidden />
                <div className={styles.discussionBody}>
                  <div className={styles.discussionTitleRow}>
                    <div className={styles.discussionTitleMain}>
                      <span className={styles.listRowTitle}>{getDiscussionTitle(row, t)}</span>
                      <span className={styles.discussionChannelTag}>{getDiscussionChannel(row, t)}</span>
                    </div>
                    {row.tags.length > 0 ? (
                      <div className={styles.discussionTagsRow}>
                        {sortDiscussionTopicTags(row.tags).map((tag) => (
                          <span
                            key={tag}
                            className={styles.discussionTopicTag}
                            data-tag={tag}
                          >
                            {t(`dao.topicTags.${tag}`)}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <p className={styles.discussionExcerpt}>{getDiscussionExcerpt(row, t)}</p>
                  <div className={styles.discussionFooter}>
                    <span className={styles.discussionStat}>
                      <MessagesSquare
                        className={`${styles.discussionStatIcon} ${styles.discussionStatIconReply}`}
                        strokeWidth={2}
                        aria-hidden
                      />
                      {t('dao.list.discussionReplies', { count: row.replies })}
                    </span>
                    <span className={styles.discussionStat}>
                      <Eye
                        className={`${styles.discussionStatIcon} ${styles.discussionStatIconView}`}
                        strokeWidth={2}
                        aria-hidden
                      />
                      {t('dao.list.discussionViews', { views: formatViews(row.views) })}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))
        ) : (
          (pageItems as DaoEventItem[]).map((row) => (
            <button
              key={row.id}
              type="button"
              className={styles.eventRow}
              onClick={() => onEventClick(row.id)}
            >
              <div className={styles.eventThumb}>
                <img
                  src={row.imageUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (img.dataset.fallback === 'svg') {
                      return;
                    }
                    img.dataset.fallback = 'svg';
                    img.src = getDaoEventFallbackImageUrl(row.id);
                  }}
                />
              </div>
              <div className={styles.eventBody}>
                <div className={styles.eventTitleRow}>
                  <div className={styles.eventTitleMain}>
                    <h3 className={styles.eventTitle}>{t(row.titleKey)}</h3>
                    <span className={`${styles.eventTag} ${eventCategoryClass[row.category]}`}>
                      {t(row.categoryKey)}
                    </span>
                  </div>
                  <time className={styles.eventTime} dateTime={t(row.publishedAtKey)}>
                    {t(row.publishedAtKey)}
                  </time>
                </div>
                <p className={styles.eventExcerpt}>{t(row.excerptKey)}</p>
                <p className={styles.eventMeta}>
                  <Eye className={styles.eventMetaIcon} strokeWidth={2} aria-hidden />
                  {t('dao.list.eventMeta', { views: formatViews(row.views) })}
                </p>
              </div>
            </button>
          ))
        )}
      </div>

      {Math.ceil(activeList.length / DAO_PAGE_SIZE) > 1 ? (
        <div className={styles.paginationWrap}>
          <Pagination
            current={page}
            pageSize={DAO_PAGE_SIZE}
            total={activeList.length}
            onChange={onPageChange}
            showSizeChanger={false}
            hideOnSinglePage={false}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DaoMainListCard;


