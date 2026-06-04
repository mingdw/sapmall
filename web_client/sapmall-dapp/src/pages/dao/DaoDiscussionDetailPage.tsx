import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoDiscussionDetail } from './mocks/daoDiscussionDetails.mock';
import DaoDiscussionDetail from './components/DaoDiscussionDetail';
import { daoDiscussionsListPath } from './utils/daoNavigation';
import { DAO_EVENT_BREADCRUMB, DAO_DETAIL_NOT_FOUND } from './constants/daoBreadcrumbClasses';
import { DAO_LAYOUT } from './constants/daoLayoutClasses';
import sharedStyles from './styles/dao.shared.module.scss';

const DaoDiscussionDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const discussion = getDaoDiscussionDetail(id);

  if (!ready) {
    return null;
  }

  if (!discussion) {
    return (
      <div className={DAO_LAYOUT.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} px-5 py-[1.15rem] md:px-[1.65rem]`}>
          <div className={DAO_DETAIL_NOT_FOUND}>
            <p>{t('dao.discussionDetail.notFound')}</p>
            <Link to={daoDiscussionsListPath()} className={DAO_EVENT_BREADCRUMB.link}>
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
