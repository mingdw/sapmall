import React, { useState, useMemo } from 'react';
import { ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { BalanceOverview, TransactionHistory, BalanceOperations } from './components';
import { balanceTheme } from './balanceTheme';
import { mockUserProfile, mockTransactions, mockAdjustments } from './constants';
import type { TokenSymbol, ChainBalanceInfo } from './types';
import styles from './BalanceManager.module.scss';

const TOKEN_META: Record<TokenSymbol, { color: string; bg: string; icon: string }> = {
  SAP:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  icon: 'fas fa-coins' },
  USDC:   { color: '#7dd3fc', bg: 'rgba(56,189,248,0.12)',  icon: 'fas fa-dollar-sign' },
  EURC:   { color: '#6ee7b7', bg: 'rgba(16,185,129,0.12)',  icon: 'fas fa-euro-sign' },
  cirBTC: { color: '#fca5a5', bg: 'rgba(248,113,113,0.12)', icon: 'fab fa-bitcoin' },
};

function formatAmount(val: number, decimals: number): string {
  if (decimals === 8) {
    return val.toFixed(8).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  }
  return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function computeTokenTotals(chains: ChainBalanceInfo[]) {
  const map = new Map<TokenSymbol, { total: number; decimals: number; chains: { name: string; balance: number }[] }>();
  for (const chain of chains) {
    for (const token of chain.tokens) {
      const existing = map.get(token.symbol);
      if (existing) {
        existing.total += token.balance;
        existing.chains.push({ name: chain.chainName, balance: token.balance });
      } else {
        map.set(token.symbol, {
          total: token.balance,
          decimals: token.decimals,
          chains: [{ name: chain.chainName, balance: token.balance }],
        });
      }
    }
  }
  return map;
}

const BalanceManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const profile = mockUserProfile;

  const tokenTotals = useMemo(() => computeTokenTotals(profile.chainBalances), [profile.chainBalances]);
  const tokenEntries = useMemo(() => Array.from(tokenTotals.entries()), [tokenTotals]);

  const tabItems: TabsProps['items'] = [
    {
      key: 'overview',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-wallet" />
          余额总览
        </span>
      ),
      children: <BalanceOverview profile={profile} />,
    },
    {
      key: 'transactions',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-history" />
          交易记录
        </span>
      ),
      children: <TransactionHistory transactions={mockTransactions} />,
    },
    {
      key: 'operations',
      label: (
        <span className={styles.tabLabel}>
          <i className="fas fa-balance-scale" />
          余额操作
        </span>
      ),
      children: <BalanceOperations profile={profile} adjustments={mockAdjustments} />,
    },
  ];

  return (
    <ConfigProvider theme={balanceTheme}>
      <div className={styles.balancePage}>
        {/* 代币汇总统计 */}
        <div className={styles.tokenSummaryGrid}>
          {tokenEntries.map(([symbol, info]) => {
            const meta = TOKEN_META[symbol] ?? { color: '#94a3b8', bg: 'rgba(100,116,139,0.12)', icon: 'fas fa-coins' };
            const chainCount = info.chains.length;
            return (
              <div key={symbol} className={styles.tokenSummaryCard}>
                <div className={styles.tokenSummaryHead}>
                  <div className={styles.tokenSummaryIcon} style={{ background: meta.bg, color: meta.color }}>
                    <i className={meta.icon} />
                  </div>
                  <span className={styles.tokenSummarySymbol}>{symbol}</span>
                </div>
                <div className={styles.tokenSummaryValue}>
                  {formatAmount(info.total, info.decimals)}
                </div>
                <div className={styles.tokenSummaryChains}>
                  {info.chains.map((c, idx) => (
                    <span
                      key={c.name}
                      className={styles.tokenSummaryChainItem}
                      style={{ opacity: 1 - idx * 0.25 }}
                    >
                      {c.name}: {formatAmount(c.balance, info.decimals)}
                      {idx < info.chains.length - 1 && <span className={styles.tokenSummaryDot}>·</span>}
                    </span>
                  ))}
                </div>
                <div className={styles.tokenSummaryHint}>
                  分布在 {chainCount} 条链上
                </div>
              </div>
            );
          })}
        </div>

        <Tabs
          className={styles.balanceTabs}
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          destroyInactiveTabPane={false}
        />
      </div>
    </ConfigProvider>
  );
};

export default BalanceManager;
