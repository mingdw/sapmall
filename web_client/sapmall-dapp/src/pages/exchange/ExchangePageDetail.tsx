import React from 'react';
import { Toaster, toast } from 'sonner';
import { CheckCircle, Award, Layers } from 'lucide-react';
import ParticleBackground from './components/ParticleBackground';
import SwapCard from './components/SwapCard';
import MarketStats from './components/MarketStats';
import PriceChart from './components/PriceChart';
import RecentTransactions from './components/RecentTransactions';
import SapTokenVisual from './components/SapTokenVisual';
import styles from './ExchangePageDetail.module.scss';

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
            使用主流稳定币即可轻松兑换 SAP，进入 SAPMall 区块链电商生态
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
            <ErrorBoundary>
              <SwapCard onSwapSuccess={handleSwapSuccess} />
            </ErrorBoundary>

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
