import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoEventDetail } from './mocks/daoEventDetails.mock';
import DaoEventDetail from './components/DaoEventDetail';
import { daoEventsListPath } from './utils/daoNavigation';
import { DAO_EVENT_BREADCRUMB, DAO_DETAIL_NOT_FOUND } from './constants/daoBreadcrumbClasses';
import { DAO_LAYOUT } from './constants/daoLayoutClasses';
import sharedStyles from './styles/dao.shared.module.scss';

const DaoEventDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const event = getDaoEventDetail(id);

  if (!ready) {
    return null;
  }

  if (!event) {
    return (
      <div className={DAO_LAYOUT.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} px-5 py-[1.15rem] md:px-[1.65rem]`}>
          <div className={DAO_DETAIL_NOT_FOUND}>
            <p>{t('dao.eventDetail.notFound')}</p>
            <Link to={daoEventsListPath} className={DAO_EVENT_BREADCRUMB.link}>
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
