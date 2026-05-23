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
import styles from '../DaoPage.module.scss';

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

const trendingRankBulletClass = (rank: number): string => {
  if (rank === 0) return styles.trendingRankBullet1;
  if (rank === 1) return styles.trendingRankBullet2;
  if (rank === 2) return styles.trendingRankBullet3;
  return styles.trendingRankBulletDefault;
};

const overviewAccentClass = {
  emerald: styles.overviewCardEmerald,
  violet: styles.overviewCardViolet,
  amber: styles.overviewCardAmber,
} as const;

const donutToneColor: Record<DaoOverviewStatTone, string> = {
  emerald: '#34d399',
  violet: '#a78bfa',
  amber: '#fbbf24',
  sky: '#38bdf8',
  rose: '#fb7185',
  slate: '#94a3b8',
};

const calloutToneClass: Record<DaoOverviewStatTone, string> = {
  emerald: styles.overviewCalloutEmerald,
  violet: styles.overviewCalloutViolet,
  amber: styles.overviewCalloutAmber,
  sky: styles.overviewCalloutSky,
  rose: styles.overviewCalloutRose,
  slate: styles.overviewCalloutSlate,
};

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

const timelineDotClass: Record<DaoOverviewStatTone, string> = {
  emerald: styles.overviewTimelineDotEmerald,
  violet: styles.overviewTimelineDotViolet,
  amber: styles.overviewTimelineDotAmber,
  sky: styles.overviewTimelineDotSky,
  rose: styles.overviewTimelineDotRose,
  slate: styles.overviewTimelineDotSlate,
};

const timelineTagClass: Record<DaoEventCategory, string> = {
  ama: styles.overviewTimelineTagAma,
  grant: styles.overviewTimelineTagGrant,
  milestone: styles.overviewTimelineTagMilestone,
  announcement: styles.overviewTimelineTagAnnouncement,
};

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
    <div className={styles.overviewDonutLayout}>
      <div
        className={styles.overviewDonutStage}
        role="img"
        aria-label={`${t(overview.donut.totalDisplay)} ${t('dao.overview.proposals.highlight')}，${sliceSummary}`}
      >
        <div className={styles.overviewDonutChart}>
          <div className={styles.overviewDonutRing} style={{ background: gradient }} />
          <div className={styles.overviewDonutHole}>
            <span className={styles.overviewDonutTotal}>{overview.donut.totalDisplay}</span>
            <span className={styles.overviewDonutTotalLabel}>
              {t('dao.overview.proposals.highlight')}
            </span>
          </div>
        </div>
        {sliceArcs.map(({ slice, rotateDeg, x, y, arrowLenPx }) => (
          <div
            key={slice.id}
            className={styles.overviewDonutCallout}
            style={{ left: x, top: y }}
          >
            <span
              className={styles.overviewDonutCalloutRow}
              style={{ transform: `rotate(${rotateDeg}deg)` }}
            >
              <span
                className={styles.overviewDonutCalloutArrow}
                style={{ width: arrowLenPx }}
                aria-hidden
              />
              <span
                className={`${styles.overviewDonutCalloutText} ${calloutToneClass[slice.tone]}`}
                style={{ transform: `rotate(${-rotateDeg}deg)` }}
              >
                {t(slice.labelKey)} {slice.displayValue}
              </span>
            </span>
          </div>
        ))}
      </div>
      <p className={styles.overviewParticipation}>
        <span className={styles.overviewParticipationLabel}>
          {t(overview.donut.participation.labelKey)}
        </span>
        <span className={styles.overviewParticipationValue}>
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
    <div className={styles.trendingLayout}>
      <ol className={styles.trendingList}>
        {visibleItems.map((item, rank) => (
          <li key={`${item.id}-${offset}`} className={styles.trendingItem}>
            <span
              className={`${styles.trendingRankBullet} ${trendingRankBulletClass(rank)}`}
              aria-hidden
            />
            <button
              type="button"
              className={styles.trendingLink}
              onClick={() => onItemClick?.(item.discussionId)}
            >
              <span className={styles.trendingTopic}>{t(item.titleKey)}</span>
              <span className={styles.trendingMeta}>
                <span className={styles.trendingMetric}>
                  {formatTrendingMetric(item.metricValue)}
                </span>
                {item.showHotTag ? (
                  <span className={styles.trendingHotTag}>{t('dao.overview.trending.hotTag')}</span>
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
    <div className={styles.overviewTimelineLayout}>
      <ol className={styles.overviewTimelineList}>
        {overview.items.map((item, index) => (
          <li key={item.id} className={styles.overviewTimelineItem}>
            <div className={styles.overviewTimelineRail} aria-hidden>
              <span
                className={`${styles.overviewTimelineDot} ${timelineDotClass[item.tone]} ${
                  item.isHighlight ? styles.overviewTimelineDotHighlight : ''
                }`}
              />
              {index < overview.items.length - 1 ? (
                <span className={styles.overviewTimelineLine} />
              ) : null}
            </div>
            <div className={styles.overviewTimelineContent}>
              <time className={styles.overviewTimelineDate} dateTime={item.publishedAtSort}>
                {t(item.publishedAtKey)}
              </time>
              <div className={styles.overviewTimelineTitleRow}>
                <h3 className={styles.overviewTimelineTitle}>{t(item.titleKey)}</h3>
                <span className={`${styles.overviewTimelineTag} ${timelineTagClass[item.category]}`}>
                  {t(item.categoryKey)}
                </span>
              </div>
              <p className={styles.overviewTimelineExcerpt}>{t(item.excerptKey)}</p>
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
      className={`${styles.panelCard} ${styles.sidebarCard} ${styles.overviewCard} ${overviewAccentClass[overview.accent]}`}
      aria-labelledby="dao-overview-title"
    >
      <div
        className={`${styles.overviewHeader} ${
          overview.layout === 'trendingList' ? styles.overviewHeaderWithAction : ''
        }`}
      >
        <div className={styles.overviewTitleRow}>
          <h2 id="dao-overview-title" className={styles.overviewTitle}>
            <TabIcon className={styles.overviewTitleIcon} strokeWidth={2.25} aria-hidden />
            <span>{t(overview.titleKey)}</span>
          </h2>
          {overview.layout === 'trendingList' ? (
            <button type="button" className={styles.trendingRefreshBtn} onClick={onTrendingRefresh}>
              <RefreshCw className={styles.trendingRefreshIcon} strokeWidth={2} aria-hidden />
              <span>{t('dao.overview.trending.refresh')}</span>
            </button>
          ) : null}
        </div>
        {overview.subtitleKey ? (
          <p
            className={`${styles.overviewSubtitle} ${
              overview.layout === 'donut' ? styles.overviewSubtitleCenter : ''
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
          className={`${styles.overviewFootnote} ${
            overview.layout === 'trendingList' ? styles.overviewFootnoteTrending : ''
          }`}
        >
          {t(overview.footnoteKey)}
        </p>
      ) : null}
    </aside>
  );
};

export default DaoTabOverviewCard;



