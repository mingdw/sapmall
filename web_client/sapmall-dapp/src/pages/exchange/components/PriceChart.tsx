import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useState } from 'react';
import styles from '../ExchangePageDetail.module.scss';

const DATA_7D = [
  { time: '6/26', price: 0.298 }, { time: '6/27', price: 0.312 }, { time: '6/28', price: 0.305 },
  { time: '6/29', price: 0.321 }, { time: '6/30', price: 0.338 }, { time: '7/1', price: 0.344 },
  { time: '7/2', price: 0.351 },
];

const DATA_30D = [
  { time: '6/3', price: 0.220 }, { time: '6/7', price: 0.245 }, { time: '6/11', price: 0.238 },
  { time: '6/15', price: 0.262 }, { time: '6/19', price: 0.275 }, { time: '6/23', price: 0.290 },
  { time: '6/26', price: 0.298 }, { time: '6/30', price: 0.338 }, { time: '7/2', price: 0.351 },
];

const PERIODS = ['24H', '7D', '30D'];

const CustomTooltip = ({ active = false, payload = [] as any[], label = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-xl px-3 py-2 ${styles.chartTooltip}`}>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={`text-sm font-bold ${styles.accentCyan}`}>${payload[0].value.toFixed(4)}</p>
      </div>
    );
  }
  return null;
};

export default function PriceChart() {
  const [period, setPeriod] = useState('7D');
  const data = period === '30D' ? DATA_30D : DATA_7D;

  return (
    <div data-cmp="PriceChart" className="w-full">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground mb-1">SAP / USD</p>
          <div className="flex items-end gap-2">
            <span className="text-2xl font-bold text-foreground">$0.3510</span>
            <span className={`text-sm font-semibold pb-0.5 ${styles.accentGreen}`}>+5.82%</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium ${period === p ? styles.periodBtnActive : styles.periodBtn}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="sapGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c4dff" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#7c4dff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sapLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7c4dff" />
                <stop offset="100%" stopColor="#00e5ff" />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" tick={{ fill: '#7986cb', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={['auto', 'auto']} tick={{ fill: '#7986cb', fontSize: 10 }} axisLine={false} tickLine={false} width={45} tickFormatter={(v) => `$${v.toFixed(2)}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="price" stroke="url(#sapLine)" strokeWidth={2} fill="url(#sapGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
