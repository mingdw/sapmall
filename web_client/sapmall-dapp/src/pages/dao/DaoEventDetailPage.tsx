import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoEventDetail } from './mocks/daoEventDetails.mock';
import DaoEventDetail from './components/DaoEventDetail';
import { daoEventsListPath } from './utils/daoNavigation';
import pageLayoutStyles from './styles/dao.pageLayout.module.scss';
import sharedStyles from './styles/dao.shared.module.scss';
import styles from './components/DaoEventDetail.module.scss';

const DaoEventDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const event = getDaoEventDetail(id);

  if (!ready) {
    return null;
  }

  if (!event) {
    return (
      <div className={pageLayoutStyles.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} ${styles.eventDetailCard}`}>
          <div className={styles.eventDetailNotFound}>
            <p>{t('dao.eventDetail.notFound')}</p>
            <Link to={daoEventsListPath} className={styles.eventDetailBreadcrumbLink}>
              {t('dao.eventDetail.backToList')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <DaoEventDetail event={event} />;
};

export default DaoEventDetailPage;
