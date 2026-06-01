import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Breadcrumb, Button, Result, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { useCheckoutPreview } from './hooks/useCheckoutPreview';
import { useOrderPayment } from './hooks/useOrderPayment';
import { usePaymentStatusPoll } from './hooks/usePaymentStatusPoll';
import CheckoutOrderSummary from './components/CheckoutOrderSummary';
import CheckoutContactFields from './components/CheckoutContactFields';
import CheckoutPayPanel from './components/CheckoutPayPanel';
import PaymentStepIndicator from './components/PaymentStepIndicator';
import { EMPTY_CONTACT } from './types/paymentTypes';
import { navigateToMarketplace } from '../paths';

const CheckoutPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const skuId = Number(searchParams.get('skuId'));
  const quantity = Number(searchParams.get('quantity') || '1');
  const productCode = searchParams.get('productCode') ?? undefined;

  const { preview, loading, error, reload } = useCheckoutPreview({
    skuId: Number.isFinite(skuId) ? skuId : undefined,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
    productCode,
  });

  const payment = useOrderPayment();
  const [contact, setContact] = useState(EMPTY_CONTACT);

  const pollEnabled = payment.phase === 'confirming' && Boolean(payment.intent?.intentId);
  const { status: pollStatus } = usePaymentStatusPoll(payment.intent?.intentId ?? null, pollEnabled);

  const busy = ['submitting', 'intentLoading', 'approving', 'paying', 'confirming'].includes(payment.phase);

  useEffect(() => {
    if (pollStatus?.paymentStatus === 3 && payment.phase === 'confirming') {
      payment.markSuccess();
      const code = pollStatus.orderCode || payment.orderCode;
      if (code) {
        navigate(`/marketplace/payment/result/${encodeURIComponent(code)}`, {
          replace: true,
          state: {
            txHash: pollStatus.txHash ?? payment.txHash,
            amount: preview?.totalAmount,
            chainId: payment.intent?.chainId,
          },
        });
      }
    }
    if (pollStatus?.paymentStatus === 6) {
      payment.retry();
    }
  }, [pollStatus, payment, navigate, preview?.totalAmount]);

  const breadcrumbItems = useMemo(
    () => [
      { title: <Link to="/marketplace">{t('payment.breadcrumb.mall')}</Link> },
      preview?.items[0]?.productCode
        ? {
            title: (
              <Link to={`/marketplace/product/${encodeURIComponent(preview.items[0].productCode)}`}>
                {preview.items[0].productName}
              </Link>
            ),
          }
        : { title: t('payment.breadcrumb.product') },
      { title: t('payment.breadcrumb.checkout') },
    ],
    [preview, t],
  );

  const handlePay = async () => {
    if (!preview || !Number.isFinite(skuId)) return;
    await payment.startPayment({
      skuId,
      quantity: preview.items[0]?.quantity ?? quantity,
      totalAmount: preview.totalAmount,
    });
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
    <div className="mx-auto w-[95%] max-w-6xl pb-16 pt-6">
      <Breadcrumb className="mb-6 text-sm" items={breadcrumbItems} />
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">{t('payment.title')}</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-2xl">{t('payment.subtitle')}</p>
      </header>

      <PaymentStepIndicator phase={payment.phase} />

      {loading ? (
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
          <div className="lg:col-span-7 space-y-0">
            <CheckoutOrderSummary item={preview.items[0]} />
            <CheckoutContactFields contact={contact} onChange={setContact} />
          </div>
          <div className="lg:col-span-5">
            <CheckoutPayPanel
              preview={preview}
              phase={payment.phase}
              errorKey={payment.errorKey}
              intent={payment.intent}
              txHash={payment.txHash}
              onPay={handlePay}
              busy={busy}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
