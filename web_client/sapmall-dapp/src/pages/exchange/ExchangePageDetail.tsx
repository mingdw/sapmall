import React, { useEffect, useMemo, useState } from 'react';
import { Toaster, toast } from 'sonner';
import { CheckCircle, Award, Layers, Wallet, ArrowRightLeft, Landmark } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import SwapCard from './components/SwapCard';
import MarketStats from './components/MarketStats';
import PriceChart from './components/PriceChart';
import RecentTransactions from './components/RecentTransactions';
import SapTokenVisual from './components/SapTokenVisual';
import styles from './ExchangePageDetail.module.scss';

type ExchangeTab = 'swap' | 'merchantDeposit';

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
    toast.error('页面出现错误，请刷新重试');
  }

  render() {
    return this.state.hasError
      ? <div className="p-8 text-center text-muted-foreground">页面出现错误，请刷新重试</div>
      : this.props.children;
  }
}

const ExchangePageDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<ExchangeTab>('swap');
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

  const merchantIntentInfo = useMemo(() => {
    const amount = searchParams.get('amount') || '--';
    const token = searchParams.get('token') || 'USDT';
    const intentId = searchParams.get('intentId') || '--';
    const expireAt = searchParams.get('expireAt') || '--';
    return { amount, token, intentId, expireAt };
  }, [searchParams]);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'merchantDeposit') {
      setActiveTab('merchantDeposit');
      return;
    }
    setActiveTab('swap');
  }, [searchParams]);

  const handleSwapSuccess = (amount: string) => {
    toast.success('兑换成功！', {
      description: `您已获得 ${amount} SAP 代币`,
    });
  };

  return (
    <div data-cmp="ExchangePageDetail" className={`min-h-full relative ${styles.pageRoot}`}>
      <ParticleBackground />
      <Toaster position="top-right" theme="dark" />

      <div className="relative z-10 px-4 py-8 lg:px-8">
        <div className="text-center mb-10">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${styles.heroTag}`}>
            <div className={`w-2 h-2 rounded-full ${styles.heroDot}`} />
            <span className={`text-xs ${styles.heroTagText}`}>去中心化兑换 · 安全 · 快速 · 低手续费</span>
          </div>
          <h1 className={`text-4xl lg:text-5xl font-bold mb-3 ${styles.heroTitle}`}>
            兑换 SAP 代币
          </h1>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            使用主流稳定币兑换 SAP，购物可享更低手续费、商家专属折扣与生态活动优先权益
          </p>

          <div className="flex items-center justify-center gap-4 mt-5 flex-wrap">
            {[
              { icon: CheckCircle, label: '合约已审计', color: '#69f0ae' },
              { icon: Award, label: '最优汇率', color: '#ffd740' },
              { icon: Layers, label: '多链支持', color: '#00e5ff' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl ${styles.featureBadge}`}>
                <Icon size={13} style={{ color }} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={`${styles.merchantTickerWrap} mb-6`}>
          <div className={styles.merchantTickerTrack}>
            {[...merchantTickerItems, ...merchantTickerItems].map((address, idx) => (
              <div key={`${address}-${idx}`} className={styles.merchantTickerItem}>
                <span className={styles.merchantTickerTag}>商家入驻</span>
                <span className={styles.merchantTickerText}>
                  恭喜 <b>{address}</b> <em>入驻成为商家</em>
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
                onClick={() => setActiveTab('swap')}
              >
                <ArrowRightLeft size={15} />
                稳定币兑换 SAP
              </button>
              <button
                type="button"
                className={`${styles.exchangeTabBtn} ${activeTab === 'merchantDeposit' ? styles.exchangeTabBtnActive : ''}`}
                onClick={() => setActiveTab('merchantDeposit')}
              >
                <Landmark size={15} />
                缴纳商家保证金
              </button>
            </div>

            {activeTab === 'swap' ? (
              <ErrorBoundary>
                <SwapCard onSwapSuccess={handleSwapSuccess} />
              </ErrorBoundary>
            ) : (
              <div className={`w-full max-w-[520px] rounded-3xl p-6 ${styles.depositPanel}`}>
                <div className={styles.depositHeader}>
                  <div className={styles.depositHeaderIcon}>
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h3 className={styles.depositTitle}>商家保证金缴纳</h3>
                    <p className={styles.depositSubTitle}>请在有效期内完成支付，逾期后申请单会失效。</p>
                  </div>
                </div>

                <div className={styles.depositInfoList}>
                  <div className={styles.depositInfoItem}>
                    <span>应缴金额</span>
                    <strong>{merchantIntentInfo.amount} {merchantIntentInfo.token}</strong>
                  </div>
                  <div className={styles.depositInfoItem}>
                    <span>意图单ID</span>
                    <strong>{merchantIntentInfo.intentId}</strong>
                  </div>
                  <div className={styles.depositInfoItem}>
                    <span>截止时间</span>
                    <strong>{merchantIntentInfo.expireAt}</strong>
                  </div>
                </div>

                <div className={styles.depositActions}>
                  <button
                    type="button"
                    className={styles.depositPrimaryBtn}
                    onClick={() => toast.info('保证金支付流程即将接入，请稍后重试')}
                  >
                    使用钱包立即支付
                  </button>
                  <button
                    type="button"
                    className={styles.depositGhostBtn}
                    onClick={() => setActiveTab('swap')}
                  >
                    返回兑换 SAP
                  </button>
                </div>

                <p className={styles.depositHint}>
                  说明：当前为商家保证金缴纳区域预留版本。后续将按申请单状态接入链上支付与确认流程。
                </p>
              </div>
            )}

            <div className={`w-full max-w-[520px] rounded-2xl p-4 ${styles.stableCoinPanel}`}>
              <p className="text-xs text-muted-foreground mb-3 text-center">支持的稳定币</p>
              <div className="flex items-center justify-center gap-6">
                {['USDT', 'USDC', 'BUSD', 'DAI'].map((coin) => (
                  <div key={coin} className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${styles.coinIcon} ${
                      coin === 'USDT' ? styles.coinUsdt : coin === 'USDC' ? styles.coinUsdc : coin === 'BUSD' ? styles.coinBusd : styles.coinDai
                    }`}>
                      {coin === 'USDT' ? '₮' : coin === 'USDC' ? '◎' : coin === 'BUSD' ? 'B' : '◇'}
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
