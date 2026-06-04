import type { DaoEventCategory, DaoOverviewStatTone } from '../types';

/** 与 daoTabOverview.global.scss 中的 class 名一致（全局样式，非 CSS Module） */

export const DAO_OVERVIEW_ACCENT: Record<'emerald' | 'violet' | 'amber', string> = {
  emerald: 'overviewCardEmerald',
  violet: 'overviewCardViolet',
  amber: 'overviewCardAmber',
};

export const DAO_OVERVIEW_CALLOUT: Record<DaoOverviewStatTone, string> = {
  emerald: 'overviewCalloutEmerald',
  violet: 'overviewCalloutViolet',
  amber: 'overviewCalloutAmber',
  sky: 'overviewCalloutSky',
  rose: 'overviewCalloutRose',
  slate: 'overviewCalloutSlate',
};

export const DAO_OVERVIEW_TIMELINE_DOT: Record<DaoOverviewStatTone, string> = {
  emerald: 'overviewTimelineDotEmerald',
  violet: 'overviewTimelineDotViolet',
  amber: 'overviewTimelineDotAmber',
  sky: 'overviewTimelineDotSky',
  rose: 'overviewTimelineDotRose',
  slate: 'overviewTimelineDotSlate',
};

export const DAO_OVERVIEW_TIMELINE_TAG: Record<DaoEventCategory, string> = {
  ama: 'overviewTimelineTagAma',
  grant: 'overviewTimelineTagGrant',
  milestone: 'overviewTimelineTagMilestone',
  announcement: 'overviewTimelineTagAnnouncement',
};

export const DAO_TRENDING_RANK_BULLET = [
  'trendingRankBullet1',
  'trendingRankBullet2',
  'trendingRankBullet3',
  'trendingRankBulletDefault',
] as const;
