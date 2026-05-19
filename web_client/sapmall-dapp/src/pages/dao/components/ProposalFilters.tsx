import React from 'react';
import { Input, Select, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { ProposalStatus } from '../types/proposal.types';
import styles from './ProposalFilters.module.scss';

export interface ProposalFilterState {
  status: ProposalStatus | 'all';
  type: string;
  sort: 'latest' | 'ending' | 'participation' | 'controversy';
  query: string;
  tab: 'all' | 'discussion';
}

interface ProposalFiltersProps {
  value: ProposalFilterState;
  onChange: (next: ProposalFilterState) => void;
}

const ProposalFilters: React.FC<ProposalFiltersProps> = ({ value, onChange }) => {
  const { t } = useTranslation();

  const patch = (partial: Partial<ProposalFilterState>) =>
    onChange({ ...value, ...partial });

  return (
    <section className={styles.wrap}>
      <Tabs
        activeKey={value.tab}
        onChange={(tab) => patch({ tab: tab as ProposalFilterState['tab'] })}
        items={[
          { key: 'all', label: t('dao.list.tabAll') },
          { key: 'discussion', label: t('dao.list.tabDiscussion') },
        ]}
        className={`dao-tabs ${styles.tabs}`}
      />
      <section className={styles.row} aria-label={t('dao.list.filtersAria')}>
        <Input
          prefix={<SearchOutlined />}
          placeholder={t('dao.list.searchPlaceholder')}
          value={value.query}
          onChange={(e) => patch({ query: e.target.value })}
          allowClear
          className={styles.search}
          aria-label={t('dao.list.searchPlaceholder')}
        />
        <Select
          value={value.status}
          onChange={(status) => patch({ status })}
          className={styles.select}
          options={[
            { value: 'all', label: t('dao.list.statusAll') },
            ...(['draft', 'discussion', 'active', 'passed', 'rejected', 'executed'] as ProposalStatus[]).map(
              (s) => ({ value: s, label: t(`dao.status.${s}`) })
            ),
          ]}
        />
        <Select
          value={value.type}
          onChange={(type) => patch({ type })}
          className={styles.select}
          options={[
            { value: 'all', label: t('dao.list.typeAll') },
            ...(['parameter', 'treasury', 'grants', 'protocol', 'community'] as const).map((tp) => ({
              value: tp,
              label: t(`dao.type.${tp}`),
            })),
          ]}
        />
        <Select
          value={value.sort}
          onChange={(sort) => patch({ sort })}
          className={styles.select}
          options={[
            { value: 'latest', label: t('dao.list.sortLatest') },
            { value: 'ending', label: t('dao.list.sortEnding') },
            { value: 'participation', label: t('dao.list.sortParticipation') },
            { value: 'controversy', label: t('dao.list.sortControversy') },
          ]}
        />
      </section>
    </section>
  );
};

export default ProposalFilters;
