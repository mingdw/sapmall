import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../PaymentPage.module.scss';

/** 支付完成后的履约步骤（仅结果页展示） */
const RESULT_STEP_KEYS = ['paid', 'confirmed', 'fulfillment'] as const;

const OrderResultStepIndicator: React.FC = () => {
  const { t } = useTranslation();

  return (
    <ol className={styles.stepList} aria-label={t('payment.resultSteps.aria')}>
      {RESULT_STEP_KEYS.map((key, index) => {
        const done = index === 0;
        const current = index === 1;
        return (
          <li
            key={key}
            className={`${styles.stepItem} ${done ? styles.stepDone : ''} ${current ? styles.stepActive : ''}`}
          >
            <span className={styles.stepDot} aria-hidden>
              {done ? '✓' : index + 1}
            </span>
            <span>{t(`payment.resultSteps.${key}`)}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default OrderResultStepIndicator;
