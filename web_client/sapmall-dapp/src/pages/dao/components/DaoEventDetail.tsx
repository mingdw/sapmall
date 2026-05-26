import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Eye } from 'lucide-react';
import { getRelatedDaoEvents } from '../mocks/daoEventDetails.mock';
import type { DaoEventDetail as DaoEventDetailType } from '../types';
import { formatHelpMetricNumber } from '../../help/utils/formatHelpMetric';
import { daoEventPath, daoEventsListPath } from '../utils/daoNavigation';
import detailStyles from '../styles/dao.detailCommon.module.scss';
import listTagStyles from '../styles/dao.listTags.module.scss';
import pageLayoutStyles from '../styles/dao.pageLayout.module.scss';
import sharedStyles from '../styles/dao.shared.module.scss';
import DaoEventDetailBody from './DaoEventDetailBody';
import styles from './DaoEventDetail.module.scss';

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
    <section className={pageLayoutStyles.contentZoneInnerFull}>
      <article className={`${sharedStyles.panelCard} ${styles.eventDetailCard}`} aria-label={title}>
        <header className={styles.eventDetailHead}>
          <nav className={styles.eventDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoEventsListPath} className={styles.eventDetailBreadcrumbLink}>
              {t('dao.tabs.events')}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-50" aria-hidden />
            <span className={styles.eventDetailBreadcrumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>

          <div className={styles.eventDetailHero}>
            <div className={styles.eventDetailCover}>
              <img src={event.imageUrl} alt="" loading="eager" />
            </div>
            <div className={styles.eventDetailHeroBody}>
              <span className={`${styles.eventDetailCategory} ${eventCategoryClass[event.category]}`}>
                {t(event.categoryKey)}
              </span>
              <h1 className={styles.eventDetailTitle}>{title}</h1>
              <div className={styles.eventDetailMeta}>
                <time dateTime={t(event.publishedAtKey)}>{t(event.publishedAtKey)}</time>
                <span className={styles.eventDetailMetric}>
                  <Eye className="h-4 w-4" aria-hidden />
                  {viewsLabel}
                </span>
              </div>
              <p className={styles.eventDetailLead}>{t(event.excerptKey)}</p>
            </div>
          </div>
        </header>

        <div className={styles.eventDetailBody}>
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
