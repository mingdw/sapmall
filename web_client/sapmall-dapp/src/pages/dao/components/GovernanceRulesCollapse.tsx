import React from 'react';
import { Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import SectionTitle from './SectionTitle';
import shared from '../styles/dao.shared.module.scss';
import styles from './GovernanceRulesCollapse.module.scss';

const GovernanceRulesCollapse: React.FC = () => {
  const { t } = useTranslation();

  const items = [
    {
      key: 'quorum',
      label: t('dao.rules.quorumTitle'),
      children: <p className={shared.bodyText}>{t('dao.rules.quorumBody')}</p>,
    },
    {
      key: 'period',
      label: t('dao.rules.periodTitle'),
      children: <p className={shared.bodyText}>{t('dao.rules.periodBody')}</p>,
    },
    {
      key: 'proposer',
      label: t('dao.rules.proposerTitle'),
      children: <p className={shared.bodyText}>{t('dao.rules.proposerBody')}</p>,
    },
  ];

  return (
    <section className={`${shared.panel} ${styles.wrap}`}>
      <SectionTitle title={t('dao.home.rules')} />
      <Collapse ghost items={items} className={styles.collapse} expandIconPosition="end" />
    </section>
  );
};

export default GovernanceRulesCollapse;
