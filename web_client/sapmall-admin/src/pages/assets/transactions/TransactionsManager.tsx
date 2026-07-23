﻿import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigProvider, Table, Drawer, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { TxRecord, TxType, TxStatus, TxDirection, TokenSymbol, TxFilter } from './types';
import {
  getTxTypeLabels,
  TX_TYPE_ICONS,
  TX_TYPE_COLORS,
  getTxStatusLabels,
  getTxDirectionLabels,
  TX_DIRECTION_ICONS,
  TX_DIRECTION_COLORS,
  CHAIN_LIST,
  mockTxRecords,
  mockTxSummary,
} from './constants';
import { transactionsTheme } from './transactionsTheme';
import styles from './TransactionsManager.module.scss';

const formatAmount = (val: number, decimals: number): string => {
  if (decimals === 18) {
    return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  }
  if (decimals === 8) {
    return val.toFixed(8).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  }
  return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatUsd = (val: number): string =>
  val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const formatHash = (hash: string, head = 8, tail = 6): string => {
  if (hash.length <= head + tail + 3) return hash;
  return `${hash.slice(0, head)}...${hash.slice(-tail)}`;
};

const formatAddress = (addr: string, head = 8, tail = 6): string => {
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
};

const STATUS_CLASS_MAP: Record<TxStatus, string> = {
  success: styles.statusSuccess,
  pending: styles.statusPending,
  failed: styles.statusFailed,
  dropped: styles.statusDropped,
};

const DIR_CLASS_MAP: Record<TxDirection, string> = {
  in: styles.dirIn,
  out: styles.dirOut,
  self: styles.dirSelf,
};

const STATS_CARD_CONFIG = [
  { key: 'totalCount',     icon: 'fas fa-list',                 color: '#38bdf8', bg: 'rgba(56,189,248,0.12)',  unit: '' },
  { key: 'totalVolumeUSD', icon: 'fas fa-dollar-sign',          color: '#34d399', bg: 'rgba(52,211,153,0.12)',  unit: 'USD' },
  { key: 'successRate',    icon: 'fas fa-circle-check',         color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',  unit: '%' },
  { key: 'totalGasFeeUSD', icon: 'fas fa-gas-pump',             color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  unit: 'USD' },
  { key: 'pendingCount',   icon: 'fas fa-hourglass-half',       color: '#fbbf24', bg: 'rgba(251,191,36,0.1)',   unit: '' },
  { key: 'failedCount',    icon: 'fas fa-circle-xmark',         color: '#fca5a5', bg: 'rgba(248,113,113,0.1)',  unit: '' },
] as const;

type FilterField = 'type' | 'status' | 'direction' | 'token';

const TX_TYPE_KEYS: (TxType | 'all')[] = ['all', 'payment', 'swap', 'transfer', 'stake', 'unstake', 'claim', 'refund', 'approval', 'contract'];
const TX_STATUS_KEYS: (TxStatus | 'all')[] = ['all', 'success', 'pending', 'failed', 'dropped'];
const TX_DIRECTION_KEYS: (TxDirection | 'all')[] = ['all', 'in', 'out', 'self'];
const TOKEN_KEYS: (TokenSymbol | 'all')[] = ['all', 'SAP', 'USDC', 'EURC', 'cirBTC', 'ETH'];

const TransactionsManager: React.FC = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<TxFilter>({
    type: 'all',
    status: 'all',
    direction: 'all',
    token: 'all',
    chainId: 'all',
    dateRange: null,
    keyword: '',
  });
  const [detailRecord, setDetailRecord] = useState<TxRecord | null>(null);

  const txTypeLabels = getTxTypeLabels(t);
  const txStatusLabels = getTxStatusLabels(t);
  const txDirectionLabels = getTxDirectionLabels(t);

  const statsCards = STATS_CARD_CONFIG.map((card) => ({
    ...card,
    label: t(`assets.transactions.stats.${card.key}`),
  }));

  const typeFilters = TX_TYPE_KEYS.map((key) => ({
    value: key,
    label: key === 'all' ? t('assets.transactions.filterAll') : txTypeLabels[key],
  }));
  const statusFilters = TX_STATUS_KEYS.map((key) => ({
    value: key,
    label: key === 'all' ? t('assets.transactions.filterAll') : txStatusLabels[key],
  }));
  const directionFilters = TX_DIRECTION_KEYS.map((key) => ({
    value: key,
    label: key === 'all' ? t('assets.transactions.filterAll') : txDirectionLabels[key],
  }));
  const tokenFilters = TOKEN_KEYS.map((key) => ({
    value: key,
    label: key === 'all' ? t('assets.transactions.filterAll') : key,
  }));

  const filteredRecords = useMemo(() => {
    return mockTxRecords.filter((tx) => {
      if (filter.type !== 'all' && tx.type !== filter.type) return false;
      if (filter.status !== 'all' && tx.status !== filter.status) return false;
      if (filter.direction !== 'all' && tx.direction !== filter.direction) return false;
      if (filter.token !== 'all' && tx.tokenSymbol !== filter.token) return false;
      if (filter.chainId !== 'all' && tx.chainId !== filter.chainId) return false;
      if (filter.keyword) {
        const kw = filter.keyword.toLowerCase();
        const match =
          tx.txHash.toLowerCase().includes(kw) ||
          tx.from.toLowerCase().includes(kw) ||
          tx.to.toLowerCase().includes(kw) ||
          (tx.contractAddress?.toLowerCase().includes(kw) ?? false) ||
          (tx.methodName?.toLowerCase().includes(kw) ?? false) ||
          (tx.memo?.toLowerCase().includes(kw) ?? false) ||
          (tx.orderId?.toLowerCase().includes(kw) ?? false);
        if (!match) return false;
      }
      return true;
    });
  }, [filter]);

  const setChip = (field: FilterField, value: string) => {
    setFilter((prev) => ({ ...prev, [field]: value }));
  };

  const resetFilter = () => {
    setFilter({
      type: 'all', status: 'all', direction: 'all',
      token: 'all', chainId: 'all', dateRange: null, keyword: '',
    });
  };

  const columns: ColumnsType<TxRecord> = [
    {
      title: t('assets.transactions.colDirection'),
      key: 'direction',
      width: 80,
      render: (_, r) => (
        <span className={`${styles.dirTag} ${DIR_CLASS_MAP[r.direction]}`}>
          <i className={TX_DIRECTION_ICONS[r.direction]} />
          {txDirectionLabels[r.direction]}
        </span>
      ),
    },
    {
      title: t('assets.transactions.colType'),
      key: 'type',
      width: 130,
      render: (_, r) => {
        const colors = TX_TYPE_COLORS[r.type];
        return (
          <span className={styles.typeTag}>
            <span className={styles.typeIcon} style={{ background: colors.bg, color: colors.color }}>
              <i className={TX_TYPE_ICONS[r.type]} />
            </span>
            {txTypeLabels[r.type]}
          </span>
        );
      },
    },
    {
      title: t('assets.transactions.colAmount'),
      key: 'amount',
      width: 150,
      sorter: (a, b) => a.amount - b.amount,
      render: (_, r) => {
        const cls = r.direction === 'in' ? styles.amountIn : r.direction === 'out' ? styles.amountOut : styles.amountNeutral;
        const sign = r.direction === 'in' ? '+' : r.direction === 'out' ? '-' : '';
        const showAmount = r.amount === 0 ? '—' : `${sign}${formatAmount(r.amount, r.tokenDecimals)}`;
        return (
          <span>
            <span className={cls}>{showAmount}</span>
            {r.amount > 0 && <span className={styles.amountUnit}> {r.tokenSymbol}</span>}
          </span>
        );
      },
    },
    {
      title: t('assets.transactions.colTxHash'),
      key: 'txHash',
      width: 140,
      render: (_, r) => (
        <Tooltip title={r.txHash}>
          <span className={styles.monoHash}>{formatHash(r.txHash)}</span>
        </Tooltip>
      ),
    },
    {
      title: t('assets.transactions.colCounterparty'),
      key: 'counterparty',
      width: 170,
      render: (_, r) => {
        const addr = r.direction === 'out' ? r.to : r.from;
        return (
          <Tooltip title={addr}>
            <span className={styles.monoText} style={{ color: '#94a3b8' }}>{formatAddress(addr)}</span>
          </Tooltip>
        );
      },
    },
    {
      title: t('assets.transactions.colChain'),
      key: 'chain',
      width: 120,
      render: (_, r) => <span className={styles.chainTag}>{r.chainName}</span>,
    },
    {
      title: t('assets.transactions.colStatus'),
      key: 'status',
      width: 90,
      render: (_, r) => (
        <span className={`${styles.statusPill} ${STATUS_CLASS_MAP[r.status]}`}>
          {txStatusLabels[r.status]}
        </span>
      ),
    },
    {
      title: t('assets.transactions.colGas'),
      key: 'gas',
      width: 110,
      sorter: (a, b) => a.gasFeeUSD - b.gasFeeUSD,
      render: (_, r) => (
        <div className={styles.gasCell}>
          {r.gasFeeUSD > 0 ? (
            <>
              <span className={styles.gasFeeUSD}>${formatUsd(r.gasFeeUSD)}</span>
              <span className={styles.gasDetail}>{r.gasUsed.toLocaleString()} @ {r.gasPrice} Gwei</span>
            </>
          ) : (
            <span className={styles.gasDetail}>—</span>
          )}
        </div>
      ),
    },
    {
      title: t('assets.transactions.colBlock'),
      key: 'block',
      width: 100,
      sorter: (a, b) => a.blockNumber - b.blockNumber,
      render: (_, r) => (
        <span className={styles.monoText} style={{ color: r.status === 'pending' ? '#fbbf24' : '#64748b' }}>
          {r.status === 'pending' ? t('assets.transactions.pendingBlock') : r.blockNumber.toLocaleString()}
        </span>
      ),
    },
    {
      title: t('assets.transactions.colTime'),
      key: 'time',
      width: 160,
      sorter: (a, b) => a.timestamp.localeCompare(b.timestamp),
      render: (_, r) => <span style={{ fontSize: 12, color: '#64748b' }}>{r.timestamp}</span>,
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, r) => (
        <button className={styles.iconBtn} onClick={() => setDetailRecord(r)} title={t('assets.transactions.viewDetail')}>
          <i className="fas fa-eye" />
        </button>
      ),
    },
  ];

  const renderFilterRow = (
    label: string,
    field: FilterField,
    options: { label: string; value: string }[],
  ) => (
    <div className={styles.filterRow}>
      <span className={styles.filterLabel}>{label}</span>
      <div className={styles.filterChips}>
        {options.map((opt) => (
          <button
            key={opt.value}
            className={`${styles.filterChip} ${filter[field] === opt.value ? styles.filterChipActive : ''}`}
            onClick={() => setChip(field, opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <ConfigProvider theme={transactionsTheme}>
      <div className={styles.txPage}>
        <h2 className={styles.filterLabel}>{t('assets.transactions.title')}</h2>
        {/* 统计概览 */}
        <div className={styles.statsBar}>
          {statsCards.map((card) => (
            <div key={card.key} className={styles.statsCard}>
              <div className={styles.statsCardHead}>
                <div className={styles.statsCardIcon} style={{ background: card.bg, color: card.color }}>
                  <i className={card.icon} />
                </div>
                <span className={styles.statsCardLabel}>{card.label}</span>
              </div>
              <div>
                <span className={styles.statsCardValue}>
                  {card.key === 'successRate'
                    ? mockTxSummary.successRate
                    : card.key === 'totalCount' || card.key === 'pendingCount' || card.key === 'failedCount'
                      ? mockTxSummary[card.key as 'totalCount' | 'pendingCount' | 'failedCount']
                      : formatUsd(mockTxSummary[card.key as 'totalVolumeUSD' | 'totalGasFeeUSD'])}
                </span>
                {card.unit && <span className={styles.statsCardUnit}>{card.unit}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* 高级筛选面板 */}
        <div className={styles.filterPanel}>
          {renderFilterRow(t('assets.transactions.filter.type'), 'type', typeFilters)}
          {renderFilterRow(t('assets.transactions.filter.status'), 'status', statusFilters)}
          {renderFilterRow(t('assets.transactions.filter.direction'), 'direction', directionFilters)}
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>{t('assets.transactions.filter.token')}</span>
            <div className={styles.filterChips}>
              {tokenFilters.map((opt) => (
                <button
                  key={opt.value}
                  className={`${styles.filterChip} ${filter.token === opt.value ? styles.filterChipActive : ''}`}
                  onClick={() => setChip('token', opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className={styles.filterLabel} style={{ marginLeft: 12 }}>{t('assets.transactions.filter.chain')}</span>
            <div className={styles.filterChips}>
              <button
                className={`${styles.filterChip} ${filter.chainId === 'all' ? styles.filterChipActive : ''}`}
                onClick={() => setFilter((prev) => ({ ...prev, chainId: 'all' }))}
              >
                {t('assets.transactions.filterAll')}
              </button>
              {CHAIN_LIST.map((chain) => (
                <button
                  key={chain.chainId}
                  className={`${styles.filterChip} ${filter.chainId === chain.chainId ? styles.filterChipActive : ''}`}
                  onClick={() => setFilter((prev) => ({ ...prev, chainId: chain.chainId }))}
                >
                  {chain.chainName}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.filterRow}>
            <span className={styles.filterLabel}>{t('assets.transactions.filter.search')}</span>
            <div className={styles.searchBox}>
              <i className="fas fa-search" />
              <input
                placeholder={t('assets.transactions.searchPlaceholder')}
                value={filter.keyword}
                onChange={(e) => setFilter((prev) => ({ ...prev, keyword: e.target.value }))}
              />
            </div>
            <div className={styles.filterActions}>
              <button className={styles.ghostBtn} onClick={resetFilter}>
                <i className="fas fa-rotate-left" />
                {t('assets.transactions.reset')}
              </button>
              <button className={styles.ghostBtn}>
                <i className="fas fa-download" />
                {t('assets.transactions.exportCsv')}
              </button>
            </div>
          </div>
        </div>

        {/* 交易表格 */}
        <div className={styles.txTable}>
          <Table<TxRecord>
            dataSource={filteredRecords}
            columns={columns}
            rowKey="id"
            size="small"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50'],
              showTotal: (total) => t('assets.transactions.totalRecords', { count: total }),
            }}
            scroll={{ x: 1100 }}
          />
        </div>

        {/* 交易详情抽屉 */}
        <Drawer
          open={!!detailRecord}
          onClose={() => setDetailRecord(null)}
          width={520}
          title={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <i className="fas fa-receipt" style={{ color: '#38bdf8' }} />
              {t('assets.transactions.detailTitle')}
            </span>
          }
          className={styles.detailDrawer}
        >
          {detailRecord && (
            <div className={styles.detailSection}>
              {/* 基本信息 */}
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailType')}</span>
                  <span className={styles.detailValue}>
                    <span className={styles.typeTag}>
                      <span
                        className={styles.typeIcon}
                        style={{
                          background: TX_TYPE_COLORS[detailRecord.type].bg,
                          color: TX_TYPE_COLORS[detailRecord.type].color,
                        }}
                      >
                        <i className={TX_TYPE_ICONS[detailRecord.type]} />
                      </span>
                      {txTypeLabels[detailRecord.type]}
                    </span>
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailDirection')}</span>
                  <span className={`${styles.dirTag} ${DIR_CLASS_MAP[detailRecord.direction]}`}>
                    <i className={TX_DIRECTION_ICONS[detailRecord.direction]} />
                    {txDirectionLabels[detailRecord.direction]}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailAmount')}</span>
                  <span className={styles.detailValue} style={{ fontWeight: 600 }}>
                    {detailRecord.amount > 0
                      ? `${formatAmount(detailRecord.amount, detailRecord.tokenDecimals)} ${detailRecord.tokenSymbol}`
                      : '—'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailStatus')}</span>
                  <span className={`${styles.statusPill} ${STATUS_CLASS_MAP[detailRecord.status]}`}>
                    {txStatusLabels[detailRecord.status]}
                  </span>
                </div>
              </div>

              {/* 哈希与地址 */}
              <div className={styles.detailGrid}>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailTxHash')}</span>
                  <div className={styles.detailMonoValue}>
                    <code style={{ color: '#7dd3fc', fontSize: 12 }}>{detailRecord.txHash}</code>
                    <button className={styles.copyBtn} title={t('assets.transactions.copy')}>
                      <i className="fas fa-copy" />
                    </button>
                  </div>
                </div>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailSender')}</span>
                  <div className={styles.detailMonoValue}>
                    <code style={{ color: '#94a3b8', fontSize: 12 }}>{detailRecord.from}</code>
                    <button className={styles.copyBtn} title={t('assets.transactions.copy')}>
                      <i className="fas fa-copy" />
                    </button>
                  </div>
                </div>
                <div className={styles.detailItemFull}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailReceiver')}</span>
                  <div className={styles.detailMonoValue}>
                    <code style={{ color: '#94a3b8', fontSize: 12 }}>{detailRecord.to}</code>
                    <button className={styles.copyBtn} title={t('assets.transactions.copy')}>
                      <i className="fas fa-copy" />
                    </button>
                  </div>
                </div>
                {detailRecord.contractAddress && (
                  <div className={styles.detailItemFull}>
                    <span className={styles.detailLabel}>{t('assets.transactions.detailContractAddress')}</span>
                    <div className={styles.detailMonoValue}>
                      <code style={{ color: '#f472b6', fontSize: 12 }}>{detailRecord.contractAddress}</code>
                      <button className={styles.copyBtn} title={t('assets.transactions.copy')}>
                        <i className="fas fa-copy" />
                      </button>
                    </div>
                  </div>
                )}
                {detailRecord.methodName && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>{t('assets.transactions.detailContractMethod')}</span>
                    <span className={styles.detailMonoValue}>
                      <code style={{ color: '#a78bfa', fontSize: 12 }}>{detailRecord.methodName}()</code>
                    </span>
                  </div>
                )}
              </div>

              {/* 链与区块信息 */}
              <div className={styles.detailGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailChainNetwork')}</span>
                  <span className={styles.detailValue}>{detailRecord.chainName}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Chain ID</span>
                  <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {detailRecord.chainId}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailBlockHeight')}</span>
                  <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {detailRecord.status === 'pending' ? t('assets.transactions.pendingBlock') : detailRecord.blockNumber.toLocaleString()}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailConfirmations')}</span>
                  <span
                    className={styles.detailValue}
                    style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: detailRecord.confirmations >= 12 ? '#6ee7b7' : detailRecord.confirmations > 0 ? '#fbbf24' : '#64748b',
                    }}
                  >
                    {detailRecord.confirmations}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Nonce</span>
                  <span className={styles.detailValue} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {detailRecord.nonce}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>{t('assets.transactions.detailTime')}</span>
                  <span className={styles.detailValue}>{detailRecord.timestamp}</span>
                </div>
              </div>

              {/* Gas 详情 */}
              <div className={styles.detailCard}>
                <div className={styles.detailCardTitle}>
                  <i className="fas fa-gas-pump" />
                  {t('assets.transactions.gasDetailTitle')}
                </div>
                <div className={styles.detailGasRow}>
                  <span className={styles.detailGasLabel}>{t('assets.transactions.gasUsed')}</span>
                  <span className={styles.detailGasValue}>{detailRecord.gasUsed.toLocaleString()}</span>
                </div>
                <div className={styles.detailGasRow}>
                  <span className={styles.detailGasLabel}>{t('assets.transactions.gasPrice')}</span>
                  <span className={styles.detailGasValue}>{detailRecord.gasPrice} Gwei</span>
                </div>
                <div className={styles.detailGasRow}>
                  <span className={styles.detailGasLabel}>{t('assets.transactions.gasNativeFee')}</span>
                  <span className={styles.detailGasValue}>{detailRecord.gasFeeNative} {CHAIN_LIST.find((c) => c.chainId === detailRecord.chainId)?.nativeSymbol ?? 'ETH'}</span>
                </div>
                <div className={styles.detailGasRow}>
                  <span className={styles.detailGasLabel}>{t('assets.transactions.gasUsdEstimate')}</span>
                  <span className={styles.detailGasValue} style={{ color: '#6ee7b7' }}>
                    ${formatUsd(detailRecord.gasFeeUSD)}
                  </span>
                </div>
              </div>

              {/* 备注 & 订单 */}
              {(detailRecord.memo || detailRecord.orderId) && (
                <div className={styles.detailGrid}>
                  {detailRecord.memo && (
                    <div className={styles.detailItemFull}>
                      <span className={styles.detailLabel}>{t('assets.transactions.detailMemo')}</span>
                      <span className={styles.detailValue}>{detailRecord.memo}</span>
                    </div>
                  )}
                  {detailRecord.orderId && (
                    <div className={styles.detailItemFull}>
                      <span className={styles.detailLabel}>{t('assets.transactions.detailOrderId')}</span>
                      <span className={styles.detailValue} style={{ color: '#7dd3fc' }}>
                        {detailRecord.orderId}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* 操作 */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, paddingTop: 4 }}>
                <button className={styles.ghostBtn}>
                  <i className="fas fa-external-link-alt" />
                  {t('assets.transactions.viewOnExplorer')}
                </button>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </ConfigProvider>
  );
};

export default TransactionsManager;
