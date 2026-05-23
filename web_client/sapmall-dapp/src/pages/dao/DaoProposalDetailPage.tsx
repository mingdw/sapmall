import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoProposalDetail } from './mocks/daoProposalDetails.mock';
import DaoProposalDetail from './components/DaoProposalDetail';
import { daoProposalsListPath } from './utils/daoNavigation';
import styles from './DaoPage.module.scss';

const DaoProposalDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const proposal = getDaoProposalDetail(id);

  if (!ready) {
    return null;
  }

  if (!proposal) {
    return (
      <div className={styles.contentZoneInnerFull}>
        <div className={`${styles.panelCard} ${styles.proposalDetailMain}`}>
          <div className={styles.eventDetailNotFound}>
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
