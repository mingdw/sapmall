import React from 'react';
import { Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { CheckoutContactDraft } from '../types/paymentTypes';
import PaymentGlassCard from './PaymentGlassCard';
import styles from '../PaymentPage.module.scss';

interface Props {
  contact: CheckoutContactDraft;
  onChange: (next: CheckoutContactDraft) => void;
}

/** 预留自动发货联系信息（MVP 仅展示，暂不参与下单） */
const CheckoutContactFields: React.FC<Props> = ({ contact, onChange }) => {
  const { t } = useTranslation();

  return (
    <PaymentGlassCard className="p-5 md:p-6 mt-4">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-base font-semibold text-slate-100">{t('payment.contact.title')}</h2>
        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
          {t('payment.contact.comingSoon')}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-4">{t('payment.contact.hint')}</p>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${styles.contactField}`}>
        <div>
          <label htmlFor="checkout-email" className="block text-sm text-slate-400 mb-1.5">
            {t('payment.contact.email')}
          </label>
          <Input
            id="checkout-email"
            type="email"
            value={contact.email}
            disabled
            placeholder={t('payment.contact.emailPlaceholder')}
            onChange={(e) => onChange({ ...contact, email: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor="checkout-phone" className="block text-sm text-slate-400 mb-1.5">
            {t('payment.contact.phone')}
          </label>
          <Input
            id="checkout-phone"
            value={contact.phone}
            disabled
            placeholder={t('payment.contact.phonePlaceholder')}
            onChange={(e) => onChange({ ...contact, phone: e.target.value })}
          />
        </div>
      </div>
    </PaymentGlassCard>
  );
};

export default CheckoutContactFields;
