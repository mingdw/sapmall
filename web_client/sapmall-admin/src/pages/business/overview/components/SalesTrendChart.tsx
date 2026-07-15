import React, { useMemo, useState } from 'react';
import type { TrendMetric, TrendPoint } from '../types';
import styles from '../StoreOverview.module.scss';

interface SalesTrendChartProps {
  points: TrendPoint[];
}

const WIDTH = 640;
const HEIGHT = 200;
const PAD = { top: 14, right: 12, bottom: 28, left: 40 };

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ points }) => {
  const [metric, setMetric] = useState<TrendMetric>('sales');

  const { linePath, areaPath, labels, maxValue, coords } = useMemo(() => {
    if (!points.length) {
      return {
        linePath: '',
        areaPath: '',
        labels: [] as string[],
        maxValue: 0,
        coords: [] as { x: number; y: number }[],
      };
    }

    const values = points.map((p) => (metric === 'sales' ? p.sales : p.orders));
    const max = Math.max(...values, 1);
    const innerW = WIDTH - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;

    const nextCoords = values.map((v, i) => {
      const x = PAD.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
      const y = PAD.top + innerH - (v / max) * innerH;
      return { x, y };
    });

    const line = nextCoords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(1)} ${c.y.toFixed(1)}`)
      .join(' ');
    const area = `${line} L ${nextCoords[nextCoords.length - 1].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} L ${nextCoords[0].x.toFixed(1)} ${(PAD.top + innerH).toFixed(1)} Z`;

    return {
      linePath: line,
      areaPath: area,
      labels: points.map((p) => p.label),
      maxValue: max,
      coords: nextCoords,
    };
  }, [points, metric]);

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionLabel}>经营趋势</h3>
        <div className={styles.periodTabs}>
          <button
            type="button"
            className={`${styles.periodBtn} ${metric === 'sales' ? styles.periodActive : ''}`}
            onClick={() => setMetric('sales')}
          >
            销售额
          </button>
          <button
            type="button"
            className={`${styles.periodBtn} ${metric === 'orders' ? styles.periodActive : ''}`}
            onClick={() => setMetric('orders')}
          >
            订单数
          </button>
        </div>
      </div>

      <div className={styles.chartWrap}>
        <svg
          className={styles.trendSvg}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-label={metric === 'sales' ? '销售额趋势' : '订单数趋势'}
        >
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.28)" />
              <stop offset="100%" stopColor="rgba(59, 130, 246, 0.02)" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = PAD.top + (HEIGHT - PAD.top - PAD.bottom) * (1 - ratio);
            return (
              <g key={ratio}>
                <line
                  x1={PAD.left}
                  x2={WIDTH - PAD.right}
                  y1={y}
                  y2={y}
                  stroke="rgba(51, 65, 85, 0.45)"
                  strokeDasharray="3 4"
                />
                <text x={PAD.left - 6} y={y + 3} textAnchor="end" className={styles.chartAxisText}>
                  {Math.round(maxValue * ratio).toLocaleString()}
                </text>
              </g>
            );
          })}

          {areaPath ? <path d={areaPath} fill="url(#trendFill)" /> : null}
          {linePath ? (
            <path
              d={linePath}
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ) : null}

          {coords.map((c, i) => (
            <circle key={i} cx={c.x} cy={c.y} r="3" fill="#0f172a" stroke="#60a5fa" strokeWidth="1.5" />
          ))}

          {labels.map((label, i) => {
            const x =
              PAD.left +
              (labels.length === 1
                ? (WIDTH - PAD.left - PAD.right) / 2
                : (i / (labels.length - 1)) * (WIDTH - PAD.left - PAD.right));
            return (
              <text key={`${label}-${i}`} x={x} y={HEIGHT - 8} textAnchor="middle" className={styles.chartAxisText}>
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
};

export default SalesTrendChart;
