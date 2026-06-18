import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PaymentStep, StepStatus } from './stepConfig';
import styles from './PaymentProgressTracker.module.scss';

interface Props {
  step: PaymentStep;
  status: StepStatus;
}

const ProgressStep: React.FC<Props> = ({ step, status }) => {
  const { t } = useTranslation();

  const isActive = status.status === 'active';
  const isDone = status.status === 'done';
  const isError = status.status === 'error';
  const isCancelled = status.status === 'cancelled';

  const getLabel = () => {
    if (isDone) return t(step.doneLabelKey);
    if (isError) return t(step.errorLabelKey);
    return t(step.labelKey);
  };

  const stepClass = [
    styles.stepItem,
    isActive ? styles.active : '',
    isDone ? styles.done : '',
    isError ? styles.error : '',
    isCancelled ? styles.cancelled : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={stepClass} role="listitem">
      {!isDone && !isError ? (
        <span className={styles.stepIcon} aria-hidden>
          <span className={styles.stepIconDot} />
        </span>
      ) : isDone ? (
        <span className={styles.stepIconDone} aria-hidden>
          <span className={styles.stepIconDotDone} />
        </span>
      ) : (
        <span className={styles.stepIconError} aria-hidden>
          <span className={styles.stepIconDotError} />
        </span>
      )}

      <span className={styles.stepLabel}>{getLabel()}</span>

      {isActive ? (
        <span className={styles.stepDots} aria-hidden>
          <span className={styles.stepDotItem} />
          <span className={styles.stepDotItem} />
          <span className={styles.stepDotItem} />
        </span>
      ) : null}

      {isDone ? (
        <span className={styles.stepCheckRight} aria-hidden>
          <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
            <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      ) : null}

      {isError ? (
        <span className={styles.stepCrossRight} aria-hidden>❌</span>
      ) : null}
    </li>
  );
};

export default ProgressStep;
