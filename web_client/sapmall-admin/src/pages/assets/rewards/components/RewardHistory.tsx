import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RewardRecord, RewardSourceType, RewardStatus } from '../types';
import {
  getRewardSourceLabels,
  REWARD_SOURCE_ICONS,
  REWARD_SOURCE_COLORS,
  getRewardStatusLabels,
} from '../constants';
import styles from '../RewardsManager.module.scss';

interface RewardHistoryProps {
  records: RewardRecord[];
}

type FilterValue = 'all' | RewardSourceType | RewardStatus;

const SOURCE_FILTER_KEYS: RewardSourceType[] = [
  'trading_rebate', 'community', 'referral', 'staking', 'merchant_bonus', 'airdrop',
];
const STATUS_FILTER_KEYS: RewardStatus[] = ['available', 'claimed', 'pending', 'expired'];

const STATUS_CLASS_MAP: Record<RewardStatus, string> = {
  available: styles.statusAvailable,
  claimed: styles.statusClaimed,
  pending: styles.statusPending,
  expired: styles.statusExpired,
};

const formatAmount = (val: number): string =>
  val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatTxHash = (hash?: string): string => {
  if (!hash) return '—';
  if (hash.length <= 14) return hash;
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
};

const RewardHistory: React.FC<RewardHistoryProps> = ({ records }) => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterValue>('all');

  const rewardSourceLabels = getRewardSourceLabels(t);
  const rewardStatusLabels = getRewardStatusLabels(t);

  const filterGroups: { label: string; value: FilterValue }[] = [
    { label: t('assets.rewards.historySection.filterAll'), value: 'all' },
    ...SOURCE_FILTER_KEYS.map((key) => ({ label: rewardSourceLabels[key], value: key as FilterValue })),
    ...STATUS_FILTER_KEYS.map((key) => ({ label: rewardStatusLabels[key], value: key as FilterValue })),
  ];

  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records;
    if (SOURCE_FILTER_KEYS.includes(filter as RewardSourceType)) {
      return records.filter((r) => r.source === filter);
    }
    if (STATUS_FILTER_KEYS.includes(filter as RewardStatus)) {
      return records.filter((r) => r.status === filter);
    }
    return records;
  }, [records, filter]);

  const columns: ColumnsType<RewardRecord> = [
    {
      title: t('assets.rewards.historySection.colSource'),
      dataIndex: 'source',
      key: 'source',
      width: 140,
      render: (source: RewardSourceType) => {
        const colors = REWARD_SOURCE_COLORS[source];
        return (
          <span className={styles.sourceTag}>
            <span
              className={styles.sourceIcon}
              style={{ width: 24, height: 24, fontSize: 11, background: colors.bg, color: colors.color }}
            >
              <i className={REWARD_SOURCE_ICONS[source]} />
            </span>
            {rewardSourceLabels[source]}
          </span>
        );
      },
    },
    {
      title: t('assets.rewards.historySection.colDescription'),
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => <Tooltip title={desc}><span>{desc}</span></Tooltip>,
    },
    {
      title: t('assets.rewards.historySection.colAmount'),
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount: number, record) => (
        <span>
          <span className={styles.amountValue}>+{formatAmount(amount)}</span>
          <span className={styles.amountUnit}> {record.tokenSymbol}</span>
        </span>
      ),
    },
    {
      title: t('assets.rewards.historySection.colStatus'),
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: RewardStatus) => (
        <span className={`${styles.statusPill} ${STATUS_CLASS_MAP[status]}`}>
          {rewardStatusLabels[status]}
        </span>
      ),
    },
    {
      title: t('assets.rewards.historySection.colTime'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (time: string) => <span className={styles.monoText}>{time}</span>,
    },
    {
      title: t('assets.rewards.historySection.colTxHash'),
      dataIndex: 'txHash',
      key: 'txHash',
      width: 150,
      render: (hash?: string) => (
        hash ? (
          <Tooltip title={hash}>
            <span className={styles.monoText} style={{ color: '#94a3b8' }}>{formatTxHash(hash)}</span>
          </Tooltip>
        ) : <span style={{ color: '#475569' }}>—</span>
      ),
    },
    {
      title: t('assets.rewards.historySection.colAction'),
      key: 'action',
      width: 100,
      render: (_, record) => {
        if (record.status === 'available') {
          return (
            <button
              type="button"
              className={styles.claimBtn}
              onClick={() => undefined}
            >
              <i className="fas fa-hand-holding" />
              {t('assets.rewards.historySection.claim')}
            </button>
          );
        }
        if (record.status === 'claimed' && record.claimedAt) {
          return (
            <Tooltip title={t('assets.rewards.historySection.claimedAt', { time: record.claimedAt })}>
              <span style={{ color: '#64748b', fontSize: 12 }}>
                <i className="fas fa-check" /> {t('assets.rewards.historySection.claimed')}
              </span>
            </Tooltip>
          );
        }
        if (record.status === 'expired') {
          return <span style={{ color: '#475569', fontSize: 12 }}>—</span>;
        }
        return <span style={{ color: '#64748b', fontSize: 12 }}>{t('assets.rewards.historySection.waiting')}</span>;
      },
    },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          {filterGroups.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`${styles.filterBtn} ${filter === item.value ? styles.filterBtnActive : ''}`}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 记录表格 */}
      <div className={styles.rewardsTable}>
        <Table
          dataSource={filteredRecords}
          columns={columns}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
            showTotal: (total) => t('assets.rewards.historySection.totalRecords', { count: total }),
          }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default RewardHistory;
