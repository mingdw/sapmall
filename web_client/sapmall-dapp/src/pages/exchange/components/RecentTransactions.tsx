import { ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TokenIcon from './TokenIcon';
import styles from '../ExchangePageDetail.module.scss';

const TX_LIST = [
  { from: 'USDT', to: 'SAP', fromAmt: '500', toAmt: '1425.00', addr: '0xA1b2...3c4D', timeKey: 'time2m' as const },
  { from: 'USDC', to: 'SAP', fromAmt: '1200', toAmt: '3408.00', addr: '0xE5f6...7a8B', timeKey: 'time8m' as const },
  { from: 'DAI', to: 'SAP', fromAmt: '300', toAmt: '846.00', addr: '0x9C0d...1e2F', timeKey: 'time15m' as const },
  { from: 'BUSD', to: 'SAP', fromAmt: '2500', toAmt: '7075.00', addr: '0x3G4h...5I6J', timeKey: 'time23m' as const },
];

export default function RecentTransactions() {
  const { t, ready } = useTranslation();

  if (!ready) {
    return <div className="w-full h-64 rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  return (
    <div data-cmp="RecentTransactions" className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-foreground">{t('exchange.recentTx.title')}</h3>
        <button type="button" className={`flex items-center gap-1 text-xs ${styles.linkPurple}`}>
          {t('exchange.recentTx.viewAll')}
          <ExternalLink size={11} />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {TX_LIST.map((tx, i) => (
          <div key={i} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${styles.txCard}`}>
            <div className="flex items-center -space-x-2">
              <TokenIcon symbol={tx.from} size={28} />
              <TokenIcon symbol={tx.to} size={28} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-foreground">{tx.fromAmt} {tx.from}</span>
                <ArrowRight size={10} className={styles.iconMuted} />
                <span className={`text-xs font-semibold ${styles.accentCyan}`}>{tx.toAmt} SAP</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{tx.addr}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{t(`exchange.recentTx.${tx.timeKey}`)}</p>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                <div className={`w-1.5 h-1.5 rounded-full ${styles.statusDot}`} />
                <span className={`text-xs ${styles.accentGreen}`}>{t('exchange.recentTx.success')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
