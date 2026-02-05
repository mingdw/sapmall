import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './ExchangePageDetail.module.scss';

type Timeframe = '1H' | '4H' | '1D' | '1W';
type TradeMode = 'spot' | 'perp';
type Side = 'buy' | 'sell';

const ExchangePageDetail: React.FC = () => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState<Timeframe>('1H');
  const [mode, setMode] = useState<TradeMode>('spot');
  const [side, setSide] = useState<Side>('buy');
  const [price, setPrice] = useState('3.45');
  const [amount, setAmount] = useState('100');

  const pairLabel = useMemo(() => 'SAP/ETH', []);

  const orderbook = useMemo(
    () => ({
      asks: [
        { price: 3.52, amount: 246.6, total: '1.2K' },
        { price: 3.51, amount: 189.3, total: '956' },
        { price: 3.50, amount: 123.7, total: '767' }
      ],
      bids: [
        { price: 3.45, amount: 298.4, total: '1.5K' },
        { price: 3.44, amount: 167.8, total: '1.0K' },
        { price: 3.43, amount: 134.5, total: '1.0K' }
      ]
    }),
    []
  );

  const recentTrades = useMemo(
    () => [
      { price: 3.45, amount: 125.6, time: '14:23:45', side: 'buy' as const },
      { price: 3.42, amount: 89.3, time: '14:23:12', side: 'sell' as const },
      { price: 3.47, amount: 234.8, time: '14:22:58', side: 'buy' as const }
    ],
    []
  );

  const myOrders = useMemo(
    () => [
      { id: 'o1', side: 'buy' as const, price: 3.40, amount: 200, filled: '0%', status: '挂单中' },
      { id: 'o2', side: 'sell' as const, price: 3.60, amount: 120, filled: '35%', status: '部分成交' }
    ],
    []
  );

  return (
    <div className="py-4">
      {/* 顶部：交易对 + 行情摘要 */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button className={styles.pairSelect} type="button">
            <span className={styles.pairDot}>S</span>
            <span className="font-semibold">{pairLabel}</span>
            <i className="fas fa-chevron-down text-xs opacity-80"></i>
          </button>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span className="font-semibold text-green-400">${price}</span>
            <span className="text-green-400">+12.5%</span>
            <span className="text-gray-400">$1.2M</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className={styles.iconBtn} type="button" aria-label={t('common.favorite', { defaultValue: '收藏' })}>
            <i className="fas fa-star"></i>
            <span className="text-sm">{t('common.favorite', { defaultValue: '收藏' })}</span>
          </button>
          <button className={styles.iconBtn} type="button" aria-label={t('common.share', { defaultValue: '分享' })}>
            <i className="fas fa-share-alt"></i>
            <span className="text-sm">{t('common.share', { defaultValue: '分享' })}</span>
          </button>
        </div>
      </div>

      {/* 主体：图表 + 订单簿 + 交易面板 */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* 左侧：图表与最近成交 */}
        <div className="xl:col-span-8 space-y-4">
          <div className={styles.glassCard}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-200">{t('exchange.priceChart', { defaultValue: '价格走势图' })}</div>
              <div className={styles.segment}>
                {(['1H', '4H', '1D', '1W'] as Timeframe[]).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`${styles.segmentBtn} ${timeframe === tf ? styles.active : ''}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.chartBox}>
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <i className="fas fa-chart-line text-2xl mb-2 opacity-70"></i>
                <div className="text-sm font-semibold">{t('exchange.chartLoading', { defaultValue: 'K线图加载中…' })}</div>
                <div className="text-xs opacity-80">{t('exchange.chartHint', { defaultValue: '支持实时价格与深度数据' })}</div>
              </div>
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className="text-sm font-semibold text-gray-200 mb-3">{t('exchange.recentTrades', { defaultValue: '最近交易' })}</div>
            <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
              <div>{t('exchange.colPrice', { defaultValue: '价格' })}</div>
              <div className="text-center">{t('exchange.colAmount', { defaultValue: '数量' })}</div>
              <div className="text-right">{t('exchange.colTime', { defaultValue: '时间' })}</div>
            </div>
            <div className="space-y-2">
              {recentTrades.map((tr, idx) => (
                <div key={idx} className="grid grid-cols-3 text-sm">
                  <div className={tr.side === 'buy' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                    ${tr.price.toFixed(2)}
                  </div>
                  <div className="text-center text-gray-200">{tr.amount.toFixed(1)} SAP</div>
                  <div className="text-right text-gray-400">{tr.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 右侧：订单簿 + 交易面板 */}
        <div className="xl:col-span-4 space-y-4">
          <div className={styles.glassCard}>
            <div className="text-sm font-semibold text-gray-200 mb-3">{t('exchange.orderbook', { defaultValue: '订单簿' })}</div>
            <div className="grid grid-cols-3 text-xs text-gray-400 mb-2">
              <div>{t('exchange.colPrice', { defaultValue: '价格' })}</div>
              <div className="text-center">{t('exchange.colAmount', { defaultValue: '数量' })}</div>
              <div className="text-right">{t('exchange.colTotal', { defaultValue: '累计' })}</div>
            </div>

            <div className="space-y-1">
              {orderbook.asks.map((a, idx) => (
                <div key={`ask-${idx}`} className="grid grid-cols-3 text-sm">
                  <div className="text-red-400 font-semibold">${a.price.toFixed(2)}</div>
                  <div className="text-center text-gray-200">{a.amount.toFixed(1)}</div>
                  <div className="text-right text-gray-400">{a.total}</div>
                </div>
              ))}
              <div className="py-2 text-center">
                <span className="text-green-400 font-semibold">${Number(price).toFixed(2)}</span>
              </div>
              {orderbook.bids.map((b, idx) => (
                <div key={`bid-${idx}`} className="grid grid-cols-3 text-sm">
                  <div className="text-green-400 font-semibold">${b.price.toFixed(2)}</div>
                  <div className="text-center text-gray-200">{b.amount.toFixed(1)}</div>
                  <div className="text-right text-gray-400">{b.total}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.glassCard}>
            <div className="flex items-center justify-between mb-3">
              <div className={styles.tabRow}>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${mode === 'spot' ? styles.active : ''}`}
                  onClick={() => setMode('spot')}
                >
                  {t('exchange.spot', { defaultValue: '现货交易' })}
                </button>
                <button
                  type="button"
                  className={`${styles.tabBtn} ${mode === 'perp' ? styles.active : ''}`}
                  onClick={() => setMode('perp')}
                >
                  {t('exchange.perp', { defaultValue: '合约交易' })}
                </button>
              </div>
            </div>

            <div className={styles.sideRow}>
              <button
                type="button"
                onClick={() => setSide('buy')}
                className={`${styles.sideBtn} ${side === 'buy' ? styles.buy : ''}`}
              >
                {t('exchange.buy', { defaultValue: '买入' })}
              </button>
              <button
                type="button"
                onClick={() => setSide('sell')}
                className={`${styles.sideBtn} ${side === 'sell' ? styles.sell : ''}`}
              >
                {t('exchange.sell', { defaultValue: '卖出' })}
              </button>
            </div>

            <div className="mt-3 space-y-3">
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{t('exchange.price', { defaultValue: '价格 (ETH)' })}</label>
                <input
                  className={styles.fieldInput}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel}>{t('exchange.amount', { defaultValue: '数量 (SAP)' })}</label>
                <div className="relative">
                  <input
                    className={styles.fieldInput}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    inputMode="decimal"
                  />
                  <button type="button" className={styles.maxBtn}>
                    {t('exchange.max', { defaultValue: '全部' })}
                  </button>
                </div>
              </div>

              <div className={styles.quickRow}>
                {(['25%', '50%', '75%', '100%'] as const).map((p) => (
                  <button key={p} type="button" className={styles.quickBtn}>
                    {p}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-gray-400">
                <div className={styles.kvRow}>
                  <span>{t('exchange.fee', { defaultValue: '手续费' })}</span>
                  <span className="text-gray-200">0.35 ETH</span>
                </div>
                <div className={styles.kvRow}>
                  <span>{t('exchange.available', { defaultValue: '可用余额' })}</span>
                  <span className="text-gray-200">1,234.56 SAP</span>
                </div>
              </div>

              <button
                type="button"
                className={`${styles.primaryCta} ${side === 'sell' ? styles.sellCta : ''}`}
              >
                {side === 'buy' ? t('exchange.buySap', { defaultValue: '买入 SAP' }) : t('exchange.sellSap', { defaultValue: '卖出 SAP' })}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 我的订单 */}
      <div className={`${styles.glassCard} mt-4`}>
        <div className="text-sm font-semibold text-gray-200 mb-3">{t('exchange.myOrders', { defaultValue: '我的订单' })}</div>
        <div className="grid grid-cols-5 text-xs text-gray-400 mb-2">
          <div>{t('exchange.colSide', { defaultValue: '方向' })}</div>
          <div>{t('exchange.colPrice', { defaultValue: '价格' })}</div>
          <div className="text-center">{t('exchange.colAmount', { defaultValue: '数量' })}</div>
          <div className="text-center">{t('exchange.colFilled', { defaultValue: '成交' })}</div>
          <div className="text-right">{t('exchange.colStatus', { defaultValue: '状态' })}</div>
        </div>
        <div className="space-y-2">
          {myOrders.map((o) => (
            <div key={o.id} className="grid grid-cols-5 text-sm items-center">
              <div className={o.side === 'buy' ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                {o.side === 'buy' ? t('exchange.buy', { defaultValue: '买入' }) : t('exchange.sell', { defaultValue: '卖出' })}
              </div>
              <div className="text-gray-200">${o.price.toFixed(2)}</div>
              <div className="text-center text-gray-200">{o.amount} SAP</div>
              <div className="text-center text-gray-400">{o.filled}</div>
              <div className="text-right text-gray-400">{o.status}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExchangePageDetail;
