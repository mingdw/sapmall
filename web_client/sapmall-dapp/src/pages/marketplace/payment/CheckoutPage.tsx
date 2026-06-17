import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Button, Result, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCheckoutPreview } from './hooks/useCheckoutPreview';
import { useOrderPayment } from './hooks/useOrderPayment';
import { usePaymentStatusPoll } from './hooks/usePaymentStatusPoll';
import CheckoutOrderSummary from './components/CheckoutOrderSummary';
import CheckoutContactFields from './components/CheckoutContactFields';
import CheckoutPayPanel from './components/CheckoutPayPanel';
import { EMPTY_CONTACT, PaymentMethod } from './types/paymentTypes';
import { isOnChainPaySupported, isSapPayment } from '../../../config/paymentCurrencies';
import { navigateToMarketplace } from '../paths';
import MessageUtils from '../../../utils/messageUtils';
import { buildCreateOrderPayload } from './utils/buildCreateOrderPayload';
import { estimateGasFeeUsdc } from './utils/estimateGasFee';
import styles from './PaymentPage.module.scss';

function isContactValid(contact: typeof EMPTY_CONTACT): boolean {
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const phoneOk = contact.phone.trim().length >= 6;
  const nameOk = contact.recipientName.trim().length >= 1;
  return emailOk && phoneOk && nameOk;
}

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const skuId = Number(searchParams.get('skuId'));
  const initialQty = Number(searchParams.get('quantity') || '1');
  const productCode = searchParams.get('productCode') ?? undefined;
  const [orderQty, setOrderQty] = useState(
    Number.isFinite(initialQty) && initialQty > 0 ? initialQty : 1,
  );

  const { preview, loading, refreshing, error, reload } = useCheckoutPreview({
    skuId: Number.isFinite(skuId) ? skuId : undefined,
    quantity: orderQty,
    productCode,
  });

  const payment = useOrderPayment();
  const [contact, setContact] = useState(EMPTY_CONTACT);
  const [contactTouched, setContactTouched] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('USDC');
  const [buyerMessage, setBuyerMessage] = useState('');

  const pollEnabled = payment.phase === 'confirming' && Boolean(payment.orderCode);
  const { status: pollStatus } = usePaymentStatusPoll(payment.orderCode, payment.txHash, pollEnabled);

  const busy = ['submitting', 'intentLoading', 'approving', 'paying', 'confirming'].includes(payment.phase);
  const contactValid = isContactValid(contact);

  useEffect(() => {
    if (pollStatus?.paymentStatus === 3 && payment.phase === 'confirming') {
      payment.markSuccess();
      const code = pollStatus.orderCode || payment.orderCode;
      if (code) {
        const chainId = payment.intent?.chainId ?? payment.chainId;
        navigate(`/marketplace/payment/result/${encodeURIComponent(code)}`, {
          replace: true,
          state: {
            txHash: pollStatus.txHash ?? payment.txHash,
            amount: payment.paidAmount ?? preview?.totalAmount,
            chainId,
            items: preview?.items,
            goodsAmount: preview?.totalAmount,
            gasFeeUsdc: estimateGasFeeUsdc(chainId),
          },
        });
      }
    }
    if (pollStatus?.paymentStatus === 4) {
      payment.retry();
    }
  }, [pollStatus, payment, navigate, preview?.totalAmount]);

  const handleBack = useCallback(() => {
    const code = preview?.items[0]?.productCode ?? productCode;
    if (code) {
      navigate(`/marketplace/product/${encodeURIComponent(code)}`);
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigateToMarketplace(navigate);
  }, [navigate, preview?.items, productCode]);

  const handlePay = async () => {
    if (!preview || !Number.isFinite(skuId) || !payment.address) return;
    if (
      payment.intent &&
      (payment.phase === 'authCancelled' || payment.phase === 'payCancelled')
    ) {
      await payment.continuePayment();
      return;
    }
    setContactTouched(true);
    if (!isContactValid(contact)) return;
    if (isSapPayment(paymentMethod)) {
      MessageUtils.info(t('payment.pay.sapPayComingSoon'));
      return;
    }
    if (!isOnChainPaySupported(paymentMethod)) {
      MessageUtils.info(t('payment.pay.tokenPayComingSoon', { token: paymentMethod }));
      return;
    }
    const createPayload = buildCreateOrderPayload({
      preview,
      skuId,
      quantity: preview.items[0]?.quantity ?? orderQty,
      payerAddress: payment.address,
      chainId: payment.chainId,
      paymentMethod,
      contact,
      buyerMessage,
    });
    await payment.startPayment(createPayload);
  };

  if (!Number.isFinite(skuId) || skuId <= 0) {
    return (
      <div className="mx-auto w-[95%] max-w-3xl py-16">
        <Result
          status="warning"
          title={t('payment.errors.invalidParams')}
          extra={
            <Button type="primary" onClick={() => navigateToMarketplace(navigate)}>
              {t('payment.actions.backToMall')}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className={`mx-auto w-[95%] max-w-6xl pb-16 pt-6 ${styles.pageShell}`}>
      <div className={styles.pageGlow} aria-hidden />
      <div className={styles.pageInner}>
        <header className={styles.pageHeader}>
          <div className={styles.pageHeaderRow}>
            <h1 className={styles.checkoutBrandBlock}>
              <span className={styles.checkoutBrandName}>{t('payment.brandName')}</span>
              <span className={styles.checkoutTitleSep} aria-hidden>
                ·
              </span>
              <span className={styles.checkoutStepTitle}>{t('payment.title')}</span>
            </h1>
            <Button
              type="text"
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              className={styles.backBtn}
              onClick={handleBack}
            >
              {t('payment.actions.backToPrevious')}
            </Button>
          </div>
        </header>

        {loading && !preview ? (
          <div className="flex justify-center py-24">
            <Spin size="large" tip={t('payment.loading')} />
          </div>
        ) : error || !preview?.items.length ? (
          <Result
            status="error"
            title={t('payment.errors.previewFailed')}
            subTitle={error ?? ''}
            extra={
              <>
                <Button onClick={reload}>{t('payment.actions.retry')}</Button>
                <Button type="primary" onClick={() => navigateToMarketplace(navigate)}>
                  {t('payment.actions.backToMall')}
                </Button>
              </>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            <div className="lg:col-span-8 flex flex-col">
              <CheckoutContactFields
                contact={contact}
                onChange={setContact}
                showErrors={contactTouched}
              />
              <CheckoutOrderSummary
                items={preview.items}
                preview={preview}
                buyerMessage={buyerMessage}
                onBuyerMessageChange={setBuyerMessage}
                quantity={orderQty}
                onQuantityChange={setOrderQty}
                quantityDisabled={busy || Boolean(payment.intent)}
                previewRefreshing={refreshing}
              />
            </div>
            <div className="lg:col-span-4">
              <CheckoutPayPanel
                preview={preview}
                phase={payment.phase}
                errorKey={payment.errorKey}
                intent={payment.intent}
                txHash={payment.txHash}
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                onPay={handlePay}
                onContinuePay={() => payment.continuePayment()}
                busy={busy}
                contactValid={contactValid}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
