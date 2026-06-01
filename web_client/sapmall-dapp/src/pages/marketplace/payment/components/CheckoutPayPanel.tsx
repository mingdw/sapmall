import React from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { ShieldCheck, Wallet } from 'lucide-react';
import { OrderPreviewResult } from '../../../../services/api/orderApi';
import { getPaymentChainLabel, isPaymentChain } from '../../../../config/paymentChains';
import { getUsdcTokenConfig } from '../../../../config/walletTokens';
import { useUsdcBalance } from '../hooks/useUsdcBalance';
import { formatUsdcDisplay, formatUsdcFromRaw } from '../utils/formatPaymentAmount';
import { PaymentPhase } from '../types/paymentTypes';
import PaymentGlassCard from './PaymentGlassCard';
import PaymentStatusBanner from './PaymentStatusBanner';
import type { PaymentIntentBundle } from '../../../../services/api/orderApi';

interface Props {
  preview: OrderPreviewResult;
  phase: PaymentPhase;
  errorKey: string | null;
  intent: PaymentIntentBundle | null;
  txHash: string | null;
  onPay: () => void;
  busy: boolean;
}

const CheckoutPayPanel: React.FC<Props> = ({
  preview,
  phase,
  errorKey,
  intent,
  txHash,
  onPay,
  busy,
}) => {
  const { t } = useTranslation();
  const { isConnected, chainId, address } = useAccount();
  const targetChainId = intent?.chainId ?? chainId;
  const usdcConfig = getUsdcTokenConfig(targetChainId);
  const { formatted: usdcFormatted, symbol: usdcSymbol } = useUsdcBalance(targetChainId, address);

  const payAmountDisplay = intent
    ? `${formatUsdcFromRaw(intent.amount, intent.decimals)} USDC`
    : formatUsdcDisplay(preview.totalAmount);

  const networkOk = isConnected && isPaymentChain(chainId) && (!intent || chainId === intent.chainId);
  const canSubmit = phase === 'idle' && isConnected && networkOk && !busy;

  const statusMessageKey = errorKey
    ? `payment.errors.${errorKey}`
    : phase === 'submitting'
      ? 'payment.status.creatingOrder'
      : phase === 'intentLoading'
        ? 'payment.status.preparingIntent'
        : phase === 'approving'
          ? 'payment.status.approving'
          : phase === 'paying'
            ? 'payment.status.paying'
            : phase === 'confirming'
              ? 'payment.status.confirming'
              : undefined;

  return (
    <PaymentGlassCard className="p-5 md:p-6 lg:sticky lg:top-24">
      <h2 className="text-base font-semibold text-slate-100 mb-4">{t('payment.pay.title')}</h2>

      <dl className="space-y-3 text-sm mb-4">
        <div className="flex justify-between">
          <dt className="text-slate-400">{t('payment.pay.subtotal')}</dt>
          <dd className="text-slate-200">{formatUsdcDisplay(preview.totalAmount)}</dd>
        </div>
        <div className="flex justify-between border-t border-slate-600/30 pt-3">
          <dt className="text-slate-200 font-medium">{t('payment.pay.total')}</dt>
          <dd className="text-lg font-semibold text-orange-400">{payAmountDisplay}</dd>
        </div>
      </dl>

      <div className="rounded-lg bg-slate-900/50 border border-slate-600/30 p-3 mb-4 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Wallet size={16} className="text-slate-400 shrink-0" aria-hidden />
          <span>
            {t('payment.pay.network')}:{' '}
            <strong>{targetChainId ? getPaymentChainLabel(targetChainId) : '—'}</strong>
          </span>
        </div>
        <div className="flex justify-between text-slate-400">
          <span>{t('payment.pay.balance')}</span>
          <span className="text-slate-200 font-mono text-xs">
            {usdcConfig ? `${usdcFormatted} ${usdcSymbol}` : t('payment.pay.balanceUnavailable')}
          </span>
        </div>
        {!networkOk && isConnected ? (
          <p className="text-amber-400/90 text-xs leading-relaxed">{t('payment.pay.switchNetworkManual')}</p>
        ) : null}
        {!isConnected ? (
          <p className="text-amber-400/90 text-xs">{t('payment.pay.connectWallet')}</p>
        ) : null}
      </div>

      <div className="mb-4">
        <PaymentStatusBanner
          phase={phase}
          statusMessageKey={statusMessageKey}
          txHash={txHash}
          chainId={intent?.chainId ?? chainId}
          expireAt={intent?.expireAt}
        />
      </div>

      <Button
        type="primary"
        size="large"
        block
        disabled={!canSubmit}
        onClick={onPay}
        className="!h-12 !font-semibold !rounded-lg"
        icon={busy ? <Spin size="small" /> : <ShieldCheck size={18} />}
      >
        {busy ? t(`payment.pay.buttonBusy.${phase}`) : t('payment.pay.button')}
      </Button>

      <p className="mt-3 text-[11px] text-slate-500 text-center leading-relaxed">{t('payment.pay.legalHint')}</p>
    </PaymentGlassCard>
  );
};

export default CheckoutPayPanel;
