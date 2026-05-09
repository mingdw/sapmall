import { TrendingUp, TrendingDown, BarChart2, Users, Layers, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import styles from '../ExchangePageDetail.module.scss';

interface StatItem {
  labelKey: 'sapPrice' | 'vol24h' | 'tvl' | 'holders';
  value: string;
  change: string;
  positive: boolean;
  icon: 'trending-up' | 'bar' | 'users' | 'layers' | 'activity';
}

const STATS: StatItem[] = [
  { labelKey: 'sapPrice', value: '$0.351', change: '+5.82%', positive: true, icon: 'trending-up' },
  { labelKey: 'vol24h', value: '$2.84M', change: '+12.4%', positive: true, icon: 'bar' },
  { labelKey: 'tvl', value: '$18.6M', change: '+3.1%', positive: true, icon: 'layers' },
  { labelKey: 'holders', value: '142,580', change: '+1,240', positive: true, icon: 'users' },
];

function IconComponent({ type }: { type: StatItem['icon'] }) {
  const iconClass = `h-[18px] w-[18px] ${styles.accentCyan}`;
  if (type === 'trending-up') return <TrendingUp className={iconClass} />;
  if (type === 'bar') return <BarChart2 className={iconClass} />;
  if (type === 'users') return <Users className={iconClass} />;
  if (type === 'layers') return <Layers className={iconClass} />;
  return <Activity className={iconClass} />;
}

export default function MarketStats() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <div className="w-full h-48 rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  return (
    <div data-cmp="MarketStats" className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <Activity size={18} className="text-violet-500" />
        <h3 className="text-sm font-semibold text-foreground">{t('exchange.marketStats.title')}</h3>
      </div>

      <div className="flex flex-col gap-3">
        {STATS.map((stat) => (
          <div key={stat.labelKey} className={`rounded-2xl p-4 ${styles.statsItem}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.statsIconWrap}`}>
                  <IconComponent type={stat.icon} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{t(`exchange.marketStats.${stat.labelKey}`)}</p>
                  <p className="text-base font-bold text-foreground mt-0.5">{stat.value}</p>
                </div>
              </div>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${stat.positive ? styles.changePositive : styles.changeNegative}`}>
                {stat.positive ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                <span className="text-xs font-semibold">{stat.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
