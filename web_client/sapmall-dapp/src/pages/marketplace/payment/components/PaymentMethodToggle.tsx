import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentMethod } from '../types/paymentTypes';
import styles from '../PaymentPage.module.scss';

interface Props {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

/** 与早期应付明细一致的 USDC / SAP 大按钮切换 */
const PaymentMethodToggle: React.FC<Props> = ({ value, onChange }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.payMethodGroup} role="radiogroup" aria-label={t('payment.pay.methodAria')}>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'USDC'}
        className={`${styles.payMethodChip} ${value === 'USDC' ? styles.payMethodChipActive : ''}`}
        onClick={() => onChange('USDC')}
      >
        <span className={styles.payMethodName}>{t('payment.pay.methodUsdc')}</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'SAP'}
        className={`${styles.payMethodChip} ${value === 'SAP' ? styles.payMethodChipActive : ''}`}
        onClick={() => onChange('SAP')}
      >
        <span className={styles.payMethodName}>{t('payment.pay.methodSap')}</span>
      </button>
    </div>
  );
};

export default PaymentMethodToggle;
