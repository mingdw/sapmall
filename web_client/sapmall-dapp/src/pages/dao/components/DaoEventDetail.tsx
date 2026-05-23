import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Eye } from 'lucide-react';
import { getRelatedDaoEvents } from '../mocks/daoEventDetails.mock';
import type { DaoEventDetail as DaoEventDetailType } from '../types';
import { formatHelpMetricNumber } from '../../help/utils/formatHelpMetric';
import { daoEventPath, daoEventsListPath, daoHomePath } from '../utils/daoNavigation';
import DaoEventDetailBody from './DaoEventDetailBody';
import styles from '../DaoPage.module.scss';

type Props = {
  event: DaoEventDetailType;
};

const eventCategoryClass: Record<DaoEventDetailType['category'], string> = {
  ama: styles.eventTagAma,
  grant: styles.eventTagGrant,
  milestone: styles.eventTagMilestone,
  announcement: styles.eventTagAnnouncement,
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
    <section className={styles.contentZoneInnerFull}>
      <article className={`${styles.panelCard} ${styles.eventDetailCard}`} aria-label={title}>
        <header className={styles.eventDetailHead}>
          <nav className={styles.eventDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoHomePath} className={styles.eventDetailBreadcrumbLink}>
              {t('navigation.dao')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={daoEventsListPath} className={styles.eventDetailBreadcrumbLink}>
              {t('dao.tabs.events')}
            </Link>
            <ChevronRight size={14} aria-hidden />
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
                  <Eye size={14} strokeWidth={2.25} aria-hidden />
                  {t('dao.eventDetail.views', { views: viewsLabel })}
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
          <footer className={styles.eventDetailFooter}>
            <div className={styles.eventDetailRelatedHead}>
              <h2 className={styles.eventDetailRelatedTitle}>{t('dao.eventDetail.relatedTitle')}</h2>
              <Link to={daoEventsListPath} className={styles.eventDetailViewAll}>
                {t('dao.eventDetail.viewAll')}
                <ChevronRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className={styles.eventDetailRelatedList}>
              {relatedEvents.map((item) => (
                <li key={item.id}>
                  <Link to={daoEventPath(item.id)} className={styles.eventDetailRelatedItem}>
                    <span className={styles.eventDetailRelatedTag}>{t(item.categoryKey)}</span>
                    <span className={styles.eventDetailRelatedItemTitle}>{t(item.titleKey)}</span>
                    <time className={styles.eventDetailRelatedDate}>{t(item.publishedAtKey)}</time>
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


