import React from 'react';
import type { KpiMetric, KpiPeriod } from '../types';
import styles from '../StoreOverview.module.scss';

interface KpiSectionProps {
  period: KpiPeriod;
  metrics: KpiMetric[];
  onPeriodChange: (period: KpiPeriod) => void;
}

const PERIODS: { key: KpiPeriod; label: string }[] = [
  { key: 'today', label: '今日' },
  { key: 'week', label: '本周' },
  { key: 'month', label: '本月' },
];

/** 对齐交易记录统计卡的配色 */
const VARIANT_STYLE: Record<
  KpiMetric['variant'],
  { color: string; bg: string }
> = {
  primary: { color: '#38bdf8', bg: 'rgba(56,189,248,0.12)' },
  success: { color: '#34d399', bg: 'rgba(52,211,153,0.12)' },
  purple: { color: '#a78bfa', bg: 'rgba(167,139,250,0.12)' },
  orange: { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)' },
};

const KpiSection: React.FC<KpiSectionProps> = ({ period, metrics, onPeriodChange }) => {
  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionLabel}>核心数据</h3>
        <div className={styles.periodTabs}>
          {PERIODS.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`${styles.periodBtn} ${period === item.key ? styles.periodActive : ''}`}
              onClick={() => onPeriodChange(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.kpiGrid} key={period}>
        {metrics.map((m) => {
          const tone = VARIANT_STYLE[m.variant];
          return (
            <div key={m.key} className={styles.statsCard}>
              <div className={styles.statsCardHead}>
                <div
                  className={styles.statsCardIcon}
                  style={{ background: tone.bg, color: tone.color }}
                >
                  <i className={m.icon.startsWith('fa') ? m.icon : `fas fa-${m.icon}`} />
                </div>
                <span className={styles.statsCardLabel}>{m.label}</span>
              </div>
              <div className={styles.statsCardValueRow}>
                <span className={styles.statsCardValue}>
                  {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
                </span>
                <span className={`${styles.statsCardTrend} ${styles[`trend_${m.trend.type}`]}`}>
                  {m.trend.value}
                </span>
              </div>
              {m.sub ? <div className={styles.statsCardHint}>{m.sub}</div> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default KpiSection;
