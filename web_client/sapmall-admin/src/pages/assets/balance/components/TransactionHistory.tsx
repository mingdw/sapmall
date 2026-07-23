import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Drawer } from 'antd';
import { Search, Download, ExternalLink } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { TransactionRecord, TransactionType } from '../types';
import {
  getTransactionTypeLabels,
  TRANSACTION_TYPE_ICONS,
  getTransactionStatusLabels,
} from '../constants';
import styles from '../BalanceManager.module.scss';

const FILTER_TAB_KEYS: (TransactionType | 'all')[] = ['all', 'payment', 'refund', 'swap', 'reward'];

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
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [detailRecord, setDetailRecord] = useState<TransactionRecord | null>(null);

  const txTypeLabels = getTransactionTypeLabels(t);
  const txStatusLabels = getTransactionStatusLabels(t);

  const filterTabs = FILTER_TAB_KEYS.map((key) => ({
    key,
    label: key === 'all' ? t('assets.balance.txHistory.filterAll') : txTypeLabels[key],
  }));

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
      title: t('assets.balance.txHistory.colType'),
      key: 'type',
      width: 120,
      render: (_, r) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className={`${styles.txIcon} ${txIconClassMap[r.type]}`}>
            <i className={TRANSACTION_TYPE_ICONS[r.type]} />
          </div>
          <span style={{ fontSize: 13, color: '#cbd5e1' }}>{txTypeLabels[r.type]}</span>
        </div>
      ),
    },
    {
      title: t('assets.balance.txHistory.colAmount'),
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
      title: t('assets.balance.txHistory.colFromTo'),
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
      title: t('assets.balance.txHistory.colChain'),
      key: 'chain',
      width: 120,
      render: (_, r) => <span style={{ fontSize: 12, color: '#94a3b8' }}>{r.chainName}</span>,
    },
    {
      title: t('assets.balance.txHistory.colStatus'),
      key: 'status',
      width: 100,
      render: (_, r) => (
        <span className={`${styles.statusPill} ${statusClassMap[r.status]}`}>
          {txStatusLabels[r.status]}
        </span>
      ),
    },
    {
      title: t('assets.balance.txHistory.colBlock'),
      key: 'block',
      width: 100,
      render: (_, r) => (
        <span className={styles.monoText} style={{ color: '#64748b' }}>{r.blockNumber.toLocaleString()}</span>
      ),
    },
    {
      title: t('assets.balance.txHistory.colConfirmations'),
      key: 'confirmations',
      width: 80,
      render: (_, r) => (
        <span style={{ color: r.confirmations >= 6 ? '#6ee7b7' : '#fbbf24', fontVariantNumeric: 'tabular-nums' }}>
          {r.confirmations}
        </span>
      ),
    },
    {
      title: t('assets.balance.txHistory.colTime'),
      key: 'time',
      width: 170,
      sorter: (a, b) => a.timestamp.localeCompare(b.timestamp),
      render: (_, r) => <span style={{ fontSize: 12, color: '#64748b' }}>{r.timestamp}</span>,
    },
    {
      title: t('assets.balance.txHistory.colAction'),
      key: 'action',
      width: 60,
      render: (_, r) => (
        <button className={styles.iconBtn} onClick={() => setDetailRecord(r)} title={t('assets.balance.txHistory.viewDetail')}>
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
          {filterTabs.map((tab) => (
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
            placeholder={t('assets.balance.txHistory.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button size="small" icon={<Download size={14} />} ghost>
          {t('assets.balance.txHistory.export')}
        </Button>
      </div>

      {/* 交易表格 */}
      <div className={styles.balanceTable}>
        <Table<TransactionRecord>
          dataSource={filteredTxs}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (total) => t('assets.balance.txHistory.totalRecords', { count: total }) }}
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
            {t('assets.balance.txHistory.detailTitle')}
          </span>
        }
        className={styles.detailDrawer}
      >
        {detailRecord && (
          <div className={styles.detailSection}>
            <div className={styles.detailGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailType')}</span>
                <span className={styles.detailValue}>{txTypeLabels[detailRecord.type]}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailAmount')}</span>
                <span className={styles.detailValue} style={{ fontWeight: 600 }}>
                  {detailRecord.amount.toLocaleString()} {detailRecord.tokenSymbol}
                </span>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailTxHash')}</span>
                <div className={styles.detailMonoValue}>
                  <code style={{ color: '#93c5fd', fontSize: 12 }}>{detailRecord.txHash}</code>
                </div>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailSender')}</span>
                <div className={styles.detailMonoValue}>
                  <code style={{ color: '#94a3b8', fontSize: 12 }}>{detailRecord.from}</code>
                </div>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailReceiver')}</span>
                <div className={styles.detailMonoValue}>
                  <code style={{ color: '#94a3b8', fontSize: 12 }}>{detailRecord.to}</code>
                </div>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailChain')}</span>
                <span className={styles.detailValue}>{detailRecord.chainName}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailBlockHeight')}</span>
                <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {detailRecord.blockNumber.toLocaleString()}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailConfirmations')}</span>
                <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {detailRecord.confirmations}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailStatus')}</span>
                <span className={`${styles.statusPill} ${statusClassMap[detailRecord.status]}`}>
                  {txStatusLabels[detailRecord.status]}
                </span>
              </div>
              <div className={styles.detailItemFull}>
                <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailTime')}</span>
                <span className={styles.detailValue}>{detailRecord.timestamp}</span>
              </div>
              {detailRecord.memo && (
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>{t('assets.balance.txHistory.detailMemo')}</span>
                  <span className={styles.detailValue}>{detailRecord.memo}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 8 }}>
              <Button ghost size="small" icon={<ExternalLink size={14} />}>
                {t('assets.balance.txHistory.viewOnExplorer')}
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default TransactionHistory;
