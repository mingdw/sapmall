import React from 'react';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { MyGovernanceSnapshot } from '../types/proposal.types';
import SectionTitle from './SectionTitle';
import styles from './MyGovernancePanel.module.scss';
import shared from '../styles/dao.shared.module.scss';

interface MyGovernancePanelProps {
  snapshot: MyGovernanceSnapshot;
}

const MyGovernancePanel: React.FC<MyGovernancePanelProps> = ({ snapshot }) => {
  const { t } = useTranslation();

  return (
    <section className={`${shared.panel} ${styles.panel}`}>
      <SectionTitle title={t('dao.home.myGovernance')} />
      <ul className={styles.stats}>
        <li>
          <span className={styles.statLabel}>{t('dao.home.pendingVotes')}</span>
          <span className={`${styles.statValue} ${styles.statHighlight}`}>{snapshot.pendingVotes}</span>
        </li>
        <li>
          <span className={styles.statLabel}>{t('dao.home.votedCount')}</span>
          <span className={styles.statValue}>{snapshot.votedCount}</span>
        </li>
        <li>
          <span className={styles.statLabel}>{t('dao.home.votingPower')}</span>
          <span className={styles.statValue}>{snapshot.votingPower.toLocaleString()}</span>
        </li>
      </ul>
      <Link to="/dao/delegates" className={styles.delegateLink}>
        {snapshot.delegateTo
          ? t('dao.home.delegatedTo', { address: snapshot.delegateTo })
          : t('dao.home.setupDelegate')}
        <RightOutlined />
      </Link>
    </section>
  );
};

export default MyGovernancePanel;
