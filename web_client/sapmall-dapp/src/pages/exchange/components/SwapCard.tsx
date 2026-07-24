import { useState, useCallback, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useReadContract } from 'wagmi';
import { erc20Abi, formatUnits } from 'viem';
import { ArrowDown, ArrowUp, ChevronDown, Settings, RefreshCw, Info, Shield } from 'lucide-react';
import TokenIcon from './TokenIcon';
import SwapSuccessFlash from './SwapSuccessFlash';
import styles from '../ExchangePageDetail.module.scss';
import { useChainConfigStore } from '../../../store/chainConfigStore';
import { buildWalletUiNetworks, resolveCurrentWalletNetwork } from '../../../config/walletUiNetworks';
import { useSwapQuote } from '../hooks/useSwapQuote';
import { useExchangeTokenBalance } from '../hooks/useExchangeTokenBalance';
import { useSwapExecution } from '../hooks/useSwapExecution';
import { useSwapRouterAddress } from '../hooks/useSwapRouterAddress';
import { useExchangeTokenConfig } from '../hooks/useExchangeTokenConfig';

interface SwapCardProps {
  onSwapSuccess?: (amount: string) => void;
  disabled?: boolean;
  disabledReason?: string;
  /** 当前选中的支付代币符号，由父组件统一管理 */
  fromToken: string;
  /** 切换支付代币时的回调 */
  onFromTokenChange: (token: string) => void;
}

export default function SwapCard({
  onSwapSuccess = () => {},
  disabled = false,
  disabledReason,
  fromToken,
  onFromTokenChange,
}: SwapCardProps) {
  const { t, ready } = useTranslation();
  const { address, chainId, isConnected } = useAccount();
  const store = useChainConfigStore();

  // 与导航栏网络切换展示同一套链名称
  const currentChainName = useMemo(() => {
    const networks = buildWalletUiNetworks((key) => t(key));
    return resolveCurrentWalletNetwork(chainId, networks).name;
  }, [chainId, t, store.loaded, store.chains]);

  // 从链配置获取当前链支持的支付代币（排除 SAP）
  const availableTokens = useMemo(() => {
    if (!chainId) return [];
    const tokens = store.getPaymentTokens(chainId);
    return tokens
      .filter((token) => token.symbol.toUpperCase() !== 'SAP')
      .map((token) => token.symbol);
  }, [chainId, store]);

  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [activeField, setActiveField] = useState<'from' | 'to'>('from');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);

  // ── 独立汇率查询（固定 1 单位，始终可用，不依赖 fromAmount）──
  const { rate: baseRate } = useSwapQuote({
    tokenSymbol: fromToken,
    amountIn: '1',
  });

  // ── 实际报价查询（以 fromAmount 为输入，返回精确 amountOut + fee）──
  const { amountOut, fee, isLoading: quoteLoading, isError: quoteError } = useSwapQuote({
    tokenSymbol: fromToken,
    amountIn: fromAmount,
  });

  const { formattedBalance, isLoading: balanceLoading } = useExchangeTokenBalance(fromToken);

  // ── 读取用户 SAP 代币余额（展示在获得卡片右上角） ──
  const sapTokenConfig = useExchangeTokenConfig('SAP');
  const { data: sapBalanceRaw, isLoading: sapBalanceLoading } = useReadContract({
    address: sapTokenConfig?.address,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address && sapTokenConfig ? [address] : undefined,
    query: {
      enabled: !!address && !!sapTokenConfig,
      refetchInterval: 30_000,
    },
    chainId,
  });
  const sapFormattedBalance = sapBalanceRaw && sapTokenConfig
    ? Number(formatUnits(sapBalanceRaw, sapTokenConfig.decimals)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00';

  // ── 预获取 allowance，避免 execute 时阻塞 RPC 调用 ──
  const routerAddress = useSwapRouterAddress();
  const tokenConfig = useExchangeTokenConfig(fromToken);
  const { data: prefetchedAllowance } = useReadContract({
    address: tokenConfig?.address,
    abi: erc20Abi,
    functionName: 'allowance',
    args: address && tokenConfig ? [address, routerAddress!] : undefined,
    query: {
      enabled: !!address && !!tokenConfig && !!routerAddress,
      refetchInterval: 45_000,
    },
    chainId,
  });

  const { phase, error: swapError, execute, reset } = useSwapExecution({
    tokenSymbol: fromToken,
    amountIn: fromAmount,
    slippagePercent: parseFloat(slippage) || 0.5,
    quotedAmountOut: amountOut || undefined,
    prefetchedAllowance: prefetchedAllowance ?? undefined,
  });

  // ── 双向绑定：from → to ──
  // 用户编辑支付金额时，优先用链上精确报价；若报价未返回则用 baseRate 即时计算
  useEffect(() => {
    if (activeField !== 'from') return;
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('');
      return;
    }
    if (amountOut) {
      setToAmount(amountOut);
    } else if (baseRate > 0) {
      const parsed = parseFloat(fromAmount);
      if (!isNaN(parsed) && parsed > 0) {
        setToAmount((parsed * baseRate).toFixed(6));
      }
    }
  }, [activeField, fromAmount, amountOut, baseRate]);

  // ── 双向绑定：to → from ──
  // 用户编辑获得金额时，用 baseRate 反推支付金额
  const handleToAmountChange = useCallback((value: string) => {
    setActiveField('to');
    setToAmount(value);
    if (!value || parseFloat(value) <= 0) {
      setFromAmount('');
      return;
    }
    if (baseRate > 0) {
      const parsed = parseFloat(value);
      if (!isNaN(parsed) && parsed > 0) {
        setFromAmount((parsed / baseRate).toFixed(6));
      } else {
        setFromAmount('');
      }
    }
  }, [baseRate]);

  const handleFromAmountChange = useCallback((value: string) => {
    setActiveField('from');
    setFromAmount(value);
  }, []);

  const isSwapping = phase === 'approving' || phase === 'swapping' || phase === 'confirming';
  const swapDone = phase === 'success';
  const hasError = phase === 'error';

  const priceImpact = fromAmount ? Math.min(parseFloat(fromAmount) * 0.0012, 2.5).toFixed(2) : '0.00';

  // 兑换成功：展示成功闪现约 3s，再还原为可继续兑换的 CTA
  useEffect(() => {
    if (!swapDone) return;
    if (amountOut) onSwapSuccess(amountOut);
    const timer = setTimeout(() => {
      reset();
      setFromAmount('');
      setToAmount('');
    }, 3000);
    return () => clearTimeout(timer);
  }, [swapDone, amountOut, onSwapSuccess, reset]);

  const handleSwap = useCallback(() => {
    if (disabled || !fromAmount || parseFloat(fromAmount) <= 0) return;
    execute();
  }, [disabled, fromAmount, execute]);

  const phaseLabel = useMemo(() => {
    if (phase === 'approving') return t('exchange.swap.approving', { defaultValue: '授权中...' });
    if (phase === 'swapping') return t('exchange.swap.swapping');
    if (phase === 'confirming') return t('exchange.swap.confirming', { defaultValue: '确认中...' });
    return '';
  }, [phase, t]);

  if (!ready) {
    return <div className="relative w-full max-w-[520px] h-40 rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  // 无可用代币提示
  if (isConnected && availableTokens.length === 0) {
    return (
      <div data-cmp="SwapCard" className="relative w-full max-w-[520px]">
        <div className={`relative rounded-3xl p-6 ${styles.swapMainCard}`}>
          <p className="text-sm text-center text-muted-foreground py-8">
            {t('exchange.swap.noTokensAvailable', { defaultValue: '当前链暂无可兑换代币' })}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div data-cmp="SwapCard" className="relative w-full max-w-[520px]">
      <div className={`absolute inset-0 rounded-3xl pointer-events-none ${styles.swapOuterGlow}`} />

      <div className={`relative rounded-3xl p-6 ${styles.swapMainCard}`}>
        {/* 标题栏：展示与导航栏一致的当前链名称 */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-foreground">{currentChainName}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">{t('exchange.swap.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,77,255,0.15)', border: '1px solid rgba(124,77,255,0.2)' }}
              onClick={() => { setFromAmount(''); setToAmount(''); reset(); }}
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

        {/* 滑点设置 */}
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

        {/* ── 兑换区域：支付 + 箭头 + 获得 ── */}
        <div className={styles.swapFieldsWrap}>
          {/* 支付区 */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,77,255,0.15)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{t('exchange.swap.pay')}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {t('exchange.swap.balance')}:{' '}
                  <span style={{ color: '#b39ddb' }}>
                    {balanceLoading ? '...' : formattedBalance}
                  </span>
                </span>
                <button
                  className="text-xs px-2 py-0.5 rounded-md font-medium"
                  style={{ background: 'rgba(124,77,255,0.2)', color: '#00e5ff' }}
                  onClick={() => {
                    const bal = formattedBalance !== '0.00' ? formattedBalance : '';
                    handleFromAmountChange(bal);
                  }}
                  disabled={disabled}
                >
                  {t('exchange.swap.max')}
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* 代币选择按钮 */}
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
                    {availableTokens.map((coin) => (
                      <button
                        key={coin}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl"
                        style={{ background: fromToken === coin ? 'rgba(124,77,255,0.2)' : 'transparent' }}
                        onClick={() => { onFromTokenChange(coin); setShowFromDropdown(false); }}
                      >
                        <TokenIcon symbol={coin} size={28} />
                        <div className="text-left">
                          <p className="text-sm font-semibold text-foreground">{coin}</p>
                          <p className="text-xs text-muted-foreground">{t('exchange.swap.tokenTypeStable')}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 支付金额输入框 */}
              <input
                type="number"
                className={`flex-1 bg-transparent outline-none text-right text-2xl font-bold text-foreground placeholder:text-gray-500 ${styles.noSpinner}`}
                placeholder="0.00"
                value={fromAmount}
                onChange={(e) => handleFromAmountChange(e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>

          {/* ── 箭头保持左侧原位；汇率同行水平居中 ── */}
          <div className={styles.swapArrowRow}>
            <div className={styles.swapArrowBadge}>
              <ArrowDown size={20} className={styles.arrowActive} />
              <ArrowUp size={20} className={styles.arrowDisabled} />
            </div>
            <span className={styles.swapRateInline}>
              {baseRate > 0
                ? t('exchange.swap.rateLine', { from: fromToken, rate: baseRate.toFixed(4) })
                : t('exchange.swap.rateLine', { from: fromToken, rate: '--' })}
            </span>
            {quoteError ? (
              <span className={styles.swapRateError}>
                {t('exchange.swap.quoteError', { defaultValue: '报价获取失败' })}
              </span>
            ) : null}
          </div>

          {/* 获得区 */}
          <div className="rounded-2xl p-4" style={{ background: 'rgba(124,77,255,0.06)', border: '1px solid rgba(124,77,255,0.2)' }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground">{t('exchange.swap.receive')}</span>
              <span className="text-xs text-muted-foreground">
                {t('exchange.swap.balance')}:{' '}
                <span style={{ color: '#b39ddb' }}>
                  {sapBalanceLoading ? '...' : sapFormattedBalance}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              {/* SAP 代币按钮（固定，不可选择） */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: 'rgba(124,77,255,0.2)', border: '1px solid rgba(124,77,255,0.4)', minWidth: '120px' }}>
                <TokenIcon symbol="SAP" size={26} />
                <span className="text-sm font-bold" style={{ color: '#00e5ff' }}>SAP</span>
              </div>

              {/* 获得金额输入框（双向绑定） */}
              <input
                type="number"
                className={`flex-1 bg-transparent outline-none text-right text-2xl font-bold text-foreground placeholder:text-gray-500 ${styles.noSpinner}`}
                placeholder="0.0000"
                value={toAmount}
                onChange={(e) => handleToAmountChange(e.target.value)}
                disabled={disabled}
              />
            </div>
          </div>
        </div>

        {/* 交易详情 */}
        <div className="rounded-xl p-3 mb-5 space-y-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(124,77,255,0.1)' }}>
          {[
            { label: t('exchange.swap.priceImpact'), value: `${priceImpact}%`, color: parseFloat(priceImpact) > 1 ? '#ff4081' : '#69f0ae' },
            { label: t('exchange.swap.feeLabel', { percent: '0.3' }), value: fee ? `${fee} ${fromToken}` : '--', color: '#b39ddb' },
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

        {/* 错误提示 */}
        {hasError && swapError ? (
          <div className="rounded-xl p-3 mb-4" style={{ background: 'rgba(255,64,129,0.1)', border: '1px solid rgba(255,64,129,0.3)' }}>
            <p className="text-xs" style={{ color: '#ff4081' }}>{swapError}</p>
          </div>
        ) : null}

        {/* 兑换按钮 / 成功闪现（无背景边框，约 3s 后还原） */}
        {swapDone ? (
          <SwapSuccessFlash label={t('exchange.swap.swapSuccessBtn')} />
        ) : (
          <button
            type="button"
            className="w-full h-14 rounded-2xl font-bold text-base transition-all duration-300 relative overflow-hidden"
            style={{
              background: isSwapping
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
                  : isSwapping
                    ? phaseLabel || t('exchange.swap.swapping')
                    : !fromAmount || parseFloat(fromAmount) <= 0
                      ? t('exchange.swap.enterAmount')
                      : t('exchange.swap.swapNow')}
              </span>
            </div>
          </button>
        )}

        {disabled ? (
          <p className="text-xs text-center mt-3" style={{ color: '#ffb74d' }}>
            {disabledReason ?? t('exchange.swap.disabledReason')}
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
