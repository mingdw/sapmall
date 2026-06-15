import React, { useEffect, useMemo } from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ArrowRightLeft, Wallet } from 'lucide-react';
import { OrderPreviewResult } from '../../../../services/api/orderApi';
import type { PaymentIntentBundle } from '../../../../services/api/orderApi';
import { isPaymentChain } from '../../../../config/paymentChains';
import {
  getAvailablePaymentCurrencies,
  isOnChainPaySupported,
  isSapPayment,
} from '../../../../config/paymentCurrencies';
import { usePaymentTokenBalance } from '../hooks/usePaymentTokenBalance';
import { formatUsdcFromRaw, formatAmountNumber } from '../utils/formatPaymentAmount';
import { estimateGasFeeUsdc, isArcTestnetChain } from '../utils/estimateGasFee';
import {
  calcPlatformFeeInToken,
  calcPlatformFeeUsdc,
  calcReferencePlatformFeeUsdc,
  calcTotalDueInToken,
  calcTotalDueUsdc,
  NON_SAP_PAYMENT_FEE_RATE,
} from '../utils/paymentFee';
import { calcPayAmountInToken } from '../utils/paymentTokenRates';
import PaymentMoney, { PaymentMoneyParts } from './PaymentMoney';
import PaymentCardHeader from './PaymentCardHeader';
import PaymentCurrencySelect from './PaymentCurrencySelect';
import PaymentCurrencyRatePanel from './PaymentCurrencyRatePanel';
import { PaymentMethod, PaymentPhase } from '../types/paymentTypes';
import PaymentGlassCard from './PaymentGlassCard';
import PaymentStatusBanner from './PaymentStatusBanner';
import styles from '../PaymentPage.module.scss';

const FEE_PERCENT_DISPLAY = `${NON_SAP_PAYMENT_FEE_RATE * 100}%`;

interface Props {
  preview: OrderPreviewResult;
  phase: PaymentPhase;
  errorKey: string | null;
  intent: PaymentIntentBundle | null;
  txHash: string | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  onContinuePay?: () => void;
  busy: boolean;
  contactValid: boolean;
}

const CheckoutPayPanel: React.FC<Props> = ({
  preview,
  phase,
  errorKey,
  intent,
  txHash,
  paymentMethod,
  onPaymentMethodChange,
  onPay,
  onContinuePay,
  busy,
  contactValid,
}) => {
  const { t } = useTranslation();
  const { isConnected, chainId, address } = useAccount();

  const activeChainId = intent?.chainId ?? chainId;
  const tokenBalance = usePaymentTokenBalance(paymentMethod, activeChainId, address);

  useEffect(() => {
    if (activeChainId == null) return;
    const available = getAvailablePaymentCurrencies(activeChainId);
    if (!available.includes(paymentMethod)) {
      onPaymentMethodChange(available[0]);
    }
  }, [activeChainId, onPaymentMethodChange, paymentMethod]);

  const orderPayable = preview.totalAmount;
  const gasFeeUsdc = estimateGasFeeUsdc(activeChainId);
  const showGasRow = gasFeeUsdc > 0 || isArcTestnetChain(activeChainId);
  const platformFeeUsdc = calcPlatformFeeUsdc(orderPayable, paymentMethod);
  const platformFeeInToken = calcPlatformFeeInToken(orderPayable, paymentMethod);
  const gasFeeInToken = calcPayAmountInToken(gasFeeUsdc, paymentMethod);
  const referenceFeeUsdc = calcReferencePlatformFeeUsdc(orderPayable);
  const payEquivInToken = calcTotalDueInToken(orderPayable, paymentMethod, gasFeeUsdc);
  const totalDueUsdc = calcTotalDueUsdc(orderPayable, paymentMethod, gasFeeUsdc);

  const intentPayAmount = intent
    ? Number.parseFloat(formatUsdcFromRaw(intent.amount, intent.decimals))
    : null;

  const finalTotal =
    paymentMethod === 'USDC' && intentPayAmount != null ? intentPayAmount : payEquivInToken;
  const finalCurrency = paymentMethod;

  const payAmountDue = payEquivInToken;
  const isUsdcPayment = paymentMethod === 'USDC';

  const tokenInsufficient =
    isConnected &&
    isOnChainPaySupported(paymentMethod) &&
    !tokenBalance.isLoading &&
    tokenBalance.configured &&
    tokenBalance.numeric + 1e-9 < payAmountDue;

  const balanceSufficient =
    !isUsdcPayment &&
    isConnected &&
    tokenBalance.configured &&
    !tokenBalance.isLoading &&
    tokenBalance.numeric + 1e-9 >= payAmountDue;

  const networkOk =
    isConnected && isPaymentChain(chainId) && (!intent || chainId === intent.chainId);

  const canPayOnChain =
    phase === 'idle' &&
    isConnected &&
    networkOk &&
    !busy &&
    isOnChainPaySupported(paymentMethod) &&
    (paymentMethod === 'USDC' || isSapPayment(paymentMethod)) &&
    tokenBalance.configured &&
    !tokenBalance.isLoading &&
    tokenBalance.numeric + 1e-9 >= payAmountDue;

  const isAuthCancelled = phase === 'authCancelled';
  const isPayCancelled = phase === 'payCancelled';
  const canContinuePayment =
    Boolean(intent) &&
    (isAuthCancelled || isPayCancelled) &&
    isConnected &&
    networkOk &&
    !busy &&
    isOnChainPaySupported(paymentMethod) &&
    tokenBalance.configured &&
    !tokenBalance.isLoading &&
    tokenBalance.numeric + 1e-9 >= payAmountDue;

  const canSubmit = canPayOnChain || canContinuePayment;

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

  const payAmountDisplay = formatAmountNumber(finalTotal, finalCurrency);

  const payButtonLabel = busy
    ? t(`payment.pay.buttonBusy.${phase}`)
    : isAuthCancelled
      ? t('payment.pay.continueApprove')
      : isPayCancelled
        ? t('payment.pay.continuePay')
        : t('payment.pay.confirmPay', { amount: payAmountDisplay, token: finalCurrency });

  const contextAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (!isConnected) alerts.push(t('payment.pay.connectWallet'));
    else if (!networkOk) alerts.push(t('payment.pay.switchNetworkManual'));
    if (!contactValid && phase === 'idle') alerts.push(t('payment.pay.contactRequired'));
    if (isSapPayment(paymentMethod) && !tokenBalance.configured && isConnected) {
      alerts.push(t('payment.pay.sapPayUnavailable'));
    }
    if (tokenInsufficient) {
      alerts.push(
        isUsdcPayment
          ? t('payment.pay.usdcInsufficient')
          : t('payment.pay.tokenInsufficient', {
              token: paymentMethod,
              need: payAmountDue.toFixed(2),
              have: tokenBalance.numeric.toFixed(4),
            }),
      );
    }
    if (!isOnChainPaySupported(paymentMethod) && phase === 'idle') {
      alerts.push(t('payment.pay.tokenPayComingSoon', { token: paymentMethod }));
    }
    return alerts;
  }, [contactValid, isConnected, isUsdcPayment, networkOk, paymentMethod, phase, payAmountDue, tokenBalance.configured, tokenBalance.numeric, tokenInsufficient, t]);

  const totalSavings = isSapPayment(paymentMethod) ? referenceFeeUsdc : 0;

  return (
    <PaymentGlassCard className={`p-5 md:p-6 ${styles.payPanelCard}`}>
      <PaymentCardHeader
        icon={<Wallet strokeWidth={1.75} aria-hidden />}
        iconVariant="pay"
        title={t('payment.pay.title')}
      />

      <div className={styles.payDetailBlock}>
        <span className={styles.payDetailLabel}>{t('payment.pay.currency')}</span>
        <PaymentCurrencySelect
          key={activeChainId ?? 'unknown'}
          chainId={activeChainId}
          value={paymentMethod}
          onChange={onPaymentMethodChange}
          disabled={busy || phase !== 'idle'}
        />
        <PaymentCurrencyRatePanel method={paymentMethod} />
      </div>

      <dl className={styles.payBreakdownList}>
        <div className={styles.payBreakdownRow}>
          <dt>{t('payment.pay.orderPayable')}</dt>
          <dd>
            <PaymentMoney amount={orderPayable} currency="USDC" />
          </dd>
        </div>

        {!isSapPayment(paymentMethod) && platformFeeUsdc > 0 ? (
          <div className={styles.payBreakdownRow}>
            <dt>
              {t('payment.pay.feeWithToken', { token: paymentMethod })}
              <span className={styles.feeRateTag}>{FEE_PERCENT_DISPLAY}</span>
            </dt>
            <dd>
              <PaymentMoney
                amount={platformFeeInToken}
                currency={paymentMethod}
                sign="+"
                size="sm"
              />
            </dd>
          </div>
        ) : null}

        {isSapPayment(paymentMethod) && referenceFeeUsdc > 0 ? (
          <div className={`${styles.payBreakdownRow} ${styles.payBreakdownRowSaving}`}>
            <dt>{t('payment.pay.feeSaving')}</dt>
            <dd>
              <PaymentMoney amount={referenceFeeUsdc} currency="USDC" sign="-" size="sm" />
            </dd>
          </div>
        ) : null}

        {showGasRow ? (
          <div className={styles.payBreakdownRow}>
            <dt>{t('payment.pay.estimatedGas')}</dt>
            <dd>
              <PaymentMoney amount={gasFeeInToken} currency={paymentMethod} sign="+" size="sm" />
            </dd>
          </div>
        ) : null}

        <div className={`${styles.payBreakdownRow} ${styles.payBreakdownRowEquiv}`}>
          <dt>{t('payment.pay.payEquivLine')}</dt>
          <dd className={styles.payEquivValueCol}>
            <PaymentMoney amount={payEquivInToken} currency={paymentMethod} size="md" />
            {!isUsdcPayment ? (
              <span className={styles.payEquivUsdcHint}>
                {t('payment.pay.payEquivUsdcHint', { amount: totalDueUsdc.toFixed(2) })}
              </span>
            ) : null}
          </dd>
        </div>
      </dl>

      <div
        className={[
          styles.payBalanceRow,
          isUsdcPayment || balanceSufficient ? styles.payBalanceRowSufficient : '',
          tokenInsufficient && !isUsdcPayment ? styles.payBalanceRowInsufficient : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className={styles.payBalanceLabel}>
          {t('payment.pay.tokenBalance', { token: paymentMethod })}
          {!isUsdcPayment && balanceSufficient ? (
            <span className={styles.payBalanceStatusOk}>{t('payment.pay.balanceSufficient')}</span>
          ) : null}
        </span>
        <span className={styles.payBalanceValue}>
          <PaymentMoneyParts
            num={tokenBalance.formatted}
            unit={tokenBalance.symbol}
            size="sm"
            className={styles.payBalanceAmount}
          />
        </span>
      </div>

      {tokenInsufficient && !isUsdcPayment ? (
        <div className={styles.tokenInsufficientBlock}>
          <p className={styles.tokenInsufficientText}>
            {t('payment.pay.tokenInsufficient', {
              token: paymentMethod,
              need: payAmountDue.toFixed(2),
              have: tokenBalance.numeric.toFixed(4),
            })}
          </p>
          {isSapPayment(paymentMethod) ? (
            <Link to="/exchange" className={styles.exchangeLinkBtn}>
              <ArrowRightLeft size={14} aria-hidden />
              {t('payment.pay.goExchange')}
            </Link>
          ) : null}
        </div>
      ) : null}

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

      <div className={styles.payFooterBar}>
        {totalSavings > 0 ? (
          <p className={styles.payFooterSavings}>
            {t('payment.pay.totalSaving', { amount: totalSavings.toFixed(2) })}
          </p>
        ) : null}

        <Button
          type="primary"
          size="large"
          block
          disabled={!canSubmit}
          onClick={canContinuePayment ? onContinuePay : onPay}
          className={styles.primaryPayBtnLight}
          icon={busy ? <Spin size="small" /> : undefined}
        >
          {payButtonLabel}
        </Button>
      </div>

      <p className={styles.payLegalHint}>{t('payment.pay.legalHint')}</p>
    </PaymentGlassCard>
  );
};

export default CheckoutPayPanel;
