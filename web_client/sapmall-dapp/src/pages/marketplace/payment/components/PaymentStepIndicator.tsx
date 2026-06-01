import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPhase } from '../types/paymentTypes';
import styles from '../PaymentPage.module.scss';

const STEP_KEYS = ['confirm', 'create', 'approve', 'pay', 'confirming'] as const;

function phaseToStepIndex(phase: PaymentPhase): number {
  switch (phase) {
    case 'idle':
      return 0;
    case 'submitting':
      return 1;
    case 'intentLoading':
      return 1;
    case 'approving':
      return 2;
    case 'paying':
      return 3;
    case 'confirming':
    case 'success':
      return 4;
    default:
      return 0;
  }
}

interface Props {
  phase: PaymentPhase;
}

const PaymentStepIndicator: React.FC<Props> = ({ phase }) => {
  const { t } = useTranslation();
  const active = phaseToStepIndex(phase);
  const isError = phase === 'error';

  return (
    <ol className={styles.stepList} aria-label={t('payment.steps.aria')}>
      {STEP_KEYS.map((key, index) => {
        const done = !isError && index < active;
        const current = !isError && index === active;
        return (
          <li
            key={key}
            className={`${styles.stepItem} ${done ? styles.stepDone : ''} ${current ? styles.stepActive : ''}`}
          >
            <span className={styles.stepDot} aria-hidden>
              {done ? '✓' : index + 1}
            </span>
            <span className={styles.stepLabel}>{t(`payment.steps.${key}`)}</span>
          </li>
        );
      })}
    </ol>
  );
};

export default PaymentStepIndicator;
