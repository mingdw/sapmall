import React, { useMemo } from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowRightLeft, Coins, ShieldCheck } from 'lucide-react';
import { OrderPreviewResult } from '../../../services/api/orderApi';
import type { PaymentIntentBundle } from '../../../services/api/orderApi';
import {
  calcSapPayAmount,
  formatSapUsdPrice,
  formatUsdcToSapRate,
} from '../../../config/sapMarket';
import { getPaymentChainLabel, isPaymentChain } from '../../../config/paymentChains';
import { getUsdcTokenConfig } from '../../../config/walletTokens';
import { useUsdcBalance } from './hooks/useUsdcBalance';
import { useSapBalance } from './hooks/useSapBalance';
import { formatUsdcFromRaw } from './utils/formatPaymentAmount';
import { calcPaymentFee, calcPaymentTotal, NON_SAP_PAYMENT_FEE_RATE } from './utils/paymentFee';
import PaymentMoney, { PaymentMoneyParts } from './components/PaymentMoney';
import PaymentMethodToggle from './components/PaymentMethodToggle';
import PaymentCardHeader from './components/PaymentCardHeader';
import { PaymentMethod, PaymentPhase } from './types/paymentTypes';
import PaymentGlassCard from './components/PaymentGlassCard';
import PaymentStatusBanner from './components/PaymentStatusBanner';
import styles from './PaymentPage.module.scss';

const FEE_PERCENT_DISPLAY = `${NON_SAP_PAYMENT_FEE_RATE * 100}%`;

export interface CheckoutPayPanelProps {
  preview: OrderPreviewResult;
  phase: PaymentPhase;
  errorKey: string | null;
  intent: PaymentIntentBundle | null;
  txHash: string | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  busy: boolean;
  contactValid: boolean;
}

const CheckoutPayPanel: React.FC<CheckoutPayPanelProps> = ({
  preview,
  phase,
  errorKey,
  intent,
  txHash,
  paymentMethod,
  onPaymentMethodChange,
  onPay,
  busy,
  contactValid,
}) => {
  const { t } = useTranslation();
  const { isConnected, chainId, address } = useAccount();
  const targetChainId = intent?.chainId ?? chainId;
  const usdcConfig = getUsdcTokenConfig(targetChainId);
  const { formatted: usdcFormatted, symbol: usdcSymbol } = useUsdcBalance(targetChainId, address);
  const sap = useSapBalance(targetChainId, address);

  const discount = preview.discountAmount ?? 0;
  const goodsTotal = preview.originalAmount ?? preview.totalAmount;
  const payAmount = preview.totalAmount;
  const sapPayAmount = calcSapPayAmount(payAmount);
  const feeAmount = calcPaymentFee(payAmount, paymentMethod);
  const totalDueUsdc = calcPaymentTotal(payAmount, 'USDC');

  const intentPayAmount = intent
    ? Number.parseFloat(formatUsdcFromRaw(intent.amount, intent.decimals))
    : null;

  const displayUsdcTotal =
    paymentMethod === 'USDC' ? (intentPayAmount ?? totalDueUsdc) : totalDueUsdc;

  const sapInsufficient =
    paymentMethod === 'SAP' &&
    isConnected &&
    !sap.isLoading &&
    (!sap.configured || sap.numeric < sapPayAmount);

  const networkOk = isConnected && isPaymentChain(chainId) && (!intent || chainId === intent.chainId);

  const canPayUsdc =
    phase === 'idle' &&
    isConnected &&
    networkOk &&
    !busy &&
    contactValid &&
    paymentMethod === 'USDC';

  const canPaySap =
    phase === 'idle' &&
    isConnected &&
    networkOk &&
    !busy &&
    contactValid &&
    paymentMethod === 'SAP' &&
    sap.configured &&
    !sap.isLoading &&
    sap.numeric >= sapPayAmount;

  const canSubmit = canPayUsdc || canPaySap;

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

  const payButtonLabel = busy
    ? t(`payment.pay.buttonBusy.${phase}`)
    : paymentMethod === 'SAP'
      ? t('payment.pay.buttonSap')
      : t('payment.pay.button');

  const contextAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (!isConnected) alerts.push(t('payment.pay.connectWallet'));
    else if (!networkOk) alerts.push(t('payment.pay.switchNetworkManual'));
    if (!contactValid && phase === 'idle') alerts.push(t('payment.pay.contactRequired'));
    if (paymentMethod === 'SAP' && !sap.configured && isConnected) {
      alerts.push(t('payment.pay.sapPayUnavailable'));
    }
    return alerts;
  }, [contactValid, isConnected, networkOk, paymentMethod, phase, sap.configured, t]);

  return (
    <PaymentGlassCard className={`p-5 md:p-6 ${styles.payPanelCard}`}>
      <PaymentCardHeader
        icon={<Coins strokeWidth={1.75} aria-hidden />}
        iconVariant="pay"
        title={t('payment.pay.title')}
      />

      <PaymentMethodToggle value={paymentMethod} onChange={onPaymentMethodChange} />

      {paymentMethod === 'SAP' ? (
        <div className={styles.sapPayExtras}>
          <div className={styles.sapMarketRow}>
            <span className={styles.sapMarketItem}>
              <span>{t('payment.pay.sapSpotPrice')}</span>
              <span className={styles.sapMarketValue}>{formatSapUsdPrice()}</span>
            </span>
            <span className={styles.sapMarketItem}>
              <span>{t('payment.pay.swapRate')}</span>
              <span className={styles.sapMarketValue}>{formatUsdcToSapRate()}</span>
            </span>
          </div>
        </div>
      ) : null}

      <dl className={styles.payDetailList}>
        <div className={styles.lineItemRow}>
          <dt className={styles.lineItemLabel}>{t('payment.pay.goodsAmount')}</dt>
          <dd className={styles.lineItemValue}>
            <PaymentMoney amount={goodsTotal} currency="USDC" />
          </dd>
        </div>
        {discount > 0 ? (
          <div className={styles.lineItemRow}>
            <dt className={styles.lineItemLabel}>{t('payment.pay.discount')}</dt>
            <dd className={`${styles.lineItemValue} ${styles.lineItemDiscount}`}>
              <PaymentMoney amount={discount} currency="USDC" sign="−" />
            </dd>
          </div>
        ) : null}
        <div className={styles.lineItemRow}>
          <dt className={styles.lineItemLabel}>
            {t('payment.pay.fee')}
            {paymentMethod === 'USDC' ? (
              <span className={styles.feeRateTag}>{FEE_PERCENT_DISPLAY}</span>
            ) : null}
          </dt>
          <dd className={styles.lineItemValue}>
            {paymentMethod === 'SAP' ? (
              <span className={styles.feeFreeLabel}>{t('payment.pay.feeFree')}</span>
            ) : (
              <PaymentMoney amount={feeAmount} currency="USDC" size="sm" />
            )}
          </dd>
        </div>
        <div className={styles.lineItemTotal}>
          <dt className={styles.totalLabel}>
            {t('payment.pay.totalPaid', { defaultValue: '实付合计' })}
          </dt>
          <dd>
            {paymentMethod === 'SAP' ? (
              <div className={styles.totalUsdc}>
                <PaymentMoney amount={sapPayAmount} currency="SAP" size="lg" />
              </div>
            ) : (
              <>
                <div className={styles.totalUsdc}>
                  <PaymentMoney amount={displayUsdcTotal} currency="USDC" size="lg" />
                </div>
                {feeAmount > 0 ? (
                  <p className={styles.totalFeeHint}>
                    {t('payment.pay.totalIncludesFee', { percent: FEE_PERCENT_DISPLAY })}
                  </p>
                ) : null}
              </>
            )}
          </dd>
        </div>
      </dl>

      {paymentMethod === 'SAP' ? (
        <div className={styles.sapPayExtras}>
          <div className={styles.sapBalanceInline}>
            <span className="text-slate-400">{t('payment.pay.sapBalance')}</span>
            <span className="font-mono text-xs">
              {sap.configured ? (
                <PaymentMoneyParts num={sap.formatted} unit={sap.symbol} size="sm" />
              ) : (
                <span className="text-slate-500">—</span>
              )}
            </span>
          </div>
          {sapInsufficient ? (
            <div className={styles.sapInsufficientBlock}>
              <p className={styles.sapInsufficientText}>
                {t('payment.pay.sapInsufficient', {
                  need: sapPayAmount.toFixed(2),
                  have: sap.numeric.toFixed(2),
                })}
              </p>
              <Link to="/exchange" className={styles.exchangeLinkBtn}>
                <ArrowRightLeft size={14} aria-hidden />
                {t('payment.pay.goExchange')}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className={styles.payContextBar}>
        <div className={styles.payContextMain}>
          <span className={styles.payContextLabel}>{t('payment.pay.network')}</span>
          <span className={styles.payNetworkPill}>
            {targetChainId ? getPaymentChainLabel(targetChainId) : '—'}
          </span>
        </div>
        {paymentMethod === 'USDC' ? (
          <div className={styles.payContextBalance}>
            <span className={styles.payContextLabel}>{t('payment.pay.balance')}</span>
            <span className={styles.payContextBalanceValue}>
              {usdcConfig ? (
                <PaymentMoneyParts num={usdcFormatted} unit={usdcSymbol} size="sm" />
              ) : (
                t('payment.pay.balanceUnavailable')
              )}
            </span>
          </div>
        ) : null}
      </div>

      {contextAlerts.length > 0 ? (
        <ul className={styles.payContextAlerts}>
          {contextAlerts.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      ) : null}

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
        className={styles.primaryPayBtnLight}
        icon={busy ? <Spin size="small" /> : <ShieldCheck size={16} strokeWidth={2} />}
      >
        {payButtonLabel}
      </Button>

      <p className="mt-3 text-[11px] text-slate-500 text-center leading-relaxed">{t('payment.pay.legalHint')}</p>
    </PaymentGlassCard>
  );
};

export default CheckoutPayPanel;
