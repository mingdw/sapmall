import React from 'react';
import { useTranslation } from 'react-i18next';
import { OrderPreviewItem } from '../../../../services/api/orderApi';
import { formatUsdcDisplay } from '../utils/formatPaymentAmount';
import PaymentGlassCard from './PaymentGlassCard';

interface Props {
  item: OrderPreviewItem;
}

const CheckoutOrderSummary: React.FC<Props> = ({ item }) => {
  const { t } = useTranslation();

  return (
    <PaymentGlassCard className="p-5 md:p-6">
      <h2 className="text-base font-semibold text-slate-100 mb-4">{t('payment.summary.title')}</h2>
      <div className="flex gap-4">
        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-800/80 border border-slate-600/30">
          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.productName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
              {t('payment.summary.noImage')}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-slate-100 font-medium leading-snug line-clamp-2">{item.productName}</p>
          {item.specText ? (
            <p className="mt-1 text-sm text-slate-400">{item.specText}</p>
          ) : null}
          <p className="mt-2 text-xs text-slate-500 font-mono">{item.skuCode}</p>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-sm">
            <span className="text-slate-400">
              {t('payment.summary.unitPrice')}: {formatUsdcDisplay(item.unitPrice)}
            </span>
            <span className="text-slate-400">
              {t('payment.summary.quantity')}: ×{item.quantity}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-slate-600/30 flex justify-between text-sm">
        <span className="text-slate-400">{t('payment.summary.subtotal')}</span>
        <span className="text-slate-100 font-medium">{formatUsdcDisplay(item.subtotal)}</span>
      </div>
      <p className="mt-3 text-xs text-slate-500 leading-relaxed">{t('payment.summary.deliveryHint')}</p>
    </PaymentGlassCard>
  );
};

export default CheckoutOrderSummary;
