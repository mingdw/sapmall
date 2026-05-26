import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoDiscussionDetail } from './mocks/daoDiscussionDetails.mock';
import DaoDiscussionDetail from './components/DaoDiscussionDetail';
import { daoDiscussionsListPath } from './utils/daoNavigation';
import pageLayoutStyles from './styles/dao.pageLayout.module.scss';
import sharedStyles from './styles/dao.shared.module.scss';
import eventStyles from './components/DaoEventDetail.module.scss';
import styles from './components/DaoDiscussionDetail.module.scss';

const DaoDiscussionDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const discussion = getDaoDiscussionDetail(id);

  if (!ready) {
    return null;
  }

  if (!discussion) {
    return (
      <div className={pageLayoutStyles.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} ${styles.discussionDetailCard}`}>
          <div className={eventStyles.eventDetailNotFound}>
            <p>{t('dao.discussionDetail.notFound')}</p>
            <Link to={daoDiscussionsListPath()} className={eventStyles.eventDetailBreadcrumbLink}>
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
