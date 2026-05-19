import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { MOCK_PROPOSALS } from '../mocks/proposals.mock';
import ProposalCard from '../components/ProposalCard';
import ProposalFilters, { ProposalFilterState } from '../components/ProposalFilters';
import DaoEmptyState from '../components/DaoEmptyState';
import { filterProposals, sortProposals } from '../utils/proposalUtils';
import shared from '../styles/dao.shared.module.scss';
import styles from './ProposalListPage.module.scss';

const ProposalListPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading] = useState(false);
  const [filters, setFilters] = useState<ProposalFilterState>({
    status: 'all',
    type: 'all',
    sort: 'latest',
    query: '',
    tab: 'all',
  });

  const proposals = useMemo(() => {
    let list = [...MOCK_PROPOSALS];
    if (filters.tab === 'discussion') {
      list = list.filter((p) => p.status === 'discussion');
    }
    list = filterProposals(list, {
      status: filters.status,
      type: filters.type,
      query: filters.query,
    });
    return sortProposals(list, filters.sort);
  }, [filters]);

  return (
    <main className={shared.page}>
      <header className={styles.pageHead}>
        <section>
          <span className={shared.badge}>
            <UnorderedListOutlined style={{ fontSize: 12 }} aria-hidden />
            {t('dao.list.badge')}
          </span>
          <h1 className={shared.pageTitle}>{t('dao.list.title')}</h1>
          <p className={shared.pageSubtitle}>{t('dao.list.subtitle')}</p>
        </section>
        <Link to="/dao/new" className={shared.ctaPrimary}>
          <PlusOutlined />
          {t('dao.home.createProposal')}
        </Link>
      </header>

      <section className={`${shared.glassCard} ${styles.filterBar}`}>
        <ProposalFilters value={filters} onChange={setFilters} />
      </section>

      <p className={styles.resultCount}>
        {t('dao.list.resultCount', { count: proposals.length })}
      </p>

      {loading ? (
        <Spin className={styles.spin} />
      ) : proposals.length === 0 ? (
        <section className={shared.panel}>
          <DaoEmptyState type="proposals" />
        </section>
      ) : (
        <section className={styles.grid}>
          {proposals.map((p) => (
            <ProposalCard key={p.id} proposal={p} />
          ))}
        </section>
      )}
    </main>
  );
};

export default ProposalListPage;
