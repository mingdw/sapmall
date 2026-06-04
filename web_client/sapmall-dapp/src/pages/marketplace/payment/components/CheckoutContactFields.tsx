import React, { useEffect, useMemo } from 'react';
import { Input, Select, Space } from 'antd';
import type { DefaultOptionType } from 'antd/es/select';
import { Mail, Phone, Truck, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPhoneCountryNativeName } from '../../../../config/phoneCountryNativeNames';
import {
  DEFAULT_PHONE_COUNTRY,
  getPhoneDialCode,
  isPhoneCountryCode,
  PHONE_COUNTRY_CODES,
  type PhoneCountryCode,
} from '../../../../config/phoneCountryCodes';
import { CheckoutContactDraft } from '../types/paymentTypes';
import PaymentGlassCard from './PaymentGlassCard';
import PaymentCardHeader from './PaymentCardHeader';
import styles from '../PaymentPage.module.scss';

interface Props {
  contact: CheckoutContactDraft;
  onChange: (next: CheckoutContactDraft) => void;
  showErrors?: boolean;
}

function buildCountryOption(item: (typeof PHONE_COUNTRY_CODES)[number]): DefaultOptionType {
  const code = item.code;
  const nativeName = getPhoneCountryNativeName(code);
  return {
    value: code,
    label: `+${item.dial} ${nativeName}`,
    dialLabel: `+${item.dial}`,
    nativeName,
  };
}

const CheckoutContactFields: React.FC<Props> = ({ contact, onChange, showErrors }) => {
  const { t } = useTranslation();
  const emailInvalid = showErrors && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim());
  const phoneInvalid = showErrors && contact.phone.trim().length < 6;

  const phoneCountry: PhoneCountryCode = isPhoneCountryCode(contact.phoneCountry)
    ? contact.phoneCountry
    : DEFAULT_PHONE_COUNTRY;

  useEffect(() => {
    if (!isPhoneCountryCode(contact.phoneCountry)) {
      onChange({ ...contact, phoneCountry: DEFAULT_PHONE_COUNTRY });
    }
    // 仅补齐历史草稿缺少的区号字段
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countryOptions = useMemo(
    () => PHONE_COUNTRY_CODES.map((item) => buildCountryOption(item)),
    [],
  );

  const renderCountryLabel = (code: PhoneCountryCode) => (
    <span className={styles.phoneCountryDial}>+{getPhoneDialCode(code)}</span>
  );

  return (
    <PaymentGlassCard className="p-5 md:p-6">
      <PaymentCardHeader
        icon={<Truck strokeWidth={1.75} aria-hidden />}
        iconVariant="contact"
        title={t('payment.contact.title')}
      />

      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${styles.contactField}`}>
        <div className="md:col-span-2">
          <label htmlFor="checkout-name" className={styles.fieldLabel}>
            {t('payment.contact.recipientName')}
            <span className={styles.required}>*</span>
          </label>
          <Input
            id="checkout-name"
            prefix={<User size={15} className={styles.inputPrefixIcon} />}
            value={contact.recipientName}
            placeholder={t('payment.contact.recipientNamePlaceholder')}
            onChange={(e) => onChange({ ...contact, recipientName: e.target.value })}
            status={showErrors && !contact.recipientName.trim() ? 'error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="checkout-email" className={styles.fieldLabel}>
            {t('payment.contact.email')}
            <span className={styles.required}>*</span>
          </label>
          <Input
            id="checkout-email"
            type="email"
            autoComplete="email"
            className={styles.contactEmailInput}
            prefix={<Mail size={15} className={styles.inputPrefixIcon} />}
            value={contact.email}
            placeholder={t('payment.contact.emailPlaceholder')}
            onChange={(e) => onChange({ ...contact, email: e.target.value })}
            status={emailInvalid ? 'error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="checkout-phone" className={styles.fieldLabel}>
            {t('payment.contact.phone')}
            <span className={styles.required}>*</span>
          </label>
          <Space.Compact block className={styles.phoneCompact}>
            <Select
              id="checkout-phone-country"
              className={styles.phoneCountrySelect}
              classNames={{ popup: { root: styles.phoneCountryDropdown } }}
              popupClassName={styles.phoneCountryDropdown}
              styles={{
                popup: {
                  root: {
                    backgroundColor: 'rgba(15, 23, 42, 0.98)',
                    border: '1px solid rgba(71, 85, 105, 0.55)',
                    borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(2, 6, 23, 0.45)',
                    minWidth: 168,
                  },
                },
              }}
              value={phoneCountry}
              options={countryOptions}
              labelRender={() => renderCountryLabel(phoneCountry)}
              optionRender={(option) => (
                <span className={styles.phoneCountryOption}>
                  <span className={styles.phoneCountryDial}>+{getPhoneDialCode(option.value as PhoneCountryCode)}</span>
                  <span className={styles.phoneCountryName}>
                    {getPhoneCountryNativeName(option.value as PhoneCountryCode)}
                  </span>
                </span>
              )}
              onChange={(code) => {
                if (isPhoneCountryCode(code)) {
                  onChange({ ...contact, phoneCountry: code });
                }
              }}
              aria-label={t('payment.contact.phoneCountryAria')}
            />
            <Input
              id="checkout-phone"
              className={styles.phoneLocalInput}
              prefix={<Phone size={15} className={styles.inputPrefixIcon} />}
              value={contact.phone}
              inputMode="tel"
              autoComplete="tel-national"
              placeholder={t('payment.contact.phonePlaceholder')}
              onChange={(e) => onChange({ ...contact, phone: e.target.value })}
              status={phoneInvalid ? 'error' : undefined}
            />
          </Space.Compact>
        </div>
      </div>
    </PaymentGlassCard>
  );
};

export default CheckoutContactFields;
