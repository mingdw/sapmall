import React, { useState, useMemo } from 'react';
import { Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RewardRecord, RewardSourceType, RewardStatus } from '../types';
import {
  REWARD_SOURCE_LABELS,
  REWARD_SOURCE_ICONS,
  REWARD_SOURCE_COLORS,
  REWARD_STATUS_LABELS,
} from '../constants';
import styles from '../RewardsManager.module.scss';

interface RewardHistoryProps {
  records: RewardRecord[];
}

type FilterValue = 'all' | RewardSourceType | RewardStatus;

const FILTER_GROUPS: { label: string; value: FilterValue }[] = [
  { label: '全部', value: 'all' },
  { label: '交易返佣', value: 'trading_rebate' },
  { label: '社区活动', value: 'community' },
  { label: '邀请奖励', value: 'referral' },
  { label: '质押收益', value: 'staking' },
  { label: '商家奖励', value: 'merchant_bonus' },
  { label: '空投', value: 'airdrop' },
  { label: '可领取', value: 'available' },
  { label: '已领取', value: 'claimed' },
  { label: '待结算', value: 'pending' },
  { label: '已过期', value: 'expired' },
];

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
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredRecords = useMemo(() => {
    if (filter === 'all') return records;
    const sourceTypes: RewardSourceType[] = [
      'trading_rebate', 'community', 'referral', 'staking', 'merchant_bonus', 'airdrop',
    ];
    const statusTypes: RewardStatus[] = ['available', 'claimed', 'pending', 'expired'];
    if (sourceTypes.includes(filter as RewardSourceType)) {
      return records.filter((r) => r.source === filter);
    }
    if (statusTypes.includes(filter as RewardStatus)) {
      return records.filter((r) => r.status === filter);
    }
    return records;
  }, [records, filter]);

  const columns: ColumnsType<RewardRecord> = [
    {
      title: '来源',
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
            {REWARD_SOURCE_LABELS[source]}
          </span>
        );
      },
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (desc: string) => <Tooltip title={desc}><span>{desc}</span></Tooltip>,
    },
    {
      title: '金额',
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
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 90,
      render: (status: RewardStatus) => (
        <span className={`${styles.statusPill} ${STATUS_CLASS_MAP[status]}`}>
          {REWARD_STATUS_LABELS[status]}
        </span>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (time: string) => <span className={styles.monoText}>{time}</span>,
    },
    {
      title: '交易哈希',
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
      title: '操作',
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
              领取
            </button>
          );
        }
        if (record.status === 'claimed' && record.claimedAt) {
          return (
            <Tooltip title={`领取于 ${record.claimedAt}`}>
              <span style={{ color: '#64748b', fontSize: 12 }}>
                <i className="fas fa-check" /> 已领
              </span>
            </Tooltip>
          );
        }
        if (record.status === 'expired') {
          return <span style={{ color: '#475569', fontSize: 12 }}>—</span>;
        }
        return <span style={{ color: '#64748b', fontSize: 12 }}>等待中</span>;
      },
    },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          {FILTER_GROUPS.map((item) => (
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
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 800 }}
        />
      </div>
    </div>
  );
};

export default RewardHistory;
