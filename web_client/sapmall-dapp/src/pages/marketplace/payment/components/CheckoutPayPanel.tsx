import React, { useEffect, useMemo, useState } from 'react';
import { Button, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { Wallet, ChevronDown, Receipt, CircleAlert } from 'lucide-react';
import { OrderPreviewResult } from '../../../../services/api/orderApi';
import type { PaymentIntentBundle } from '../../../../services/api/orderApi';
import { isPaymentChain } from '../../../../config/paymentChains';
import {
  getAvailablePaymentCurrencies,
  getDefaultPaymentCurrency,
  isOnChainPaySupported,
  isSapPayment,
} from '../../../../config/paymentCurrencies';
import { useChainConfigStore } from '../../../../store/chainConfigStore';
import { usePaymentTokenBalance } from '../hooks/usePaymentTokenBalance';
import { formatUsdcFromRaw, formatAmountNumber } from '../utils/formatPaymentAmount';
import { estimateGasFeeUsdc, isArcTestnetChain } from '../utils/estimateGasFee';
import {
  calcPlatformFeeInToken,
  calcPlatformFeeUsdc,
  calcPayAmountDueInToken,
  calcReferencePlatformFeeUsdc,
  calcTotalDueUsdc,
  NON_SAP_PAYMENT_FEE_RATE,
} from '../utils/paymentFee';
import PaymentMoney from './PaymentMoney';
import PaymentCardHeader from './PaymentCardHeader';
import PaymentCurrencySelect from './PaymentCurrencySelect';
import PaymentCurrencyRatePanel from './PaymentCurrencyRatePanel';
import { PaymentMethod, PaymentPhase } from '../types/paymentTypes';
import PaymentGlassCard from './PaymentGlassCard';
import PaymentProgressTracker from './PaymentProgressTracker/PaymentProgressTracker';
import styles from '../PaymentPage.module.scss';

const FEE_PERCENT_DISPLAY = `${NON_SAP_PAYMENT_FEE_RATE * 100}%`;

interface Props {
  preview: OrderPreviewResult;
  phase: PaymentPhase;
  errorKey: string | null;
  errorDetail?: string | null;
  intent: PaymentIntentBundle | null;
  txHash: string | null;
  paymentMethod: PaymentMethod;
  onPaymentMethodChange: (method: PaymentMethod) => void;
  onPay: () => void;
  onContinuePay?: () => void;
  canRetryPayment?: boolean;
  busy: boolean;
  contactValid: boolean;
}

const CheckoutPayPanel: React.FC<Props> = ({
  preview,
  phase,
  errorKey,
  errorDetail,
  intent,
  txHash,
  paymentMethod,
  onPaymentMethodChange,
  onPay,
  onContinuePay,
  canRetryPayment = false,
  busy,
  contactValid,
}) => {
  const { t } = useTranslation();
  const { isConnected, chainId, address } = useAccount();
  const [detailExpanded, setDetailExpanded] = useState(true);

  const activeChainId = intent?.chainId ?? chainId;
  const chainConfigLoaded = useChainConfigStore((s) => s.loaded);
  const paymentTokenKey = useChainConfigStore((s) => {
    if (activeChainId == null) return '';
    return s
      .getPaymentTokens(activeChainId)
      .map((token) => token.symbol)
      .join('|');
  });
  const tokenBalance = usePaymentTokenBalance(paymentMethod, activeChainId, address);
  const usdcBalance = usePaymentTokenBalance('USDC', activeChainId, address);

  useEffect(() => {
    if (activeChainId == null) return;
    const available = getAvailablePaymentCurrencies(activeChainId);
    if (available.length === 0) return;
    if (!available.includes(paymentMethod)) {
      onPaymentMethodChange(getDefaultPaymentCurrency(activeChainId));
    }
  }, [activeChainId, chainConfigLoaded, paymentTokenKey, onPaymentMethodChange, paymentMethod]);

  const orderPayable = preview.totalAmount;
  const gasFeeUsdc = estimateGasFeeUsdc(activeChainId);
  const showGasRow = gasFeeUsdc > 0 || isArcTestnetChain(activeChainId);
  const platformFeeUsdc = calcPlatformFeeUsdc(orderPayable, paymentMethod);
  const platformFeeInToken = calcPlatformFeeInToken(orderPayable, paymentMethod);
  const referenceFeeUsdc = calcReferencePlatformFeeUsdc(orderPayable);
  const isUsdcPayment = paymentMethod === 'USDC';
  const payAmountDueInToken = calcPayAmountDueInToken(orderPayable, paymentMethod);
  const totalDueUsdc = calcTotalDueUsdc(orderPayable, paymentMethod, gasFeeUsdc);
  const payEquivInToken = isUsdcPayment ? totalDueUsdc : payAmountDueInToken;

  const intentPayAmount = intent
    ? Number.parseFloat(formatUsdcFromRaw(intent.amount, intent.decimals))
    : null;

  const finalTotal =
    isUsdcPayment && intentPayAmount != null ? intentPayAmount : payEquivInToken;
  const finalCurrency = paymentMethod;

  const payAmountDue = isUsdcPayment ? totalDueUsdc : payAmountDueInToken;
  const gasFeeDue = Math.max(0, gasFeeUsdc);
  const needsGasUsdc = !isUsdcPayment && gasFeeDue > 0;

  const tokenInsufficient =
    isConnected &&
    isOnChainPaySupported(paymentMethod, activeChainId) &&
    !tokenBalance.isLoading &&
    tokenBalance.configured &&
    tokenBalance.numeric + 1e-9 < payAmountDue;

  const gasUsdcInsufficient =
    needsGasUsdc &&
    isConnected &&
    !usdcBalance.isLoading &&
    usdcBalance.configured &&
    usdcBalance.numeric + 1e-9 < gasFeeDue;

  const gasUsdcSufficient =
    needsGasUsdc &&
    isConnected &&
    usdcBalance.configured &&
    !usdcBalance.isLoading &&
    usdcBalance.numeric + 1e-9 >= gasFeeDue;

  const hasSufficientBalances =
    isUsdcPayment
      ? !tokenInsufficient
      : !tokenInsufficient && (!needsGasUsdc || gasUsdcSufficient);

  const networkOk =
    isConnected && isPaymentChain(chainId) && (!intent || chainId === intent.chainId);

  const canPayOnChain =
    phase === 'idle' &&
    contactValid &&
    isConnected &&
    networkOk &&
    !busy &&
    isOnChainPaySupported(paymentMethod, activeChainId) &&
    tokenBalance.configured &&
    !tokenBalance.isLoading &&
    tokenBalance.numeric + 1e-9 >= payAmountDue &&
    hasSufficientBalances;

  const isAuthCancelled = phase === 'authCancelled';
  const isPayCancelled = phase === 'payCancelled';
  const isPayError = phase === 'error' && errorKey === 'paymentFailed';
  const canContinuePayment =
    canRetryPayment &&
    isConnected &&
    networkOk &&
    !busy &&
    isOnChainPaySupported(paymentMethod, activeChainId) &&
    tokenBalance.configured &&
    !tokenBalance.isLoading &&
    tokenBalance.numeric + 1e-9 >= payAmountDue &&
    hasSufficientBalances;

  const canSubmit = canPayOnChain || canContinuePayment;

  const payAmountDisplay = formatAmountNumber(finalTotal, finalCurrency);

  const payButtonLabel = busy
    ? t(`payment.pay.buttonBusy.${phase}`)
    : isAuthCancelled
      ? t('payment.pay.continueApprove')
      : isPayCancelled || isPayError
        ? t('payment.pay.continuePay')
        : t('payment.pay.confirmPay', { amount: payAmountDisplay, token: finalCurrency });

  const showContactHint = !contactValid && phase === 'idle';

  const contextAlerts = useMemo(() => {
    const alerts: string[] = [];
    if (!isConnected) alerts.push(t('payment.pay.connectWallet'));
    else if (!networkOk) alerts.push(t('payment.pay.switchNetworkManual'));
    if (isSapPayment(paymentMethod) && !tokenBalance.configured && isConnected) {
      alerts.push(t('payment.pay.sapPayUnavailable'));
    }
    if (!isOnChainPaySupported(paymentMethod, activeChainId) && phase === 'idle') {
      alerts.push(t('payment.pay.tokenPayComingSoon', { token: paymentMethod }));
    }
    return alerts;
  }, [
    isConnected,
    networkOk,
    paymentMethod,
    phase,
    tokenBalance.configured,
    t,
  ]);

  const balanceHintMessages = useMemo(() => {
    const hints: string[] = [];
    const pushUnique = (msg: string) => {
      if (!hints.includes(msg)) hints.push(msg);
    };
    if (tokenInsufficient) {
      pushUnique(
        t('payment.pay.tokenInsufficient', {
          token: isUsdcPayment ? 'USDC' : paymentMethod,
        }),
      );
    }
    if (gasUsdcInsufficient) {
      pushUnique(t('payment.pay.tokenInsufficient', { token: 'USDC' }));
    }
    return hints;
  }, [gasUsdcInsufficient, isUsdcPayment, paymentMethod, tokenInsufficient, t]);

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
          <dt>{t('payment.pay.availableBalance')}</dt>
          <dd className={styles.payAvailableBalancesValue}>
            {tokenBalance.isLoading && isConnected ? (
              <Spin size="small" />
            ) : (
              <span className={styles.payAvailableBalanceItem}>
                <span className={styles.payAvailableBalanceAmount}>{tokenBalance.formatted}</span>
                <span className={styles.payAvailableBalanceUnit}>{tokenBalance.symbol}</span>
              </span>
            )}
          </dd>
        </div>

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
              <PaymentMoney amount={gasFeeUsdc} currency="USDC" sign="+" size="sm" />
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

      {contextAlerts.length > 0 ? (
        <ul className={styles.payContextAlerts}>
          {contextAlerts.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      ) : null}

      <div className={styles.payDetailSection}>
        <button
          type="button"
          className={styles.payDetailHeader}
          onClick={() => setDetailExpanded((v) => !v)}
        >
            <span className={styles.payDetailHeaderLeft}>
              <Receipt size={13} strokeWidth={1.75} className={styles.payDetailHeaderIcon} />
              <span>{t('payment.steps.aria')}</span>
            </span>
          <ChevronDown
            size={14}
            className={`${styles.payDetailChevron} ${detailExpanded ? styles.payDetailChevronOpen : ''}`}
          />
        </button>

        {detailExpanded ? (
          <div className={styles.payDetailBody}>
            <PaymentProgressTracker
              phase={phase}
              errorKey={errorKey}
              errorDetail={errorDetail}
            />
          </div>
        ) : null}
      </div>

      <div className={styles.payFooterBar}>
        {totalSavings > 0 ? (
          <p className={styles.payFooterSavings}>
            {t('payment.pay.totalSaving', { amount: totalSavings.toFixed(2) })}
          </p>
        ) : null}

        {showContactHint ? (
          <div className={styles.payContactHint} role="alert">
            <CircleAlert size={15} strokeWidth={2} className={styles.payContactHintIcon} aria-hidden />
            <span>{t('payment.pay.contactRequired')}</span>
          </div>
        ) : null}

        {balanceHintMessages.map((msg) => (
          <div key={msg} className={styles.payContactHint} role="alert">
            <CircleAlert size={15} strokeWidth={2} className={styles.payContactHintIcon} aria-hidden />
            <span>{msg}</span>
          </div>
        ))}

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
