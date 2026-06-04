import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Flag, Flame, RefreshCw } from 'lucide-react';
import type { DaoEventCategory } from '../types';
import { getDaoTabOverview } from '../mocks/daoTabOverview.mock';
import type {
  DaoOverviewSegment,
  DaoOverviewStatTone,
  DaoTabOverviewData,
  DaoViewTab,
} from '../types';
import {
  DAO_OVERVIEW_ACCENT,
  DAO_OVERVIEW_CALLOUT,
  DAO_OVERVIEW_TIMELINE_DOT,
  DAO_OVERVIEW_TIMELINE_TAG,
  DAO_TRENDING_RANK_BULLET,
} from '../constants/daoTabOverviewClassNames';
import sharedStyles from '../styles/dao.shared.module.scss';

const tabIconMap = {
  proposals: FileText,
  discussions: Flame,
  events: Flag,
} as const;

const formatTrendingMetric = (value: number): string => {
  if (value >= 10000) {
    const wan = value / 10000;
    return wan >= 100 ? `${Math.round(wan)}万` : `${wan.toFixed(1).replace(/\.0$/, '')}万`;
  }
  if (value >= 1000) {
    const k = value / 1000;
    return `${k.toFixed(1).replace(/\.0$/, '')}k`;
  }
  return String(value);
};

const trendingRankBulletClass = (rank: number): string =>
  DAO_TRENDING_RANK_BULLET[Math.min(rank, 3)] ?? DAO_TRENDING_RANK_BULLET[3];

const overviewAccentClass = DAO_OVERVIEW_ACCENT;

const donutToneColor: Record<DaoOverviewStatTone, string> = {
  emerald: '#34d399',
  violet: '#a78bfa',
  amber: '#fbbf24',
  sky: '#38bdf8',
  rose: '#fb7185',
  slate: '#94a3b8',
};

const calloutToneClass = DAO_OVERVIEW_CALLOUT;

/**
 * 涓?.overviewDonutChart 涓€鑷淬€?
 * conic-gradient锛?掳 = 12 鐐癸紝椤烘椂閽堝澶э紙涓?buildDonutGradient 鐨?from 瑙掍竴鑷达級銆?
 * rotate锛?掳 = 3 鐐癸紙绠ご榛樿鍚戝彸锛夛紝椤烘椂閽堝澶с€?
 */
const DONUT_CHART_PX = 152;
const DONUT_CONIC_FROM_DEG = 0;
const DONUT_STAGE = { width: 300, height: 220, cx: 150, cy: 110 };

const donutOuterRadius = () => DONUT_CHART_PX / 2;

/** 绠ご鍦ㄧ幆澶栧欢浼搁暱搴︼紙px锛夛紝璧风偣璐村缂樹笉杩涘叆鑹茬幆 */
const DONUT_CALLOUT_ARROW_LEN_PX = 18;

/** conic 瑙掞紙12 鐐逛负 0掳锛夆啋 CSS rotate 瑙掞紙3 鐐逛负 0掳锛?*/
const conicDegToRotateDeg = (conicDeg: number) => conicDeg - 90;

type DonutSliceArc = {
  slice: DaoOverviewSegment;
  conicMidDeg: number;
  rotateDeg: number;
  x: number;
  y: number;
  arrowLenPx: number;
};

const buildDonutSliceArcs = (slices: DaoOverviewSegment[]): DonutSliceArc[] => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const outerR = donutOuterRadius();
  let conicStartDeg = DONUT_CONIC_FROM_DEG;

  return slices.map((slice) => {
    const sweep = total > 0 ? (slice.value / total) * 360 : 120;
    const conicMidDeg = conicStartDeg + sweep / 2;
    conicStartDeg += sweep;

    const rotateDeg = conicDegToRotateDeg(conicMidDeg);
    const rad = (rotateDeg * Math.PI) / 180;
    const x = DONUT_STAGE.cx + outerR * Math.cos(rad);
    const y = DONUT_STAGE.cy + outerR * Math.sin(rad);

    return {
      slice,
      conicMidDeg,
      rotateDeg,
      x,
      y,
      arrowLenPx: DONUT_CALLOUT_ARROW_LEN_PX,
    };
  });
};

const timelineDotClass = DAO_OVERVIEW_TIMELINE_DOT;
const timelineTagClass = DAO_OVERVIEW_TIMELINE_TAG;

const buildDonutGradient = (slices: DaoOverviewSegment[]) => {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) {
    return '#e2e8f0';
  }

  let acc = 0;
  const stops = slices.map((slice) => {
    const start = (acc / total) * 100;
    acc += slice.value;
    const end = (acc / total) * 100;
    return `${donutToneColor[slice.tone]} ${start}% ${end}%`;
  });

  return `conic-gradient(from ${DONUT_CONIC_FROM_DEG}deg, ${stops.join(', ')})`;
};

const ProposalDonutBody: React.FC<{ overview: Extract<DaoTabOverviewData, { layout: 'donut' }> }> = ({
  overview,
}) => {
  const { t } = useTranslation();
  const gradient = useMemo(
    () => buildDonutGradient(overview.donut.slices),
    [overview.donut.slices],
  );
  const sliceArcs = useMemo(
    () => buildDonutSliceArcs(overview.donut.slices),
    [overview.donut.slices],
  );
  const sliceSummary = overview.donut.slices
    .map((s) => `${t(s.labelKey)} ${s.displayValue}`)
    .join('，');

  return (
    <div className="overviewDonutLayout">
      <div
        className="overviewDonutStage"
        role="img"
        aria-label={`${t(overview.donut.totalDisplay)} ${t('dao.overview.proposals.highlight')}，${sliceSummary}`}
      >
        <div className="overviewDonutChart">
          <div className="overviewDonutRing" style={{ background: gradient }} />
          <div className="overviewDonutHole">
            <span className="overviewDonutTotal">{overview.donut.totalDisplay}</span>
            <span className="overviewDonutTotalLabel">
              {t('dao.overview.proposals.highlight')}
            </span>
          </div>
        </div>
        {sliceArcs.map(({ slice, rotateDeg, x, y, arrowLenPx }) => (
          <div
            key={slice.id}
            className="overviewDonutCallout"
            style={{ left: x, top: y }}
          >
            <span
              className="overviewDonutCalloutRow"
              style={{ transform: `rotate(${rotateDeg}deg)` }}
            >
              <span
                className="overviewDonutCalloutArrow"
                style={{ width: arrowLenPx }}
                aria-hidden
              />
              <span
                className={`overviewDonutCalloutText ${calloutToneClass[slice.tone]}`}
                style={{ transform: `rotate(${-rotateDeg}deg)` }}
              >
                {t(slice.labelKey)} {slice.displayValue}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className="overviewParticipation">
        <span className="overviewParticipationLabel">
          {t(overview.donut.participation.labelKey)}
        </span>
        <span className="overviewParticipationValue">
          {overview.donut.participation.value}
        </span>
      </p>
    </div>
  );
};

const TrendingDiscussionsBody: React.FC<{
  overview: Extract<DaoTabOverviewData, { layout: 'trendingList' }>;
  offset: number;
  onItemClick?: (discussionId: string) => void;
}> = ({ overview, offset, onItemClick }) => {
  const { t } = useTranslation();

  const visibleItems = useMemo(() => {
    const len = overview.pool.length;
    if (len === 0) return [];
    const size = Math.min(overview.pageSize, len);
    return Array.from({ length: size }, (_, i) => overview.pool[(offset + i) % len]);
  }, [overview.pool, overview.pageSize, offset]);

  return (
    <div className="trendingLayout">
      <ol className="trendingList">
        {visibleItems.map((item, rank) => (
          <li key={`${item.id}-${offset}`} className="trendingItem">
            <span
              className={`trendingRankBullet ${trendingRankBulletClass(rank)}`}
              aria-hidden
            />
            <button
              type="button"
              className="trendingLink"
              onClick={() => onItemClick?.(item.discussionId)}
            >
              <span className="trendingTopic">{t(item.titleKey)}</span>
              <span className="trendingMeta">
                <span className="trendingMetric">
                  {formatTrendingMetric(item.metricValue)}
                </span>
                {item.showHotTag ? (
                  <span className="trendingHotTag">{t('dao.overview.trending.hotTag')}</span>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

const MilestoneTimelineBody: React.FC<{
  overview: Extract<DaoTabOverviewData, { layout: 'timeline' }>;
}> = ({ overview }) => {
  const { t } = useTranslation();

  return (
    <div className="overviewTimelineLayout">
      <ol className="overviewTimelineList">
        {overview.items.map((item, index) => (
          <li key={item.id} className="overviewTimelineItem">
            <div className="overviewTimelineRail" aria-hidden>
              <span
                className={`overviewTimelineDot ${timelineDotClass[item.tone]} ${
                  item.isHighlight ? 'overviewTimelineDotHighlight' : ''
                }`}
              />
              {index < overview.items.length - 1 ? (
                <span className="overviewTimelineLine" />
              ) : null}
            </div>
            <div className="overviewTimelineContent">
              <time className="overviewTimelineDate" dateTime={item.publishedAtSort}>
                {t(item.publishedAtKey)}
              </time>
              <div className="overviewTimelineTitleRow">
                <h3 className="overviewTimelineTitle">{t(item.titleKey)}</h3>
                <span className={`overviewTimelineTag ${timelineTagClass[item.category]}`}>
                  {t(item.categoryKey)}
                </span>
              </div>
              <p className="overviewTimelineExcerpt">{t(item.excerptKey)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

type Props = {
  tab: DaoViewTab;
  onTrendingItemClick?: (discussionId: string) => void;
};

const DaoTabOverviewCard: React.FC<Props> = ({ tab, onTrendingItemClick }) => {
  const { t } = useTranslation();
  const overview = useMemo(() => getDaoTabOverview(tab), [tab]);
  const TabIcon = tabIconMap[tab];
  const [trendingOffset, setTrendingOffset] = useState(0);

  useEffect(() => {
    setTrendingOffset(0);
  }, [tab]);

  const onTrendingRefresh = () => {
    if (overview.layout !== 'trendingList') return;
    const step = Math.min(3, Math.max(overview.pool.length, 1));
    setTrendingOffset((prev) => (prev + step) % Math.max(overview.pool.length, 1));
  };

  return (
    <aside
      className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard} overviewCard ${overviewAccentClass[overview.accent]}`}
      aria-labelledby="dao-overview-title"
    >
      <div
        className={`overviewHeader ${
          overview.layout === 'trendingList' ? 'overviewHeaderWithAction' : ''
        }`}
      >
        <div className="overviewTitleRow">
          <h2 id="dao-overview-title" className="overviewTitle">
            <TabIcon className="overviewTitleIcon" strokeWidth={2.25} aria-hidden />
            <span>{t(overview.titleKey)}</span>
          </h2>
          {overview.layout === 'trendingList' ? (
            <button type="button" className="trendingRefreshBtn" onClick={onTrendingRefresh}>
              <RefreshCw className="trendingRefreshIcon" strokeWidth={2} aria-hidden />
              <span>{t('dao.overview.trending.refresh')}</span>
            </button>
          ) : null}
        </div>
        {overview.subtitleKey ? (
          <p
            className={`overviewSubtitle ${
              overview.layout === 'donut' ? 'overviewSubtitleCenter' : ''
            }`}
          >
            {t(overview.subtitleKey)}
          </p>
        ) : null}
      </div>

      {overview.layout === 'donut' ? <ProposalDonutBody overview={overview} /> : null}
      {overview.layout === 'trendingList' ? (
        <TrendingDiscussionsBody
          overview={overview}
          offset={trendingOffset}
          onItemClick={onTrendingItemClick}
        />
      ) : null}
      {overview.layout === 'timeline' ? <MilestoneTimelineBody overview={overview} /> : null}

      {overview.footnoteKey ? (
        <p
          className={`overviewFootnote ${
            overview.layout === 'trendingList' ? 'overviewFootnoteTrending' : ''
          }`}
        >
          {t(overview.footnoteKey)}
        </p>
      ) : null}
    </aside>
  );
};

export default DaoTabOverviewCard;



