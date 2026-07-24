import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAccount, useReadContract, useSwitchChain } from 'wagmi';
import { erc20Abi, formatUnits, parseUnits } from 'viem';
import { AlertCircle, AlertTriangle, ArrowDown, ChevronDown, ExternalLink, RefreshCw, Settings, Shield } from 'lucide-react';
import TokenIcon from './TokenIcon';
import ChainNetworkIcon from '../../header/components/ChainNetworkIcon';
import SwapSuccessFlash from './SwapSuccessFlash';
import styles from '../ExchangePageDetail.module.scss';
import {
  CCTP_CHAINS,
  CCTP_MVP_ROUTE,
  CCTP_SOURCE_KEYS,
  type CctpChainKey,
} from '../../../config/cctp';
import { ARC_TESTNET_CHAIN_ID } from '../../../config/chains/arcTestnet';
import { config } from '../../../config/wagmi';
import cctpApi from '../../../services/api/cctpApi';
import { useCctpBurn } from '../hooks/useCctpBurn';
import { useCctpIntentStatus } from '../hooks/useCctpIntentStatus';
import { useCctpSwapOnArc } from '../hooks/useCctpSwapOnArc';
import { useCctpSourceBalances } from '../hooks/useCctpSourceBalances';
import { useSwapQuote } from '../hooks/useSwapQuote';
import { ensureWalletOnChain } from '../../../utils/ensureWalletOnChain';
import { resolveTxExplorerUrl, shortenTxHash } from '../../../utils/txExplorer';

/** 将 wei 格式化为可读 Gas（原生币） */
function formatNativeGas(wei?: string | null): string | null {
  if (!wei || wei === '0') return null;
  try {
    const n = Number(formatUnits(BigInt(wei), 18));
    if (!Number.isFinite(n) || n <= 0) return null;
    if (n < 0.000001) return '<0.000001';
    return n.toFixed(6);
  } catch {
    return null;
  }
}

interface CctpSwapPanelProps {
  onSwapSuccess?: (amount: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

/**
 * CCTP 跨链兑换：源链 USDC → Arc USDC → SAP
 * Circle CCTP 仅支持 USDC（及部分域的 EURC/USYC），本产品固定 USDC。
 */
export default function CctpSwapPanel({
  onSwapSuccess = () => {},
  disabled = false,
  disabledReason,
}: CctpSwapPanelProps) {
  const { t, ready } = useTranslation();
  const { address } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const [sourceKey, setSourceKey] = useState<CctpChainKey>(CCTP_MVP_ROUTE.source);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const sourceDropdownRef = useRef<HTMLDivElement>(null);
  /** 用户是否手动选过源链（手动选择后不再自动覆盖） */
  const userPickedSourceRef = useRef(false);
  /** Burn 确认后是否已切到 Arc；已铸造后是否已自动触发兑换 */
  const arcPreparedRef = useRef<string | null>(null);
  const autoSwapStartedRef = useRef<string | null>(null);
  /** 同一 intent 只弹一次成功 toast，避免重复点击/重渲染连弹 */
  const successToastSentRef = useRef<string | null>(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [intentId, setIntentId] = useState<string | null>(null);
  const [flowError, setFlowError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  /** 源链 Burn 确认后、正在切回 Arc */
  const [isSwitchingToDest, setIsSwitchingToDest] = useState(false);
  const [localBurnGas, setLocalBurnGas] = useState('');
  const [localSwapGas, setLocalSwapGas] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [showSettings, setShowSettings] = useState(false);

  const source = CCTP_CHAINS[sourceKey];
  const dest = CCTP_CHAINS[CCTP_MVP_ROUTE.destination];

  // 跨链最终兑换在 Arc：报价固定读 Arc SwapRouter（与同链逻辑一致）
  const { rate: baseRate } = useSwapQuote({
    tokenSymbol: 'USDC',
    amountIn: '1',
    chainId: dest.chainId,
  });
  const { amountOut, isError: quoteError } = useSwapQuote({
    tokenSymbol: 'USDC',
    amountIn: fromAmount,
    chainId: dest.chainId,
  });

  // 输入 USDC → 联动预估 SAP（优先链上精确报价，否则用 1 单位汇率即时估算）
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      setToAmount('');
      return;
    }
    if (amountOut) {
      setToAmount(amountOut);
      return;
    }
    if (baseRate > 0) {
      const parsed = parseFloat(fromAmount);
      if (!isNaN(parsed) && parsed > 0) {
        setToAmount((parsed * baseRate).toFixed(6));
      }
    }
  }, [fromAmount, amountOut, baseRate]);

  const { balances: sourceBalances, hasAnyResult } = useCctpSourceBalances(!!address);

  /** 源链下拉：按 USDC 余额降序（加载中/失败视为 0） */
  const sortedSourceKeys = useMemo(() => {
    return [...CCTP_SOURCE_KEYS].sort((a, b) => {
      const balA = sourceBalances[a]?.raw ?? 0n;
      const balB = sourceBalances[b]?.raw ?? 0n;
      if (balA === balB) return 0;
      return balA > balB ? -1 : 1;
    });
  }, [sourceBalances]);

  // 切换钱包时恢复自动优选
  useEffect(() => {
    userPickedSourceRef.current = false;
  }, [address]);

  const { phase: burnPhase, txHash: burnTxHash, error: burnError, executeBurn, reset: resetBurn } = useCctpBurn();
  const { intent, isLoading: intentLoading, error: intentPollError, refresh: refreshIntent } = useCctpIntentStatus({
    intentId,
    stopAtStatus: 4,
    enabled: !!intentId,
  });
  const {
    phase: swapPhase,
    txHash: swapTxHash,
    error: swapError,
    executeSwap,
    reset: resetSwap,
  } = useCctpSwapOnArc({
    amountInRaw: intent?.amountIn ?? '0',
    slippagePercent: parseFloat(slippage) || 0.5,
  });

  const { data: usdcBalanceRaw, isLoading: balanceLoading } = useReadContract({
    address: source.usdc,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
      refetchInterval: 30_000,
    },
    chainId: source.chainId,
  });

  const formattedBalance = usdcBalanceRaw
    ? Number(formatUnits(usdcBalanceRaw, source.usdcDecimals)).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '0.00';

  const isBurning =
    isStarting ||
    isSwitchingToDest ||
    burnPhase === 'switching' ||
    burnPhase === 'approving' ||
    burnPhase === 'burning' ||
    burnPhase === 'confirming';
  const isSwapping =
    swapPhase === 'switching' ||
    swapPhase === 'approving' ||
    swapPhase === 'swapping' ||
    swapPhase === 'confirming';
  const isDone = intent?.status === 4 || swapPhase === 'success';
  // 必须在所有依赖它的 useEffect 之前声明，避免 TDZ（Cannot access before initialization）
  const formLocked = disabled || !!intentId || isBurning;

  const resetAll = useCallback(() => {
    setFromAmount('');
    setToAmount('');
    setIntentId(null);
    setFlowError(null);
    setIsStarting(false);
    setIsSwitchingToDest(false);
    setLocalBurnGas('');
    setLocalSwapGas('');
    setShowSourceDropdown(false);
    userPickedSourceRef.current = false;
    arcPreparedRef.current = null;
    autoSwapStartedRef.current = null;
    successToastSentRef.current = null;
    resetBurn();
    resetSwap();
  }, [resetBurn, resetSwap]);

  // 有任一链出结果即可优选：不必等最慢 RPC 全部完成
  useEffect(() => {
    if (!hasAnyResult || formLocked || userPickedSourceRef.current) return;
    const current = sourceBalances[sourceKey];
    // 当前链仍在加载时先不抢切；已确认有余额则保持
    if (current?.loading) return;
    if (current?.selectable) return;
    const best = sortedSourceKeys.find((key) => sourceBalances[key]?.selectable);
    if (best && best !== sourceKey) {
      setSourceKey(best);
    }
  }, [hasAnyResult, formLocked, sourceBalances, sourceKey, sortedSourceKeys]);

  // 点击空白区域收起源链下拉
  useEffect(() => {
    if (!showSourceDropdown) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!sourceDropdownRef.current?.contains(event.target as Node)) {
        setShowSourceDropdown(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [showSourceDropdown]);

  /**
   * 用户可见必经步骤：
   * 1 选源链 → 2 输入金额 → 3 授权/Burn → 4 跨链到账(Relayer) → 5 Arc 兑换(含授权) → 6 完成
   */
  const currentStep = useMemo(() => {
    if (isDone) return 6;
    if (isSwapping || (intent && intent.status >= 3)) return 5;
    if (intent && intent.status >= 1) return 4;
    if (isBurning || intentId) return 3;
    if (fromAmount && parseFloat(fromAmount) > 0) return 2;
    return 1;
  }, [intent, intentId, isBurning, isSwapping, isDone, fromAmount]);

  const handleSelectSource = (key: CctpChainKey) => {
    if (formLocked) return;
    const bal = sourceBalances[key];
    if (bal && !bal.loading && !bal.selectable) return;
    userPickedSourceRef.current = true;
    setSourceKey(key);
    setShowSourceDropdown(false);
  };

  const handleStartCrossChain = useCallback(async () => {
    if (disabled || !address) return;
    const parsed = parseFloat(fromAmount);
    if (!fromAmount || isNaN(parsed) || parsed <= 0) return;

    setFlowError(null);
    setIsStarting(true);
    setIsSwitchingToDest(false);
    setLocalBurnGas('');
    setLocalSwapGas('');
    successToastSentRef.current = null;
    arcPreparedRef.current = null;
    autoSwapStartedRef.current = null;

    try {
      const amountIn = parseUnits(fromAmount, source.usdcDecimals).toString();
      const created = await cctpApi.createIntent({
        sourceChainId: source.chainId,
        destChainId: dest.chainId,
        amountIn,
        tokenSymbol: 'USDC',
        tokenDecimals: source.usdcDecimals,
      });

      // 1) 源链：用户确认 Burn（含授权）并等待交易上链
      const burned = await executeBurn(created.burnParams);
      if (!burned) {
        return;
      }

      setLocalBurnGas(burned.gasFee);
      await cctpApi.submitBurn(created.intentId, burned.hash, burned.gasFee);

      // 2) 源链确认完成后：立即切回目标链 Arc，再等待到账
      setIsSwitchingToDest(true);
      try {
        await ensureWalletOnChain(
          config,
          ARC_TESTNET_CHAIN_ID,
          switchChainAsync,
          'Arc Testnet',
        );
        arcPreparedRef.current = created.intentId;
      } catch (switchErr) {
        console.warn('[CCTP] 源链确认后切回 Arc 失败，到账后将重试', switchErr);
        // 仍启动轮询；已铸造时的自动兑换会再次切链
      } finally {
        setIsSwitchingToDest(false);
      }

      // 3) 开始轮询目标链到账
      setIntentId(created.intentId);
    } catch (err) {
      setFlowError(err instanceof Error ? err.message : '跨链流程失败');
    } finally {
      setIsStarting(false);
      setIsSwitchingToDest(false);
    }
  }, [disabled, address, fromAmount, source, dest.chainId, executeBurn, switchChainAsync]);

  const handleArcSwap = useCallback(async () => {
    if (!intentId || !intent) return;
    if (intent.status < 3 || intent.status >= 4) return;
    setFlowError(null);
    if (swapPhase === 'error' || swapPhase === 'idle') {
      resetSwap();
    }
    const swapped = await executeSwap();
    if (!swapped) {
      autoSwapStartedRef.current = null;
      return;
    }
    try {
      setLocalSwapGas(swapped.gasFee);
      await cctpApi.submitSwap(intentId, swapped.hash, swapped.gasFee);
      await refreshIntent();
    } catch (err) {
      autoSwapStartedRef.current = null;
      setFlowError(err instanceof Error ? err.message : '提交 swap 失败');
    }
  }, [intentId, intent, executeSwap, refreshIntent, swapPhase, resetSwap]);

  // 4) 目标链已铸造：钱包应已在 Arc → 自动唤起兑换确认
  useEffect(() => {
    if (!intentId || !intent) return;
    if (intent.status < 3 || intent.status >= 4) return;
    if (isDone || isSwapping || disabled || isStarting || isSwitchingToDest) return;
    if (autoSwapStartedRef.current === intentId) return;
    autoSwapStartedRef.current = intentId;

    void (async () => {
      try {
        // 若 Burn 后切链失败，这里补切一次再弹兑换
        if (arcPreparedRef.current !== intentId) {
          await ensureWalletOnChain(
            config,
            ARC_TESTNET_CHAIN_ID,
            switchChainAsync,
            'Arc Testnet',
          );
          arcPreparedRef.current = intentId;
        }
        await handleArcSwap();
      } catch (err) {
        console.warn('[CCTP] 自动唤起 Arc 兑换失败', err);
        autoSwapStartedRef.current = null;
        setFlowError(
          err instanceof Error
            ? err.message
            : t('exchange.cctp.swapWalletTimeout', {
                defaultValue: '自动唤起兑换失败，请点击下方按钮重试',
              }),
        );
      }
    })();
  }, [
    intentId,
    intent,
    isDone,
    isSwapping,
    disabled,
    isStarting,
    isSwitchingToDest,
    switchChainAsync,
    handleArcSwap,
    t,
  ]);

  // 兑换卡住时解锁，避免按钮永久 disabled
  useEffect(() => {
    if (!isSwapping) return undefined;
    const timer = window.setTimeout(() => {
      resetSwap();
      autoSwapStartedRef.current = null;
      setFlowError(
        t('exchange.cctp.swapWalletTimeout', {
          defaultValue: '钱包未弹出或响应超时，请再点击下方按钮确认兑换',
        }),
      );
    }, 45_000);
    return () => window.clearTimeout(timer);
  }, [isSwapping, resetSwap, t]);

  // 仅在真正完成后弹一次成功 toast（展示 SAP 数量，避免重复）
  useEffect(() => {
    if (!isDone || !intentId) return;
    if (successToastSentRef.current === intentId) return;
    const sapRaw = toAmount && parseFloat(toAmount) > 0 ? toAmount : '';
    if (!sapRaw) return;
    successToastSentRef.current = intentId;
    const sapDisplay = Number(sapRaw).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
    onSwapSuccess(sapDisplay);
  }, [isDone, intentId, toAmount, onSwapSuccess]);

  // 成功闪现约 3s 后还原为可继续兑换（清空意图与表单）
  useEffect(() => {
    if (!isDone) return;
    const timer = setTimeout(() => {
      resetAll();
    }, 3000);
    return () => clearTimeout(timer);
  }, [isDone, resetAll]);

  const phaseLabel = useMemo(() => {
    if (burnPhase === 'switching') {
      return t('exchange.cctp.switchingSource', { chain: source.name, defaultValue: `切换到 ${source.name}...` });
    }
    if (burnPhase === 'approving') return t('exchange.cctp.approving', { defaultValue: '授权 USDC...' });
    if (burnPhase === 'burning') return t('exchange.cctp.burning', { defaultValue: 'Burn 跨链中...' });
    if (burnPhase === 'confirming') return t('exchange.cctp.confirmingBurn', { defaultValue: '确认 Burn 交易...' });
    if (isSwitchingToDest) {
      return t('exchange.cctp.switchingArcAfterBurn', {
        defaultValue: '源链已确认，正在切换到 Arc...',
      });
    }
    if (swapPhase === 'switching') return t('exchange.cctp.switchingArc', { defaultValue: '切换到 Arc...' });
    if (swapPhase === 'approving') return t('exchange.cctp.approvingArc', { defaultValue: '授权兑换...' });
    if (swapPhase === 'swapping') return t('exchange.cctp.swapping', { defaultValue: 'Arc 兑换中...' });
    if (swapPhase === 'confirming') return t('exchange.cctp.confirmingSwap', { defaultValue: '确认兑换交易...' });
    return '';
  }, [burnPhase, swapPhase, source.name, isSwitchingToDest, t]);

  const displayError = flowError || burnError || swapError || intentPollError;

  const amountDisplay = useMemo(() => {
    const raw = intent?.amountIn;
    if (!raw) {
      const n = parseFloat(fromAmount);
      return Number.isFinite(n) && n > 0 ? n.toFixed(2) : '--';
    }
    try {
      const decimals = intent?.tokenDecimals || source.usdcDecimals;
      return Number(formatUnits(BigInt(raw), decimals)).toFixed(2);
    } catch {
      return '--';
    }
  }, [intent?.amountIn, intent?.tokenDecimals, fromAmount, source.usdcDecimals]);

  const timeDisplay = intent?.completedAt || intent?.updatedAt || intent?.createdAt || '--';

  const burnHash = burnTxHash || intent?.burnTxHash || '';
  const mintHash = intent?.mintTxHash || '';
  const swapHash = swapTxHash || intent?.swapTxHash || '';
  const burnExplorer = resolveTxExplorerUrl(source.chainId, burnHash);
  const mintExplorer = resolveTxExplorerUrl(dest.chainId, mintHash);
  const swapExplorer = resolveTxExplorerUrl(dest.chainId, swapHash);

  const burnGasText = formatNativeGas(intent?.burnGasFee || localBurnGas);
  const mintGasText = formatNativeGas(intent?.mintGasFee);
  const swapGasText = formatNativeGas(intent?.swapGasFee || localSwapGas);
  const gasParts: string[] = [];
  if (burnGasText) gasParts.push(`${t('exchange.cctp.gasBurn', { defaultValue: '源链' })} ${burnGasText}`);
  if (mintGasText) gasParts.push(`Mint ${mintGasText}`);
  if (swapGasText) gasParts.push(`${t('exchange.cctp.gasSwap', { defaultValue: '目标链' })} ${swapGasText}`);
  const gasDisplay = gasParts.length > 0 ? gasParts.join(' · ') : '--';

  const statusLabel = useMemo(() => {
    const code = isDone ? 4 : intent?.status;
    if (code == null) return intentLoading ? '...' : '--';
    const keyByStatus: Record<number, string> = {
      0: 'exchange.cctp.statusCreated',
      1: 'exchange.cctp.statusBurned',
      2: 'exchange.cctp.statusAttested',
      3: 'exchange.cctp.statusMinted',
      4: 'exchange.cctp.statusSwapped',
      5: 'exchange.cctp.statusFailed',
    };
    const defaults: Record<number, string> = {
      0: '已创建',
      1: '源链锁定',
      2: '待铸造',
      3: '已铸造',
      4: '已完成',
      5: '失败',
    };
    const key = keyByStatus[code];
    if (!key) return intent?.statusDesc || '--';
    return t(key, { defaultValue: defaults[code] });
  }, [isDone, intent?.status, intent?.statusDesc, intentLoading, t]);

  const showInfoPanel = !!intentId || !!intent || !!displayError;
  // 失败时优先展示后端 error_msg
  const failReason = displayError || (intent?.status === 5 ? intent.errorMsg : '') || '';

  const renderTxLink = (label: string, hash: string, href?: string) => {
    if (!hash) return null;
    const short = shortenTxHash(hash);
    return (
      <div className={styles.cctpInfoRow} key={label}>
        <span className={styles.cctpInfoLabel}>{label}</span>
        {href ? (
          <a
            className={styles.cctpInfoLink}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={t('exchange.cctp.viewOnExplorer', { defaultValue: '在区块浏览器查看' })}
          >
            <span className={styles.cctpInfoMono}>{short}</span>
            <ExternalLink size={12} aria-hidden />
          </a>
        ) : (
          <span className={styles.cctpInfoMono}>{short}</span>
        )}
      </div>
    );
  };

  if (!ready) {
    return <div className="relative w-full max-w-[520px] h-40 rounded-3xl bg-white/5 animate-pulse" aria-busy="true" />;
  }

  const steps = [
    t('exchange.cctp.stepSource', { defaultValue: '选中源链' }),
    t('exchange.cctp.stepAmount', { defaultValue: '确认金额' }),
    t('exchange.cctp.stepBurn', { defaultValue: '锁定金额' }),
    t('exchange.cctp.stepRelay', { defaultValue: '目标链到账' }),
    t('exchange.cctp.stepSwap', { defaultValue: '开始兑换' }),
    t('exchange.cctp.stepDone', { defaultValue: '兑换完成' }),
  ];

  return (
    <div data-cmp="CctpSwapPanel" className="relative w-full max-w-[520px]">
      <div className={`absolute inset-0 rounded-3xl pointer-events-none ${styles.swapOuterGlow}`} />

      <div className={`relative rounded-3xl p-6 ${styles.swapMainCard}`}>
        <div className="flex items-center justify-between mb-4">
          {/* 标题位：源链下拉（替代「跨链兑换」标题） */}
          <div className={`relative ${styles.cctpTitleSource}`} ref={sourceDropdownRef}>
            <button
              type="button"
              className={styles.cctpTitleSourceBtn}
              onClick={() => {
                if (formLocked) return;
                setShowSourceDropdown((open) => !open);
              }}
              disabled={formLocked}
              aria-expanded={showSourceDropdown}
              aria-label={t('exchange.cctp.sourceChain', { defaultValue: '源链' })}
            >
              <ChainNetworkIcon
                chainId={source.chainId}
                alt={source.name}
                className={styles.cctpSourceChainIcon}
              />
              <span className={styles.cctpTitleSourceName}>{source.name}</span>
              <ChevronDown
                size={16}
                className={showSourceDropdown ? styles.cctpSourceChevronOpen : undefined}
              />
            </button>
            {showSourceDropdown ? (
              <div className={styles.cctpTitleSourceMenu} role="listbox">
                {sortedSourceKeys.map((key) => {
                  const chain = CCTP_CHAINS[key];
                  const selected = key === sourceKey;
                  const bal = sourceBalances[key];
                  const balLoading = !bal || bal.loading;
                  const disabledOption = !balLoading && !bal.selectable;
                  return (
                    <button
                      key={key}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      aria-disabled={disabledOption}
                      disabled={disabledOption}
                      className={`${styles.cctpSourceOption} ${
                        selected ? styles.cctpSourceOptionActive : ''
                      } ${disabledOption ? styles.cctpSourceOptionDisabled : ''}`}
                      onClick={() => handleSelectSource(key)}
                    >
                      <ChainNetworkIcon
                        chainId={chain.chainId}
                        alt={chain.name}
                        className={styles.cctpSourceChainIcon}
                      />
                      <span className={styles.cctpSourceOptionName}>{chain.name}</span>
                      <span className={styles.cctpSourceOptionBalance}>
                        {balLoading ? '...' : `${bal?.formatted ?? '0.00'} USDC`}
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,77,255,0.15)', border: '1px solid rgba(124,77,255,0.2)' }}
              onClick={resetAll}
              disabled={isBurning || isSwapping}
              aria-label={t('exchange.swap.refresh', { defaultValue: '重置' })}
            >
              <RefreshCw size={14} style={{ color: '#b39ddb' }} />
            </button>
            <button
              type="button"
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: showSettings ? 'rgba(124,77,255,0.3)' : 'rgba(124,77,255,0.15)',
                border: '1px solid rgba(124,77,255,0.2)',
              }}
              onClick={() => setShowSettings((open) => !open)}
              disabled={isBurning || isSwapping}
              aria-expanded={showSettings}
              aria-label={t('exchange.swap.slippage', { defaultValue: '滑点设置' })}
            >
              <Settings size={14} style={{ color: '#b39ddb' }} />
            </button>
          </div>
        </div>

        {/* 滑点设置（作用于 Arc 上 USDC→SAP 兑换） */}
        <div
          className="rounded-2xl overflow-hidden transition-all duration-300"
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
                type="button"
                onClick={() => setSlippage(val)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium"
                style={{
                  background:
                    slippage === val ? 'linear-gradient(135deg, #7c4dff, #448aff)' : 'rgba(255,255,255,0.06)',
                  color: slippage === val ? '#fff' : '#7986cb',
                }}
              >
                {val}%
              </button>
            ))}
            <div
              className="flex items-center gap-1 rounded-lg px-3 py-1.5"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(124,77,255,0.15)' }}
            >
              <input
                className="w-12 text-xs bg-transparent outline-none text-foreground"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                placeholder={t('exchange.swap.customSlippage')}
                disabled={formLocked}
              />
              <span className="text-xs text-muted-foreground">%</span>
            </div>
          </div>
        </div>

        {/* 简洁步骤进度 */}
        <div className={styles.cctpStepBar} aria-label={t('exchange.cctp.stepsAria', { defaultValue: '跨链步骤' })}>
          {steps.map((label, idx) => {
            const stepNum = idx + 1;
            // 完成后全部打勾（含第 6 步），避免停在「完成」却仍显示未勾选
            const done = isDone || currentStep > stepNum;
            const active = !isDone && currentStep === stepNum;
            return (
              <div key={label} className={styles.cctpStepItem}>
                {idx > 0 ? (
                  <span
                    className={`${styles.cctpStepLine} ${done || active ? styles.cctpStepLineActive : ''}`}
                    aria-hidden
                  />
                ) : null}
                <div
                  className={`${styles.cctpStepDot} ${
                    done ? styles.cctpStepDotDone : active ? styles.cctpStepDotActive : ''
                  }`}
                >
                  {done ? '✓' : stepNum}
                </div>
                <span
                  className={`${styles.cctpStepLabel} ${
                    done ? styles.cctpStepLabelDone : active ? styles.cctpStepLabelActive : ''
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* 支付区：余额 + USDC + 金额（源链选择已上移至标题） */}
        <div
          className="rounded-2xl p-4 mb-3"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(124,77,255,0.15)' }}
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <span className="text-xs text-muted-foreground">{t('exchange.swap.pay')}</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {t('exchange.swap.balance')}:{' '}
                <span style={{ color: '#b39ddb' }}>{balanceLoading ? '...' : formattedBalance}</span>
              </span>
              <button
                type="button"
                className="text-xs px-2 py-0.5 rounded-md font-medium"
                style={{ background: 'rgba(124,77,255,0.2)', color: '#00e5ff' }}
                onClick={() => {
                  if (formLocked || formattedBalance === '0.00') return;
                  setFromAmount(formattedBalance.replace(/,/g, ''));
                }}
                disabled={formLocked}
              >
                {t('exchange.swap.max')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(124,77,255,0.15)', border: '1px solid rgba(124,77,255,0.3)' }}
              title={t('exchange.cctp.usdcOnlyHint', {
                defaultValue: 'CCTP 仅支持 USDC 原生跨链',
              })}
            >
              <TokenIcon symbol="USDC" size={26} />
              <span className="text-sm font-semibold text-foreground">USDC</span>
            </div>

            <input
              type="number"
              className={`flex-1 bg-transparent outline-none text-right text-2xl font-bold text-foreground placeholder:text-gray-500 ${styles.noSpinner}`}
              placeholder="0.00"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              disabled={formLocked}
            />
          </div>
        </div>

        <div className={styles.swapArrowRow}>
          <div className={styles.swapArrowBadge}>
            <ArrowDown size={20} className={styles.arrowActive} />
          </div>
          <span className={styles.swapRateInline}>
            {baseRate > 0
              ? t('exchange.swap.rateLine', { from: 'USDC', rate: baseRate.toFixed(4) })
              : t('exchange.swap.rateLine', { from: 'USDC', rate: '--' })}
          </span>
          {quoteError ? (
            <span className={styles.swapRateError}>
              {t('exchange.swap.quoteError', { defaultValue: '报价获取失败' })}
            </span>
          ) : null}
        </div>

        <div
          className="rounded-2xl p-4 mb-3"
          style={{ background: 'rgba(124,77,255,0.06)', border: '1px solid rgba(124,77,255,0.2)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground">{t('exchange.swap.receive')}</span>
            <span className="text-[10px] text-muted-foreground">{dest.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(124,77,255,0.2)',
                border: '1px solid rgba(124,77,255,0.4)',
                minWidth: '120px',
              }}
            >
              <TokenIcon symbol="SAP" size={26} />
              <span className="text-sm font-bold" style={{ color: '#00e5ff' }}>
                SAP
              </span>
            </div>
            <input
              type="number"
              className={`flex-1 bg-transparent outline-none text-right text-2xl font-bold text-foreground placeholder:text-gray-500 ${styles.noSpinner}`}
              placeholder="0.0000"
              value={toAmount}
              readOnly
              tabIndex={-1}
              aria-label={t('exchange.swap.receive')}
            />
          </div>
        </div>

        {showInfoPanel ? (
          <div
            className={`${styles.cctpInfoPanel} ${
              (failReason && !isDone) || intent?.status === 5 ? styles.cctpInfoPanelError : ''
            }`}
          >
            {failReason && !isDone ? (
              <div className={styles.cctpInfoFail}>
                <AlertTriangle size={16} className={styles.cctpInfoFailIcon} aria-hidden />
                <p className={styles.cctpInfoFailText}>{failReason}</p>
              </div>
            ) : null}

            {intent || intentId ? (
              <div className={styles.cctpInfoRows}>
                <div className={styles.cctpInfoRow}>
                  <span className={styles.cctpInfoLabel}>
                    {t('exchange.cctp.intentId', { defaultValue: 'Intent ID' })}
                  </span>
                  {/* 后续跳转 admin 兑换意图详情；暂不实现路由 */}
                  <button
                    type="button"
                    className={`${styles.cctpInfoLink} ${styles.cctpInfoMono}`}
                    title={t('exchange.cctp.intentIdSoon', {
                      defaultValue: '跳转管理端订单详情（即将支持）',
                    })}
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    {intent?.intentId || intentId}
                  </button>
                </div>
                <div className={styles.cctpInfoRow}>
                  <span className={styles.cctpInfoLabel}>{t('exchange.cctp.status', { defaultValue: '状态' })}</span>
                  <span
                    className={styles.cctpInfoValue}
                    style={{
                      color:
                        intent?.status === 5 || (!isDone && failReason)
                          ? '#ff4081'
                          : isDone
                            ? '#69f0ae'
                            : '#b39ddb',
                    }}
                  >
                    {statusLabel}
                  </span>
                </div>
                <div className={styles.cctpInfoRow}>
                  <span className={styles.cctpInfoLabel}>{t('exchange.cctp.amount', { defaultValue: '金额' })}</span>
                  <span className={styles.cctpInfoValue}>
                    {amountDisplay} {intent?.tokenSymbol || 'USDC'}
                  </span>
                </div>
                <div className={styles.cctpInfoRow}>
                  <span className={styles.cctpInfoLabel}>{t('exchange.cctp.time', { defaultValue: '时间' })}</span>
                  <span className={styles.cctpInfoValue}>{timeDisplay}</span>
                </div>
                <div className={styles.cctpInfoRow}>
                  <span className={styles.cctpInfoLabel}>{t('exchange.cctp.gasFee', { defaultValue: 'Gas 费' })}</span>
                  <span className={styles.cctpInfoValue}>{gasDisplay}</span>
                </div>
                {renderTxLink(t('exchange.cctp.burnTx', { defaultValue: 'Burn Tx' }), burnHash, burnExplorer)}
                {renderTxLink(t('exchange.cctp.mintTx', { defaultValue: 'Mint Tx' }), mintHash, mintExplorer)}
                {renderTxLink(t('exchange.cctp.swapTx', { defaultValue: 'Swap Tx' }), swapHash, swapExplorer)}
              </div>
            ) : null}
          </div>
        ) : null}

        {!intentId || intent?.status === 0 ? (
          <button
            type="button"
            className="w-full h-14 rounded-2xl font-bold text-base"
            style={{
              background: 'linear-gradient(135deg, #7c4dff 0%, #448aff 50%, #00e5ff 100%)',
              color: '#fff',
              opacity: disabled || !fromAmount || parseFloat(fromAmount) <= 0 || isBurning ? 0.5 : 1,
              cursor: disabled || !fromAmount || isBurning ? 'not-allowed' : 'pointer',
            }}
            onClick={() => void handleStartCrossChain()}
            disabled={disabled || !fromAmount || parseFloat(fromAmount) <= 0 || isBurning}
          >
            {isBurning
              ? phaseLabel || t('exchange.cctp.starting', { defaultValue: '处理中...' })
              : t('exchange.cctp.start', { defaultValue: '开始跨链兑换' })}
          </button>
        ) : intent && intent.status >= 3 && intent.status < 4 && !isDone ? (
          <button
            type="button"
            className="w-full h-14 rounded-2xl font-bold text-base"
            style={{
              background: isSwapping ? 'rgba(124,77,255,0.4)' : 'linear-gradient(135deg, #69f0ae, #00e5ff)',
              color: '#fff',
              opacity: isSwapping ? 0.7 : 1,
              cursor: isSwapping ? 'wait' : 'pointer',
            }}
            onClick={() => void handleArcSwap()}
            disabled={isSwapping}
          >
            {isSwapping
              ? phaseLabel || t('exchange.cctp.autoSwapping', { defaultValue: '请在钱包中确认兑换...' })
              : t('exchange.cctp.swapOnArc', { defaultValue: '授权并兑换 SAP' })}
          </button>
        ) : intent && intent.status >= 1 && intent.status < 3 ? (
          <button
            type="button"
            className="w-full h-14 rounded-2xl font-bold text-base"
            style={{ background: 'rgba(124,77,255,0.25)', color: '#b39ddb', cursor: 'wait' }}
            disabled
          >
            {t('exchange.cctp.waitingRelay', { defaultValue: '等待跨链到账...' })}
          </button>
        ) : isDone ? (
          <SwapSuccessFlash
            label={t('exchange.cctp.successBtn', { defaultValue: '兑换成功' })}
          />
        ) : null}

        {disabled ? (
          <p className="text-xs text-center mt-3" style={{ color: '#ffb74d' }}>
            {disabledReason ?? t('exchange.swap.disabledReason')}
          </p>
        ) : null}

        <div className={styles.cctpNotice}>
          <AlertCircle size={12} className={styles.cctpNoticeIcon} aria-hidden />
          <p className={styles.cctpNoticeText}>
            {t('exchange.cctp.notice', {
              defaultValue:
                '跨链兑换需在源链钱包预留少量 ETH 作为 Gas；流程依次为授权与 Burn、等待跨链到账、再在 Arc 上授权并兑换为 SAP。中途失败一般不会损失代币，可核对链上交易后重试。',
            })}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Shield size={12} style={{ color: '#7986cb' }} />
          <span className="text-xs text-muted-foreground">{t('exchange.swap.securityNote')}</span>
        </div>
      </div>
    </div>
  );
}
