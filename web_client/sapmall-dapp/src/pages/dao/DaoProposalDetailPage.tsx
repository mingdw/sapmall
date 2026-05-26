import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoProposalDetail } from './mocks/daoProposalDetails.mock';
import DaoProposalDetail from './components/DaoProposalDetail';
import { daoProposalsListPath } from './utils/daoNavigation';
import pageLayoutStyles from './styles/dao.pageLayout.module.scss';
import sharedStyles from './styles/dao.shared.module.scss';
import eventStyles from './components/DaoEventDetail.module.scss';
import styles from './components/DaoProposalDetail.module.scss';

const DaoProposalDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const proposal = getDaoProposalDetail(id);

  if (!ready) {
    return null;
  }

  if (!proposal) {
    return (
      <div className={pageLayoutStyles.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} ${styles.proposalDetailMain}`}>
          <div className={eventStyles.eventDetailNotFound}>
            <p>{t('dao.proposalDetail.notFound')}</p>
            <Link to={daoProposalsListPath} className={styles.proposalDetailBreadcrumbLink}>
              {t('dao.proposalDetail.backToList')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <DaoProposalDetail proposal={proposal} />;
};

export default DaoProposalDetailPage;
