import React, { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { CheckCircle, Award, Layers, Wallet, ArrowRightLeft, Landmark } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { baseClient } from '../../services/api/baseClient';
import i18n from '../../i18n';
import ParticleBackground from './components/ParticleBackground';
import SwapCard from './components/SwapCard';
import MarketStats from './components/MarketStats';
import PriceChart from './components/PriceChart';
import RecentTransactions from './components/RecentTransactions';
import SapTokenVisual from './components/SapTokenVisual';
import styles from './ExchangePageDetail.module.scss';

type ExchangeTab = 'swap' | 'merchantDeposit';
type MerchantDepositLite = {
  amount?: string;
  token?: string;
  intentId?: string;
  expireAt?: string;
  depositStatus?: number;
};

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.log('[ExchangePageDetail] ErrorBoundary caught:', error);
    toast.error(i18n.t('exchange.errors.pageErrorToast'));
  }

  render() {
    return this.state.hasError
      ? <div className="p-8 text-center text-muted-foreground">{i18n.t('exchange.errors.pageErrorFallback')}</div>
      : this.props.children;
  }
}

const ExchangePageDetail: React.FC = () => {
  const { t, ready } = useTranslation();
  const [searchParams] = useSearchParams();
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<ExchangeTab>('swap');
  const [depositProcessing, setDepositProcessing] = useState(false);
  const [depositPaid, setDepositPaid] = useState(false);
  const [depositTxHash, setDepositTxHash] = useState('');
  const [checkingAccess, setCheckingAccess] = useState(false);
  const [latestPendingDeposit, setLatestPendingDeposit] = useState<MerchantDepositLite | null>(null);
  const merchantTickerItems = useMemo(
    () => [
      '0x12A9...3cF8',
      '0x9B3e...A71d',
      '0x4d77...8E2a',
      '0xAA90...1b5C',
      '0x73f1...D0E9',
      '0xE812...6a44',
    ],
    []
  );

  const queryDepositStatus = Number(searchParams.get('depositStatus') || '0');
  const hasPendingDepositFromQuery = Boolean(searchParams.get('intentId')) && queryDepositStatus === 1;

  const canOperateSwap = isConnected;
  const canOperateDeposit = isConnected && (Boolean(latestPendingDeposit?.intentId) || hasPendingDepositFromQuery);

  const merchantIntentInfo = useMemo(() => {
    const amount = searchParams.get('amount') || latestPendingDeposit?.amount || '--';
    const token = searchParams.get('token') || latestPendingDeposit?.token || 'USDT';
    const intentId = searchParams.get('intentId') || latestPendingDeposit?.intentId || '--';
    const expireAt = searchParams.get('expireAt') || latestPendingDeposit?.expireAt || '--';
    const returnPath = searchParams.get('returnPath') || '/admin?menu=profile';
    return { amount, token, intentId, expireAt, returnPath };
  }, [latestPendingDeposit, searchParams]);

  useEffect(() => {
    let cancelled = false;
    const checkDepositIntent = async () => {
      if (!isConnected) {
        setLatestPendingDeposit(null);
        return;
      }
      setCheckingAccess(true);
      try {
        const resp = await baseClient.get<any>('/api/user/deposit/info/latest', { silent: true });
        const payload = resp?.data;
        if (!payload?.exists || !payload?.deposit) {
          if (!cancelled) setLatestPendingDeposit(null);
          return;
        }
        const depositStatus = Number(payload.deposit.depositStatus ?? 0);
        if (depositStatus === 1) {
          if (!cancelled) {
            setLatestPendingDeposit({
              amount: String(payload.deposit.amount ?? ''),
              token: payload.deposit.token || payload.deposit.tokenSymbol || 'USDT',
              intentId: payload.deposit.intentId || '',
              expireAt: payload.deposit.expireAt || '',
              depositStatus,
            });
          }
          return;
        }
        if (!cancelled) setLatestPendingDeposit(null);
      } catch {
        if (!cancelled) setLatestPendingDeposit(null);
      } finally {
        if (!cancelled) setCheckingAccess(false);
      }
    };
    checkDepositIntent();
    return () => {
      cancelled = true;
    };
  }, [isConnected]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'merchantDeposit') {
      if (canOperateDeposit) {
        setActiveTab('merchantDeposit');
      } else {
        setActiveTab('swap');
      }
      return;
    }
    setActiveTab('swap');
  }, [canOperateDeposit, searchParams]);

  const handleSwapSuccess = (amount: string) => {
    toast.success(t('exchange.toasts.swapSuccess'), {
      description: t('exchange.toasts.swapSuccessDesc', { amount }),
    });
  };

  const handleDepositPay = async () => {
    if (!canOperateDeposit) {
      toast.warning(!isConnected ? t('exchange.toasts.connectWallet') : t('exchange.toasts.noPendingDeposit'));
      return;
    }
    if (!merchantIntentInfo.intentId || merchantIntentInfo.intentId === '--') {
      toast.error(t('exchange.toasts.missingIntent'));
      return;
    }
    setDepositProcessing(true);
    setDepositPaid(false);
    setDepositTxHash('');
    setTimeout(() => {
      const mockTxHash = `0x${Math.random().toString(16).slice(2)}${Math.random()
        .toString(16)
        .slice(2, 18)}`;
      setDepositProcessing(false);
      setDepositPaid(true);
      setDepositTxHash(mockTxHash);
      toast.success(t('exchange.toasts.depositSuccess'), {
        description: t('exchange.toasts.depositTxHash', {
          prefix: mockTxHash.slice(0, 12),
          suffix: mockTxHash.slice(-8),
        }),
      });
    }, 1800);
  };

  const handleBackToAdmin = () => {
    const returnPath = merchantIntentInfo.returnPath || '/admin?menu=profile';

    // 独立窗口由 Admin 打开时，优先关闭当前页并回到原窗口
    if (window.opener && !window.opener.closed) {
      window.close();
      return;
    }

    // 兼容绝对地址与站内路径
    if (/^https?:\/\//.test(returnPath)) {
      window.location.href = returnPath;
      return;
    }

    window.location.href = returnPath.startsWith('/') ? returnPath : `/${returnPath}`;
  };

  if (!ready) {
    return (
      <div className={`relative ${styles.pageRoot}`}>
        <div className="relative z-10 px-4 py-8 text-sm text-gray-400" aria-busy="true">
          {t('common.loading')}
        </div>
      </div>
    );
  }

  return (
    <div data-cmp="ExchangePageDetail" className={`relative ${styles.pageRoot}`}>
      <ParticleBackground />
      <Toaster position="top-right" theme="dark" />

      <div className="relative z-10 px-4 py-8 lg:px-8">
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${styles.heroTag}`}>
            <div className={`w-2 h-2 rounded-full ${styles.heroDot}`} />
            <span className={`text-xs ${styles.heroTagText}`}>{t('exchange.hero.tagline')}</span>
          </div>
          <h1 className={`text-4xl lg:text-5xl font-bold mb-3 ${styles.heroTitle}`}>
            {t('exchange.hero.title')}
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            {t('exchange.hero.subtitle')}
          </p>

          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            {[
              { icon: CheckCircle, labelKey: 'exchange.badges.audited', color: '#69f0ae' },
              { icon: Award, labelKey: 'exchange.badges.bestRate', color: '#ffd740' },
              { icon: Layers, labelKey: 'exchange.badges.multiChain', color: '#00e5ff' },
            ].map(({ icon: Icon, labelKey, color }) => (
              <div key={labelKey} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${styles.featureBadge}`}>
                <Icon size={13} style={{ color }} />
                <span className="text-xs text-muted-foreground">{t(labelKey)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.merchantTickerWrap} mb-6`}>
          <div className={styles.merchantTickerTrack}>
            {[...merchantTickerItems, ...merchantTickerItems].map((address, idx) => (
              <div key={`${address}-${idx}`} className={styles.merchantTickerItem}>
                <span className={styles.merchantTickerTag}>{t('exchange.ticker.tag')}</span>
                <span className={styles.merchantTickerText}>
                  {t('exchange.ticker.congrats')} <b>{address}</b> <em>{t('exchange.ticker.joinedSuffix')}</em>
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col xl:flex-row gap-6 items-start max-w-[1440px] mx-auto">
          <div className="flex flex-col gap-5 w-full xl:w-[280px] xl:flex-shrink-0">
            <div className={`rounded-3xl p-6 ${styles.panelCard}`}>
              <SapTokenVisual />
            </div>

            <div className={`rounded-3xl p-6 ${styles.panelCard}`}>
              <MarketStats />
            </div>
          </div>

          <div className="flex-1 w-full flex flex-col items-center gap-5">
            <div className={`w-full max-w-[520px] ${styles.exchangeTabWrap}`}>
              <button
                type="button"
                className={`${styles.exchangeTabBtn} ${activeTab === 'swap' ? styles.exchangeTabBtnActive : ''}`}
                onClick={() => {
                  if (!canOperateSwap) {
                    toast.warning(t('exchange.toasts.swapTabWallet'));
                    return;
                  }
                  setActiveTab('swap');
                }}
              >
                <ArrowRightLeft size={15} />
                {t('exchange.tabs.swap')}
              </button>
              <button
                type="button"
                className={`${styles.exchangeTabBtn} ${activeTab === 'merchantDeposit' ? styles.exchangeTabBtnActive : ''}`}
                onClick={() => {
                  if (!canOperateDeposit) {
                    toast.warning(!isConnected ? t('exchange.toasts.connectWallet') : t('exchange.toasts.depositTabNoPending'));
                    return;
                  }
                  setActiveTab('merchantDeposit');
                }}
              >
                <Landmark size={15} />
                {t('exchange.tabs.deposit')}
              </button>
            </div>

            {!isConnected ? (
              <p className="text-xs text-amber-400 text-center">
                {t('exchange.hints.walletRequired')}
              </p>
            ) : null}
            {isConnected && !checkingAccess && !canOperateDeposit ? (
              <p className="text-xs text-muted-foreground text-center">
                {t('exchange.hints.depositLocked')}
              </p>
            ) : null}
            {checkingAccess ? (
              <p className="text-xs text-muted-foreground text-center">{t('exchange.hints.syncingDeposit')}</p>
            ) : null}

            {activeTab === 'swap' ? (
              <ErrorBoundary>
                <SwapCard
                  onSwapSuccess={handleSwapSuccess}
                  disabled={!canOperateSwap}
                  disabledReason={t('exchange.swap.disabledReason')}
                />
              </ErrorBoundary>
            ) : (
              <div className={`w-full max-w-[520px] rounded-3xl p-6 ${styles.depositPanel}`}>
                <div className={styles.depositHeader}>
                  <div className={styles.depositHeaderIcon}>
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h3 className={styles.depositTitle}>{t('exchange.deposit.title')}</h3>
                    <p className={styles.depositSubTitle}>{t('exchange.deposit.subtitle')}</p>
                  </div>
                </div>

                <div className={styles.depositInfoList}>
                  <div className={styles.depositInfoItem}>
                    <span>{t('exchange.deposit.amountDue')}</span>
                    <strong>{merchantIntentInfo.amount} {merchantIntentInfo.token}</strong>
                  </div>
                  <div className={styles.depositInfoItem}>
                    <span>{t('exchange.deposit.intentId')}</span>
                    <strong>{merchantIntentInfo.intentId}</strong>
                  </div>
                  <div className={styles.depositInfoItem}>
                    <span>{t('exchange.deposit.deadline')}</span>
                    <strong>{merchantIntentInfo.expireAt}</strong>
                  </div>
                </div>

                <div className={styles.depositActions}>
                  <button
                    type="button"
                    className={styles.depositPrimaryBtn}
                    onClick={handleDepositPay}
                    disabled={depositProcessing || !canOperateDeposit}
                  >
                    {depositProcessing
                      ? t('exchange.deposit.payProcessing')
                      : depositPaid
                        ? t('exchange.deposit.paySubmitted')
                        : t('exchange.deposit.payNow')}
                  </button>
                </div>

                {depositPaid && depositTxHash ? (
                  <>
                    <p className={styles.depositHint}>{t('exchange.deposit.txSubmitted', { hash: depositTxHash })}</p>
                    <div className={styles.depositActions}>
                      <button
                        type="button"
                        className={styles.depositGhostBtn}
                        onClick={handleBackToAdmin}
                      >
                        {t('exchange.deposit.backAdmin')}
                      </button>
                    </div>
                  </>
                ) : null}

                <p className={styles.depositHint}>
                  {t('exchange.deposit.footnote')}
                </p>
              </div>
            )}

            <div className={`w-full max-w-[520px] rounded-2xl p-4 ${styles.stableCoinPanel}`}>
              <p className="text-xs text-muted-foreground mb-3 text-center">{t('exchange.supportedCoins')}</p>
              <div className="flex items-center justify-center gap-6">
                {['USDT', 'USDC', 'BUSD', 'DAI', 'BNB', 'SOL'].map((coin) => (
                  <div key={coin} className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${styles.coinIcon} ${
                      coin === 'USDT'
                        ? styles.coinUsdt
                        : coin === 'USDC'
                          ? styles.coinUsdc
                          : coin === 'BUSD'
                            ? styles.coinBusd
                            : coin === 'DAI'
                              ? styles.coinDai
                              : coin === 'BNB'
                                ? styles.coinBusd
                                : styles.coinUsdc
                    }`}>
                      {coin === 'USDT' ? '₮' : coin === 'USDC' ? '◎' : coin === 'BUSD' ? 'B' : coin === 'DAI' ? '◇' : coin === 'BNB' ? '◆' : '✦'}
                    </div>
                    <span className="text-xs text-muted-foreground">{coin}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 w-full xl:w-[320px] xl:flex-shrink-0">
            <div className={`rounded-3xl p-6 ${styles.panelCard}`}>
              <PriceChart />
            </div>

            <div className={`rounded-3xl p-6 ${styles.panelCard}`}>
              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExchangePageDetail;
