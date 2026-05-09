import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, ChevronDown, Settings, RefreshCw, Info, Zap, Shield } from 'lucide-react';
import TokenIcon from './TokenIcon';
import styles from '../ExchangePageDetail.module.scss';

const SUPPORTED_TOKENS = ['USDT', 'USDC', 'BUSD', 'DAI', 'BNB', 'SOL'];
const RATES: Record<string, number> = {
  USDT: 2.85,
  USDC: 2.84,
  BUSD: 2.83,
  DAI: 2.82,
  BNB: 1680,
  SOL: 420,
};

interface SwapCardProps {
  onSwapSuccess?: (amount: string) => void;
  disabled?: boolean;
  /** 未传时由组件内 i18n 默认文案填充 */
  disabledReason?: string;
}

export default function SwapCard({
  onSwapSuccess = () => {},
  disabled = false,
  disabledReason,
}: SwapCardProps) {
  const { t, ready } = useTranslation();
  const resolvedReason = disabledReason ?? t('exchange.swap.disabledReason');
  const [fromToken, setFromToken] = useState('USDT');
  const [fromAmount, setFromAmount] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapDone, setSwapDone] = useState(false);

  const rate = RATES[fromToken] || 2.85;
  const toAmount = fromAmount ? (parseFloat(fromAmount) * rate).toFixed(4) : '';
  const priceImpact = fromAmount ? Math.min(parseFloat(fromAmount) * 0.0012, 2.5).toFixed(2) : '0.00';
  const fee = fromAmount ? (parseFloat(fromAmount) * 0.003).toFixed(4) : '0.0000';

  const handleSwap = useCallback(() => {
    if (disabled) return;
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;
    setIsSwapping(true);
    setTimeout(() => {
      setIsSwapping(false);
      setSwapDone(true);
      onSwapSuccess(toAmount);
      setTimeout(() => setSwapDone(false), 3000);
    }, 2000);
  }, [disabled, fromAmount, onSwapSuccess, toAmount]);

  if (!ready) {
    return <div className="relative w-full max-w-[520px] h-40 rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  return (
    <div data-cmp="SwapCard" className="relative w-full max-w-[520px]">
      <div className={`absolute inset-0 rounded-3xl pointer-events-none ${styles.swapOuterGlow}`} />

      <div className={`relative rounded-3xl p-6 ${styles.swapMainCard}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">{t('exchange.swap.title')}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('exchange.swap.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,77,255,0.15)', border: '1px solid rgba(124,77,255,0.2)' }}
              onClick={() => { setFromAmount(''); setSwapDone(false); }}
            >
              <RefreshCw size={14} style={{ color: '#b39ddb' }} />
            </button>
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: showSettings ? 'rgba(124,77,255,0.3)' : 'rgba(124,77,255,0.15)' }}
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={14} style={{ color: '#b39ddb' }} />
            </button>
          </div>
        </div>

        <div
          className="rounded-2xl p-4 mb-4 overflow-hidden transition-all duration-300"
          style={{
            maxHeight: showSettings ? '120px' : '0px',
            opacity: showSettings ? 1 : 0,
            padding: showSettings ? '1rem' : '0',
            background: 'rgba(124,77,255,0.08)',
            border: showSettings ? '1px solid rgba(124,77,255,0.2)' : '1px solid transparent',
            marginBottom: showSettings ? '1rem' : '0',
          }}
        >
          <p className="text-xs text-muted-foreground mb-3">{t('exchange.swap.slippage')}</p>
          <div className="flex items-center gap-2">
            {['0.1', '0.5', '1.0'].map((val) => (
              <button
                key={val}
                onClick={() => setSlippage(val)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background: slippage === val ? 'linear-gradient(135deg, #7c4dff, #448aff)' : 'rgba(255,255,255,0.06)',
                  color: slippage === val ? '#fff' : '#7986cb',
                }}
              >
                {val}%
              </button>
            ))}
            <div className="flex items-center gap-1 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,77,255,0.15)' }}>
              <input
                className="w-12 text-xs bg-transparent outline-none text-foreground"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                placeholder={t('exchange.swap.customSlippage')}
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-1" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,77,255,0.15)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">{t('exchange.swap.pay')}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{t('exchange.swap.balance')}: <span style={{ color: '#b39ddb' }}>12,500.00</span></span>
              <button className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: 'rgba(124,77,255,0.2)', color: '#00e5ff' }} onClick={() => setFromAmount('12500')} disabled={disabled}>{t('exchange.swap.max')}</button>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{ background: 'rgba(124,77,255,0.15)', border: '1px solid rgba(124,77,255,0.3)', minWidth: '120px' }}
                onClick={() => setShowFromDropdown(!showFromDropdown)}
                disabled={disabled}
              >
                <TokenIcon symbol={fromToken} size={26} />
                <span className="text-sm font-semibold text-foreground">{fromToken}</span>
                <ChevronDown size={14} style={{ color: '#7986cb', transform: showFromDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
              </button>

              <div
                className="absolute top-12 left-0 w-48 rounded-2xl z-50 overflow-hidden"
                style={{
                  display: showFromDropdown ? 'block' : 'none',
                  background: 'rgba(14,12,40,0.98)',
                  border: '1px solid rgba(124,77,255,0.3)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-3 py-2">{t('exchange.swap.selectPayToken')}</p>
                  {SUPPORTED_TOKENS.map((coin) => (
                    <button
                      key={coin}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
                      style={{ background: fromToken === coin ? 'rgba(124,77,255,0.2)' : 'transparent' }}
                      onClick={() => { setFromToken(coin); setShowFromDropdown(false); }}
                    >
                      <TokenIcon symbol={coin} size={28} />
                      <div className="text-left">
                        <p className="text-sm font-semibold text-foreground">{coin}</p>
                        <p className="text-xs text-muted-foreground">{coin === 'BNB' || coin === 'SOL' ? t('exchange.swap.tokenTypeMajor') : t('exchange.swap.tokenTypeStable')}</p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="text-xs" style={{ color: '#69f0ae' }}>≈$1.00</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <input
              type="number"
              className="flex-1 bg-transparent outline-none text-right text-2xl font-bold text-foreground placeholder:text-gray-500"
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              disabled={disabled}
            />
          </div>
        </div>

        <div className="flex justify-center my-2 relative z-10">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(124,77,255,0.4), rgba(0,229,255,0.3))', border: '1px solid rgba(124,77,255,0.5)' }}>
            <ArrowUpDown size={16} style={{ color: '#00e5ff' }} />
          </div>
        </div>

        <div className="rounded-2xl p-4 mb-5" style={{ background: 'rgba(124,77,255,0.06)', border: '1px solid rgba(124,77,255,0.2)' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">{t('exchange.swap.receive')}</span>
            <span className="text-xs text-muted-foreground">{t('exchange.swap.balance')}: <span style={{ color: '#b39ddb' }}>8,432.50</span></span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(124,77,255,0.2)', border: '1px solid rgba(124,77,255,0.4)', minWidth: '120px' }}>
              <TokenIcon symbol="SAP" size={26} />
              <span className="text-sm font-bold" style={{ color: '#00e5ff' }}>SAP</span>
            </div>
            <div className="flex-1 text-right">
              <p className="text-2xl font-bold" style={{ background: 'linear-gradient(135deg, #7c4dff, #00e5ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {toAmount || '0.0000'}
              </p>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1.5">
              <Zap size={12} style={{ color: '#ffd740' }} />
              <span className="text-xs" style={{ color: '#ffd740' }}>{t('exchange.swap.rateLine', { from: fromToken, rate })}</span>
            </div>
            <span className="text-xs text-muted-foreground">≈ ${toAmount ? (parseFloat(toAmount) * 0.351).toFixed(2) : '0.00'}</span>
          </div>
        </div>

        <div className="rounded-xl p-3 mb-5 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,77,255,0.1)' }}>
          {[
            { label: t('exchange.swap.priceImpact'), value: `${priceImpact}%`, color: parseFloat(priceImpact) > 1 ? '#ff4081' : '#69f0ae' },
            { label: t('exchange.swap.feeLabel', { percent: '0.3' }), value: `${fee} ${fromToken}`, color: '#b39ddb' },
            { label: t('exchange.swap.slippageTolerance'), value: `${slippage}%`, color: '#b39ddb' },
            { label: t('exchange.swap.eta'), value: t('exchange.swap.etaValue'), color: '#b39ddb' },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Info size={11} style={{ color: '#7986cb' }} />
                <span className="text-xs text-muted-foreground">{row.label}</span>
              </div>
              <span className="text-xs font-medium" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        <button
          className="w-full h-14 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden"
          style={{
            background: swapDone
              ? 'linear-gradient(135deg, #69f0ae, #00e5ff)'
              : isSwapping
                ? 'rgba(124,77,255,0.4)'
                : 'linear-gradient(135deg, #7c4dff 0%, #448aff 50%, #00e5ff 100%)',
            color: '#fff',
            cursor: disabled || !fromAmount || parseFloat(fromAmount) <= 0 ? 'not-allowed' : 'pointer',
            opacity: disabled || !fromAmount || parseFloat(fromAmount) <= 0 ? 0.5 : 1,
          }}
          onClick={handleSwap}
          disabled={disabled || !fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
        >
          <div className="relative flex items-center justify-center gap-2">
            <span>
              {disabled
                ? t('exchange.swap.connectWalletBtn')
                : swapDone
                  ? t('exchange.swap.swapSuccessBtn')
                  : isSwapping
                    ? t('exchange.swap.swapping')
                    : !fromAmount || parseFloat(fromAmount) <= 0
                      ? t('exchange.swap.enterAmount')
                      : t('exchange.swap.swapNow')}
            </span>
          </div>
        </button>

        {disabled ? (
          <p className="text-xs text-center mt-3" style={{ color: '#ffb74d' }}>
            {resolvedReason}
          </p>
        ) : null}

        <div className="flex items-center justify-center gap-2 mt-4">
          <Shield size={12} style={{ color: '#7986cb' }} />
          <span className="text-xs text-muted-foreground">{t('exchange.swap.securityNote')}</span>
        </div>
      </div>
    </div>
  );
}
