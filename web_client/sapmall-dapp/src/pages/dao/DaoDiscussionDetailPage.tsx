import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoDiscussionDetail } from './mocks/daoDiscussionDetails.mock';
import DaoDiscussionDetail from './components/DaoDiscussionDetail';
import { daoDiscussionsListPath } from './utils/daoNavigation';
import styles from './DaoPage.module.scss';

const DaoDiscussionDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const discussion = getDaoDiscussionDetail(id);

  if (!ready) {
    return null;
  }

  if (!discussion) {
    return (
      <div className={styles.contentZoneInnerFull}>
        <div className={`${styles.panelCard} ${styles.discussionDetailCard}`}>
          <div className={styles.eventDetailNotFound}>
            <p>{t('dao.discussionDetail.notFound')}</p>
            <Link to={daoDiscussionsListPath} className={styles.eventDetailBreadcrumbLink}>
              {t('dao.discussionDetail.backToList')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <DaoDiscussionDetail discussion={discussion} />;
};

export default DaoDiscussionDetailPage;
