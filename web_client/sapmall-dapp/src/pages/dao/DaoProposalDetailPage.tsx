import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDaoProposalDetail } from './mocks/daoProposalDetails.mock';
import DaoProposalDetail from './components/DaoProposalDetail';
import { daoProposalsListPath } from './utils/daoNavigation';
import { DAO_DETAIL_NOT_FOUND, DAO_PROPOSAL_BREADCRUMB } from './constants/daoBreadcrumbClasses';
import { DAO_LAYOUT } from './constants/daoLayoutClasses';
import sharedStyles from './styles/dao.shared.module.scss';

const DaoProposalDetailPage: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const { t, ready } = useTranslation();
  const proposal = getDaoProposalDetail(id);

  if (!ready) {
    return null;
  }

  if (!proposal) {
    return (
      <div className={DAO_LAYOUT.contentZoneInnerFull}>
        <div className={`${sharedStyles.panelCard} px-5 py-[1.15rem] md:px-[1.65rem]`}>
          <div className={DAO_DETAIL_NOT_FOUND}>
            <p>{t('dao.proposalDetail.notFound')}</p>
            <Link to={daoProposalsListPath} className={DAO_PROPOSAL_BREADCRUMB.link}>
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
