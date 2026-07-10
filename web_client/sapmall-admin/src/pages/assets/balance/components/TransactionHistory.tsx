import React, { useMemo, useState } from 'react';
import { Table, Button, Drawer } from 'antd';
import { Search, Download, ExternalLink } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { TransactionRecord, TransactionType } from '../types';
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_STATUS_LABELS,
} from '../constants';
import styles from '../BalanceManager.module.scss';

const FILTER_TABS: { key: TransactionType | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'payment', label: '支付' },
  { key: 'refund', label: '退款' },
  { key: 'swap', label: '兑换' },
  { key: 'reward', label: '奖励' },
];

const txIconClassMap: Record<TransactionType, string> = {
  payment: styles.txIconPayment,
  refund: styles.txIconRefund,
  swap: styles.txIconSwap,
  reward: styles.txIconReward,
};

const statusClassMap: Record<string, string> = {
  confirmed: styles.statusConfirmed,
  pending: styles.statusPending,
  failed: styles.statusFailed,
};

interface TransactionHistoryProps {
  transactions: TransactionRecord[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailRecord, setDetailRecord] = useState<TransactionRecord | null>(null);

  const filteredTxs = useMemo(() => {
    return transactions.filter((tx) => {
      const matchFilter = activeFilter === 'all' || tx.type === activeFilter;
      const matchSearch =
        !searchTerm ||
        tx.txHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tx.memo?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
      return matchFilter && matchSearch;
    });
  }, [transactions, activeFilter, searchTerm]);

  const columns: ColumnsType<TransactionRecord> = [
    {
      title: '类型',
      key: 'type',
      width: 120,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`${styles.txIcon} ${txIconClassMap[r.type]}`}>
            <i className={TRANSACTION_TYPE_ICONS[r.type]} />
          </div>
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{TRANSACTION_TYPE_LABELS[r.type]}</span>
        </div>
      ),
    },
    {
      title: '金额',
      key: 'amount',
      width: 160,
      sorter: (a, b) => a.amount - b.amount,
      render: (_, r) => {
        const isPositive = r.type === 'refund' || r.type === 'reward';
        const cls = isPositive ? styles.amountPositive : r.type === 'swap' ? styles.amountNeutral : styles.amountNegative;
        const sign = isPositive ? '+' : r.type === 'swap' ? '' : '-';
        return (
          <span className={cls}>
            {sign}{r.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {r.tokenSymbol}
          </span>
        );
      },
    },
    {
      title: '来源 / 目标',
      key: 'fromto',
      width: 200,
      render: (_, r) => (
        <div>
          <div className={styles.monoText} style={{ color: '#94a3b8' }}>from: {r.from}</div>
          <div className={styles.monoText} style={{ color: '#64748b' }}>to: {r.to}</div>
        </div>
      ),
    },
    {
      title: '链',
      key: 'chain',
      width: 120,
      render: (_, r) => <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.chainName}</span>,
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      render: (_, r) => (
        <span className={`${styles.statusPill} ${statusClassMap[r.status]}`}>
          {TRANSACTION_STATUS_LABELS[r.status]}
        </span>
      ),
    },
    {
      title: '区块',
      key: 'block',
      width: 100,
      render: (_, r) => (
        <span className={styles.monoText} style={{ color: '#64748b' }}>{r.blockNumber.toLocaleString()}</span>
      ),
    },
    {
      title: '确认数',
      key: 'confirmations',
      width: 80,
      render: (_, r) => (
        <span style={{ color: r.confirmations >= 6 ? '#6ee7b7' : '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
          {r.confirmations}
        </span>
      ),
    },
    {
      title: '时间',
      key: 'time',
      width: 170,
      sorter: (a, b) => a.timestamp.localeCompare(b.timestamp),
      render: (_, r) => <span style={{ fontSize: 12, color: '#64748b' }}>{r.timestamp}</span>,
    },
    {
      title: '操作',
      key: 'action',
      width: 60,
      render: (_, r) => (
        <button className={styles.iconBtn} onClick={() => setDetailRecord(r)} title="查看详情">
          <i className="fas fa-eye" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {/* 筛选栏 */}
      <div className={styles.filterBar}>
        <div className={styles.filterGroup}>
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`${styles.filterBtn} ${activeFilter === tab.key ? styles.filterBtnActive : ''}`}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <Search size={14} />
          <input
            placeholder="搜索交易哈希、地址..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button size="small" icon={<Download size={14} />} ghost>
          导出
        </Button>
      </div>

      {/* 交易表格 */}
      <div className={styles.balanceTable}>
        <Table<TransactionRecord>
          dataSource={filteredTxs}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `共 ${t} 条记录` }}
        />
      </div>

      {/* 交易详情 Drawer */}
      <Drawer
        open={!!detailRecord}
        onClose={() => setDetailRecord(null)}
        width={480}
        title={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <i className="fas fa-exchange-alt" style={{ color: '#fbbf24' }} />
            交易详情
          </span>
        }
        className={styles.detailDrawer}
      >
        {detailRecord && (
          <div className={styles.detailSection}>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>交易类型</span>
                <span className={styles.detailValue}>{TRANSACTION_TYPE_LABELS[detailRecord.type]}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>金额</span>
                <span className={styles.detailValue} style={{ fontWeight: 600 }}>
                  {detailRecord.amount.toLocaleString()} {detailRecord.tokenSymbol}
                </span>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>交易哈希</span>
                <div className={styles.detailMonoValue}>
                  <code style={{ color: '#93c5fd', fontSize: 12 }}>{detailRecord.txHash}</code>
                </div>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>发送方</span>
                <div className={styles.detailMonoValue}>
                  <code style={{ color: '#94a3b8', fontSize: 12 }}>{detailRecord.from}</code>
                </div>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>接收方</span>
                <div className={styles.detailMonoValue}>
                  <code style={{ color: '#94a3b8', fontSize: 12 }}>{detailRecord.to}</code>
                </div>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>链</span>
                <span className={styles.detailValue}>{detailRecord.chainName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>区块高度</span>
                <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {detailRecord.blockNumber.toLocaleString()}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>确认数</span>
                <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {detailRecord.confirmations}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>状态</span>
                <span className={`${styles.statusPill} ${statusClassMap[detailRecord.status]}`}>
                  {TRANSACTION_STATUS_LABELS[detailRecord.status]}
                </span>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>时间</span>
                <span className={styles.detailValue}>{detailRecord.timestamp}</span>
              </div>
              {detailRecord.memo && (
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>备注</span>
                  <span className={styles.detailValue}>{detailRecord.memo}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
              <Button ghost size="small" icon={<ExternalLink size={14} />}>
                区块浏览器查看
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TransactionHistory;
