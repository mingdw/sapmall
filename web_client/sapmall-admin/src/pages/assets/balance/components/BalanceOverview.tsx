import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Button, Tag } from 'antd';
import { Copy } from 'lucide-react';
import type { UserProfile, ChainBalanceInfo, TokenSymbol } from '../types';
import { getUserStatusLabels } from '../constants';
import styles from '../BalanceManager.module.scss';

const { Option } = Select;

interface BalanceOverviewProps {
  profile: UserProfile;
}

const TOKEN_COLORS: Record<TokenSymbol, { bg: string; color: string }> = {
  SAP: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24' },
  USDC: { bg: 'rgba(56,189,248,0.12)', color: '#7dd3fc' },
  EURC: { bg: 'rgba(16,185,129,0.12)', color: '#6ee7b7' },
  cirBTC: { bg: 'rgba(248,113,113,0.12)', color: '#fca5a5' },
};

function formatAmount(val: number, decimals: number): string {
  if (decimals === 8) {
    return val.toFixed(8).replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  }
  return val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const BalanceOverview: React.FC<BalanceOverviewProps> = ({ profile }) => {
  const { t } = useTranslation();
  const [selectedChainId, setSelectedChainId] = useState<number>(
    profile.chainBalances[0]?.chainId ?? 0,
  );

  const currentChain: ChainBalanceInfo | undefined = useMemo(
    () => profile.chainBalances.find((c) => c.chainId === selectedChainId),
    [profile.chainBalances, selectedChainId],
  );

  const userStatusLabels = getUserStatusLabels(t);
  const statusCls = profile.status === 'active' ? styles.statusActive : profile.status === 'frozen' ? styles.statusFrozen : styles.statusInactive;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => undefined);
  };

  return (
    <div>
      {/* 链切换 */}
      <div className={styles.chainSelector}>
        <span className={styles.chainSelectorLabel}>{t('assets.balance.walletInfo.selectChain')}</span>
        <Select
          value={selectedChainId}
          onChange={setSelectedChainId}
          style={{ width: 200 }}
          size="small"
        >
          {profile.chainBalances.map((c) => (
            <Option key={c.chainId} value={c.chainId}>
              {c.chainName} (#{c.chainId})
            </Option>
          ))}
        </Select>
      </div>

      {/* 代币余额卡片 */}
      {currentChain && (
        <div className={styles.tokenBalanceGrid}>
          {currentChain.tokens.map((token) => {
            const colors = TOKEN_COLORS[token.symbol] ?? { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8' };
            return (
              <div key={token.symbol} className={styles.tokenCard}>
                <div
                  className={styles.tokenCardIcon}
                  style={{ background: colors.bg, color: colors.color }}
                >
                  {token.symbol.charAt(0)}
                </div>
                <div className={styles.tokenCardContent}>
                  <span className={styles.tokenCardSymbol}>{token.symbol}</span>
                  <span className={styles.tokenCardValue}>{formatAmount(token.balance, token.decimals)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 钱包信息 */}
      <div className={styles.walletPanel}>
        <h3 className={styles.walletPanelTitle}>
          <i className="fas fa-info-circle" />
          {t('assets.balance.walletInfo.title')}
        </h3>
        <div className={styles.walletInfoGrid}>
          <div className={styles.walletInfoItem}>
            <span className={styles.walletInfoLabel}>{t('assets.balance.walletInfo.walletAddress')}</span>
            <div className={styles.walletInfoValue}>
              <code className={styles.monoText} style={{ color: '#94a3b8' }}>{profile.walletAddress}</code>
              <button className={styles.iconBtn} onClick={() => handleCopy(profile.walletAddress)} title={t('assets.balance.walletInfo.copyAddress')}>
                <Copy size={12} />
              </button>
            </div>
          </div>
          <div className={styles.walletInfoItem}>
            <span className={styles.walletInfoLabel}>{t('assets.balance.walletInfo.accountStatus')}</span>
            <span className={`${styles.statusPill} ${statusCls}`}>{userStatusLabels[profile.status]}</span>
          </div>
          <div className={styles.walletInfoItem}>
            <span className={styles.walletInfoLabel}>{t('assets.balance.walletInfo.chain')}</span>
            <span className={styles.walletInfoValue}>
              {currentChain?.chainName ?? '—'}
              {currentChain && (
                <Tag bordered={false} style={{ background: 'rgba(51,65,85,0.35)', border: '1px solid rgba(71,85,105,0.35)', color: '#94a3b8', fontSize: 11, marginLeft: 4 }}>
                  {currentChain.nativeSymbol}
                </Tag>
              )}
            </span>
          </div>
          <div className={styles.walletInfoItem}>
            <span className={styles.walletInfoLabel}>{t('assets.balance.walletInfo.userId')}</span>
            <span className={styles.walletInfoValue} style={{ fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{profile.userId}</span>
          </div>
          <div className={styles.walletInfoItem}>
            <span className={styles.walletInfoLabel}>{t('assets.balance.walletInfo.registeredAt')}</span>
            <span className={styles.walletInfoValue}>{profile.registeredAt}</span>
          </div>
          <div className={styles.walletInfoItem}>
            <span className={styles.walletInfoLabel}>{t('assets.balance.walletInfo.lastActiveAt')}</span>
            <span className={styles.walletInfoValue}>{profile.lastActiveAt}</span>
          </div>
        </div>
      </div>

      {/* 收款地址 */}
      <div className={styles.qrSection}>
        <div className={styles.qrPlaceholder}>
          <i className="fas fa-qrcode" />
        </div>
        <div className={styles.qrDetails}>
          <span className={styles.qrLabel}>{t('assets.balance.walletInfo.myReceivingAddress')}</span>
          <div className={styles.qrAddress}>
            <code>{profile.walletAddress}</code>
            <button className={styles.iconBtn} onClick={() => handleCopy(profile.walletAddress)} title={t('assets.balance.walletInfo.copyAddress')}>
              <Copy size={12} />
            </button>
          </div>
          <div className={styles.qrActions}>
            <Button size="small" ghost icon={<i className="fas fa-download" style={{ marginRight: 4 }} />}>
              {t('assets.balance.walletInfo.downloadQR')}
            </Button>
            <Button size="small" ghost icon={<i className="fas fa-share-alt" style={{ marginRight: 4 }} />}>
              {t('assets.balance.walletInfo.shareAddress')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceOverview;
