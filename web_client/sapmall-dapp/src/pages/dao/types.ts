export type DaoViewTab = 'proposals' | 'discussions' | 'events';

export type DaoOverviewAccent = 'emerald' | 'violet' | 'amber';

export type DaoOverviewStatTone = 'emerald' | 'violet' | 'amber' | 'sky' | 'rose' | 'slate';

export type DaoOverviewStat = {
  id: string;
  labelKey: string;
  value: string;
  tone?: DaoOverviewStatTone;
};

export type DaoOverviewSegment = {
  id: string;
  labelKey: string;
  value: number;
  displayValue: string;
  tone: DaoOverviewStatTone;
};

export type DaoOverviewTrendingItem = {
  id: string;
  discussionId: string;
  titleKey: string;
  /** 用于排序与展示的热度值（如回复数） */
  metricValue: number;
  showHotTag: boolean;
};

export type DaoOverviewTimelineItem = {
  id: string;
  eventId: string;
  titleKey: string;
  excerptKey: string;
  categoryKey: string;
  category: DaoEventCategory;
  publishedAtKey: string;
  /** ISO 日期 YYYY-MM-DD，用于排序 */
  publishedAtSort: string;
  tone: DaoOverviewStatTone;
  isHighlight?: boolean;
};

type DaoTabOverviewBase = {
  titleKey: string;
  subtitleKey: string;
  accent: DaoOverviewAccent;
  footnoteKey?: string;
};

export type DaoTabOverviewDonut = DaoTabOverviewBase & {
  layout: 'donut';
  donut: {
    total: number;
    totalDisplay: string;
    slices: DaoOverviewSegment[];
    participation: {
      labelKey: string;
      value: string;
    };
  };
};

export type DaoTabOverviewTrendingList = DaoTabOverviewBase & {
  layout: 'trendingList';
  /** 全量热度池，组件内换一换轮换展示 */
  pool: DaoOverviewTrendingItem[];
  pageSize: number;
};

export type DaoTabOverviewTimeline = DaoTabOverviewBase & {
  layout: 'timeline';
  items: DaoOverviewTimelineItem[];
};

export type DaoTabOverviewData =
  | DaoTabOverviewDonut
  | DaoTabOverviewTrendingList
  | DaoTabOverviewTimeline;

export type DaoHeroDimension = 'discussions' | 'proposals' | 'events';

export type DaoProposalStatus = 'active' | 'passed' | 'pending';

export type DaoProposalFilter = 'all' | 'active' | 'passed' | 'pending';

export type DaoDiscussionCategory = 'hot' | 'marketplace' | 'community';

export type DaoDiscussionCategoryFilter = 'all' | DaoDiscussionCategory;

/** 讨论话题标签（列表标题后、侧栏筛选） */
export type DaoDiscussionTopicTag =
  | 'pinned'
  | 'hot'
  | 'urgent'
  | 'trendingWeek'
  | 'official'
  | 'featured'
  | 'governance'
  | 'new'
  | 'poll'
  | 'bounty'
  | 'qa'
  | 'feedback'
  | 'resolved';

export type DaoEventCategory = 'ama' | 'grant' | 'milestone' | 'announcement';

export type DaoEventFilter = 'all' | DaoEventCategory;

export type DaoEventItem = {
  id: string;
  imageUrl: string;
  titleKey: string;
  excerptKey: string;
  category: DaoEventCategory;
  categoryKey: string;
  publishedAtKey: string;
  views: number;
};

export type DaoEventDetailBlock =
  | { type: 'paragraph'; key: string }
  | { type: 'heading'; level: 2 | 3; key: string }
  | { type: 'image'; srcKey?: string; src?: string; altKey: string; captionKey?: string }
  | { type: 'callout'; variant: 'info' | 'highlight'; key: string }
  | { type: 'bulletList'; key: string };

export type DaoEventDetail = DaoEventItem & {
  blocks: DaoEventDetailBlock[];
};

export type DaoMetric = {
  id: string;
  labelKey: string;
  value: string;
  externalLink?: 'discord';
};

export type DaoHeroAsideKind = 'inlineStats' | 'governance' | 'spotlight';

export type DaoHeroAsideIcon =
  | 'message'
  | 'store'
  | 'users'
  | 'vote'
  | 'check'
  | 'clock'
  | 'radio'
  | 'calendar'
  | 'coins'
  | 'flag';

export type DaoHeroAsideItem = {
  id: string;
  icon: DaoHeroAsideIcon;
  labelKey: string;
  value?: string;
  externalLink?: 'discord';
};

export type DaoHeroSlide = {
  id: DaoHeroDimension;
  icon: 'discussions' | 'proposals' | 'events';
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  asideKind: DaoHeroAsideKind;
  asideItems?: DaoHeroAsideItem[];
  spotlight?: {
    headlineKey: string;
    metaKey: string;
    footnoteKey?: string;
  };
  layout: 'split' | 'feature';
};

export type DaoProposalReference = {
  labelKey: string;
  url: string;
};

export type DaoProposalTimelineStepId = 'created' | 'open' | 'closed' | 'executed';

export type DaoProposalTimelineStep = {
  id: DaoProposalTimelineStepId;
  labelKey: string;
  atKey: string;
  status: 'done' | 'current' | 'pending';
};

export type DaoProposalDetailBlock = DaoEventDetailBlock;

export type DaoProposalItem = {
  id: string;
  titleKey: string;
  authorAddress: string;
  summaryKey: string;
  status: DaoProposalStatus;
  statusKey: string;
  tagKeys: string[];
  startAtKey: string;
  endAtKey: string;
  votesFor: number;
  votesAgainst: number;
  /** 赞成/反对参与人数（Mock） */
  votersFor: number;
  votersAgainst: number;
};

export type DaoProposalDetail = DaoProposalItem & {
  blocks: DaoProposalDetailBlock[];
  quorumRequired: number;
  differentialRequired: number;
  votingNetworkKey: string;
  forumUrl: string;
  references: DaoProposalReference[];
  timeline: DaoProposalTimelineStep[];
  createdAtKey: string;
};

export type DaoProposalVoteChoice = 'for' | 'against';

export type DaoProposalDraft = {
  title: string;
  summary: string;
  tagKeys: string[];
  startAt: string;
  endAt: string;
  motivation: string;
  specification: string;
  callout: string;
  referenceForum: string;
  referenceImplementation: string;
};

export type DaoDiscussionItem = {
  id: string;
  titleKey: string;
  channelKey: string;
  excerptKey: string;
  category: DaoDiscussionCategory;
  replies: number;
  views: number;
  /** 可多选；展示与排序按 pinned → hot → … 顺序 */
  tags: DaoDiscussionTopicTag[];
};

export type DaoDiscussionDetailBlock = DaoEventDetailBlock;

export type DaoDiscussionReplyItem = {
  id: string;
  authorAddress: string;
  /** Mock 回复文案 i18n key */
  bodyKey?: string;
  /** 用户发表回复正文 */
  body?: string;
  /** Mock 回复时间 i18n key */
  publishedAtKey?: string;
  /** 用户回复 Unix ms */
  createdAt?: number;
  isOfficial?: boolean;
  likes: number;
};

export type DaoDiscussionDetail = DaoDiscussionItem & {
  authorAddress: string;
  activityKey: string;
  blocks: DaoDiscussionDetailBlock[];
};
