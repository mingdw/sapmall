import {
  DAO_DISCUSSIONS,
  DAO_EVENTS,
  DAO_METRICS_DISCUSSIONS,
  DAO_METRICS_PROPOSALS,
  DAO_PROPOSALS,
} from './dao.mock';
import type { DaoEventCategory, DaoOverviewStatTone, DaoTabOverviewData, DaoViewTab } from '../types';

const metricValue = (metrics: { id: string; value: string }[], id: string, fallback: string) =>
  metrics.find((m) => m.id === id)?.value ?? fallback;

const metricNumber = (metrics: { id: string; value: string }[], id: string, fallback: number) => {
  const raw = metrics.find((m) => m.id === id)?.value;
  if (!raw) return fallback;
  const n = Number(raw.replace(/,/g, ''));
  return Number.isFinite(n) ? n : fallback;
};

const countProposals = () => {
  const active = DAO_PROPOSALS.filter((p) => p.status === 'active').length;
  const passed = DAO_PROPOSALS.filter((p) => p.status === 'passed').length;
  const pending = DAO_PROPOSALS.filter((p) => p.status === 'pending').length;
  return { total: DAO_PROPOSALS.length, active, passed, pending };
};

/** 与 list 文案 publishedAt 对应，用于时间轴排序 */
const EVENT_PUBLISHED_AT_SORT: Record<string, string> = {
  e1: '2026-05-18',
  e2: '2026-05-15',
  e3: '2026-05-10',
  e4: '2026-05-08',
  e5: '2026-05-02',
  e6: '2026-04-28',
  e7: '2026-04-22',
  e8: '2026-04-18',
  e9: '2026-04-12',
  e10: '2026-04-08',
  e11: '2026-04-02',
};

const eventCategoryTone = (category: DaoEventCategory): DaoOverviewStatTone => {
  if (category === 'ama') return 'sky';
  if (category === 'grant') return 'amber';
  if (category === 'milestone') return 'emerald';
  return 'violet';
};

export const getDaoTabOverview = (tab: DaoViewTab): DaoTabOverviewData => {
  if (tab === 'proposals') {
    const { active, passed, pending } = countProposals();
    const activeN = metricNumber(DAO_METRICS_PROPOSALS, 'active', active);
    const passedN = metricNumber(DAO_METRICS_PROPOSALS, 'passed', passed);
    const pendingN = metricNumber(DAO_METRICS_PROPOSALS, 'pending', pending);
    const totalN = metricNumber(DAO_METRICS_PROPOSALS, 'total', activeN + passedN + pendingN);

    return {
      layout: 'donut',
      titleKey: 'dao.overview.proposals.title',
      subtitleKey: 'dao.overview.proposals.subtitle',
      accent: 'violet',
      donut: {
        total: totalN,
        totalDisplay: metricValue(DAO_METRICS_PROPOSALS, 'total', String(totalN)),
        slices: [
          {
            id: 'active',
            labelKey: 'dao.metrics.proposals.active',
            value: activeN,
            displayValue: metricValue(DAO_METRICS_PROPOSALS, 'active', String(active)),
            tone: 'emerald',
          },
          {
            id: 'passed',
            labelKey: 'dao.metrics.proposals.passed',
            value: passedN,
            displayValue: metricValue(DAO_METRICS_PROPOSALS, 'passed', String(passed)),
            tone: 'violet',
          },
          {
            id: 'pending',
            labelKey: 'dao.metrics.proposals.pending',
            value: pendingN,
            displayValue: metricValue(DAO_METRICS_PROPOSALS, 'pending', String(pending)),
            tone: 'amber',
          },
        ],
        participation: {
          labelKey: 'dao.overview.proposals.participation',
          value: '68%',
        },
      },
      footnoteKey: 'dao.overview.proposals.footnote',
    };
  }

  if (tab === 'discussions') {
    const pool = [...DAO_DISCUSSIONS]
      .sort((a, b) => b.replies - a.replies || b.views - a.views)
      .map((d, index) => ({
        id: `tr-${d.id}`,
        discussionId: d.id,
        titleKey: d.titleKey,
        metricValue: d.replies,
        showHotTag: index < 6 || d.tags.includes('hot') || d.tags.includes('pinned'),
      }));

    return {
      layout: 'trendingList',
      titleKey: 'dao.overview.trending.title',
      subtitleKey: '',
      accent: 'amber',
      pool,
      pageSize: 10,
      footnoteKey: 'dao.overview.trending.footnote',
    };
  }

  const items = [...DAO_EVENTS]
    .sort(
      (a, b) =>
        (EVENT_PUBLISHED_AT_SORT[b.id] ?? '').localeCompare(EVENT_PUBLISHED_AT_SORT[a.id] ?? ''),
    )
    .map((event) => ({
      id: `tl-${event.id}`,
      eventId: event.id,
      titleKey: event.titleKey,
      excerptKey: event.excerptKey,
      categoryKey: event.categoryKey,
      category: event.category,
      publishedAtKey: event.publishedAtKey,
      publishedAtSort: EVENT_PUBLISHED_AT_SORT[event.id] ?? '1970-01-01',
      tone: eventCategoryTone(event.category),
      isHighlight: event.category === 'milestone',
    }));

  return {
    layout: 'timeline',
    titleKey: 'dao.overview.milestones.title',
    subtitleKey: 'dao.overview.milestones.subtitle',
    accent: 'emerald',
    items,
    footnoteKey: 'dao.overview.milestones.footnote',
  };
};
