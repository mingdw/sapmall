import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Eye } from 'lucide-react';
import { getRelatedDaoEvents } from '../mocks/daoEventDetails.mock';
import type { DaoEventDetail as DaoEventDetailType } from '../types';
import { formatHelpMetricNumber } from '../../help/utils/formatHelpMetric';
import { daoEventPath, daoEventsListPath } from '../utils/daoNavigation';
import { DAO_EVENT_BREADCRUMB } from '../constants/daoBreadcrumbClasses';
import detailStyles from '../styles/dao.detailCommon.module.scss';
import listTagStyles from '../styles/dao.listTags.module.scss';
import { DAO_LAYOUT } from '../constants/daoLayoutClasses';
import sharedStyles from '../styles/dao.shared.module.scss';
import DaoEventDetailBody from './DaoEventDetailBody';

type Props = {
  event: DaoEventDetailType;
};

const eventCategoryClass: Record<DaoEventDetailType['category'], string> = {
  ama: listTagStyles.eventTagAma,
  grant: listTagStyles.eventTagGrant,
  milestone: listTagStyles.eventTagMilestone,
  announcement: listTagStyles.eventTagAnnouncement,
};

const DaoEventDetail: React.FC<Props> = ({ event }) => {
  const { t, i18n } = useTranslation();
  const title = t(event.titleKey);
  const viewsLabel = formatHelpMetricNumber(event.views, i18n.language);
  const relatedEvents = useMemo(() => getRelatedDaoEvents(event, 3), [event]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [event.id]);

  return (
    <section className={DAO_LAYOUT.contentZoneInnerFull}>
      <article
        className={`${sharedStyles.panelCard} px-5 pb-6 pt-[1.15rem] md:px-[1.65rem] md:pb-7 md:pt-[1.35rem]`}
        aria-label={title}
      >
        <header className="mb-5 flex flex-col gap-5">
          <nav className={DAO_EVENT_BREADCRUMB.nav} aria-label="Breadcrumb">
            <Link to={daoEventsListPath} className={DAO_EVENT_BREADCRUMB.link}>
              {t('dao.tabs.events')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
            <span className={DAO_EVENT_BREADCRUMB.current} aria-current="page">
              {title}
            </span>
          </nav>

          <div className="grid gap-[1.15rem] md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-start md:gap-[1.35rem]">
            <div className="aspect-[16/10] overflow-hidden rounded-[0.85rem] border border-slate-900/10 bg-slate-100">
              <img src={event.imageUrl} alt="" className="h-full w-full object-cover" loading="eager" />
            </div>
            <div className="flex min-w-0 flex-col gap-[0.65rem]">
              <span
                className={`self-start rounded-full px-[0.6rem] py-[0.22rem] text-[0.6875rem] font-bold uppercase tracking-wide ${eventCategoryClass[event.category]}`}
              >
                {t(event.categoryKey)}
              </span>
              <h1 className="m-0 text-[clamp(1.25rem,2.8vw,1.75rem)] font-bold leading-snug tracking-tight text-[var(--dao-panel-text)]">
                {title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-[0.65rem] text-[0.8125rem] text-[var(--dao-panel-muted)]">
                <time dateTime={t(event.publishedAtKey)}>{t(event.publishedAtKey)}</time>
                <span className="inline-flex items-center gap-1.5 font-semibold text-slate-500 [&_svg]:text-[var(--dao-tab-events)]">
                  <Eye className="h-4 w-4" aria-hidden />
                  {viewsLabel}
                </span>
              </div>
              <p className="m-0 mt-[0.15rem] text-[0.9375rem] leading-relaxed text-slate-600">
                {t(event.excerptKey)}
              </p>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[52rem] border-t border-slate-900/10 pt-[0.35rem]">
          <DaoEventDetailBody event={event} blocks={event.blocks} />
        </div>

        {relatedEvents.length > 0 ? (
          <footer className={detailStyles.eventDetailFooter}>
            <div className={detailStyles.eventDetailRelatedHead}>
              <h2 className={detailStyles.eventDetailRelatedTitle}>{t('dao.eventDetail.relatedTitle')}</h2>
              <Link to={daoEventsListPath} className={detailStyles.eventDetailViewAll}>
                {t('dao.eventDetail.viewAll')}
              </Link>
            </div>
            <ul className={detailStyles.eventDetailRelatedList}>
              {relatedEvents.map((item) => (
                <li key={item.id}>
                  <Link to={daoEventPath(item.id)} className={detailStyles.eventDetailRelatedItem}>
                    <span className={detailStyles.eventDetailRelatedTag}>{t(item.categoryKey)}</span>
                    <span className={detailStyles.eventDetailRelatedItemTitle}>{t(item.titleKey)}</span>
                    <time className={detailStyles.eventDetailRelatedDate}>{t(item.publishedAtKey)}</time>
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>
    </section>
  );
};

export default DaoEventDetail;
