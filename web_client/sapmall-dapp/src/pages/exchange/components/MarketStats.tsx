import { useTranslation } from 'react-i18next';
import { TrendingUp } from 'lucide-react';
import styles from '../ExchangePageDetail.module.scss';
import TokenIcon from './TokenIcon';
import { useSapExchangeRemaining } from '../hooks/useSapExchangeRemaining';
import { useSwapTokenStats } from '../hooks/useSwapTokenStats';

/** 紧凑数字格式：>=1K 用 K/M/B 缩写，始终保留 2 位小数 */
function formatCompact(val: string): string {
  const n = parseFloat(val);
  if (isNaN(n)) return '--';
  const abs = Math.abs(n);
  if (abs >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (n / 1e3).toFixed(2) + 'K';
  return n.toFixed(2);
}

export default function MarketStats() {
  const { t, ready } = useTranslation();

  const { remaining, totalCap, swapped, usedPercent, isLoading: statsLoading } = useSapExchangeRemaining();
  const { tokenStats, isLoading: tokenStatsLoading } = useSwapTokenStats();

  if (!ready) {
    return <div className="w-full h-48 rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  const swappedSAPNum = parseFloat(swapped);
  const remainingSAPNum = parseFloat(remaining);

  // 百分比 = 已兑换 / 未兑换 × 100（已兑换占未兑换的比值）
  const ratioPercent = remainingSAPNum > 0
    ? (swappedSAPNum / remainingSAPNum) * 100
    : 0;

  const swappedDisplay = statsLoading ? '--' : formatCompact(swapped);
  const totalCapDisplay = statsLoading ? '--' : formatCompact(totalCap);

  return (
    <div data-cmp="MarketStats" className="w-full">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={18} className="text-violet-500" />
        <h3 className="text-sm font-semibold text-foreground">
          {t('exchange.marketStats.title', { defaultValue: '市场数据' })}
        </h3>
      </div>

      {/* 按代币展示已兑换数量（含合约读取的已兑 SAP 总额） */}
      <div className="flex flex-col gap-3">
        <div className={`rounded-2xl p-4 ${styles.statsItem}`}>
          <div className="flex items-center gap-3">
            <TokenIcon symbol="SAP" size={32} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">
                {t('exchange.marketStats.swappedSap', {
                  defaultValue: '已兑SAP总额',
                })}
              </p>
              <p className="text-base font-bold text-foreground mt-0.5 truncate">
                {statsLoading ? '...' : `${formatCompact(swapped)} SAP`}
              </p>
            </div>
          </div>
        </div>

        {tokenStats.map((stat, i) => (
          <div key={`token-${i}`} className={`rounded-2xl p-4 ${styles.statsItem}`}>
            <div className="flex items-center gap-3">
              <TokenIcon symbol={stat.symbol} size={32} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">
                  {t('exchange.marketStats.swappedToken', {
                    defaultValue: '已兑{{symbol}}',
                    symbol: stat.symbol,
                  })}
                </p>
                <p className="text-base font-bold text-foreground mt-0.5 truncate">
                  {tokenStatsLoading ? '...' : `${formatCompact(stat.amount)} ${stat.symbol}`}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 进度条区域 */}
      <div className="mt-4">
        {/* 双色进度条：已兑换 vs 未兑换，百分比内嵌在进度条比例位置 */}
        <div className={styles.progressTrackDual}>
          <div
            className={styles.progressFillSwapped}
            style={{ width: `${Math.min(usedPercent, 100)}%` }}
          />
          <div
            className={styles.progressFillRemaining}
            style={{ width: `${Math.max(100 - usedPercent, 0)}%` }}
          />
          {/* 百分比标签：定位在已兑换与未兑换的分界处 */}
          <span
            className={styles.progressPercentLabel}
            style={{
              left: `${Math.min(Math.max(usedPercent, 8), 92)}%`,
            }}
          >
            {ratioPercent.toFixed(2)}%
          </span>
        </div>

        {/* 进度条下方：总共 xx SAP，已兑换 xx（不同颜色区分） */}
        <div className="flex items-center gap-2 mt-2.5">
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${styles.dotSwapped}`} />
            <span className="text-xs text-muted-foreground">
              {t('exchange.marketStats.totalLabel', { defaultValue: '总共' })}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#b39ddb' }}>
              {totalCapDisplay} SAP
            </span>
            <span className="text-xs text-muted-foreground">
              {t('exchange.marketStats.swappedLabel', { defaultValue: '，已兑换' })}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#00e5ff' }}>
              {swappedDisplay}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
