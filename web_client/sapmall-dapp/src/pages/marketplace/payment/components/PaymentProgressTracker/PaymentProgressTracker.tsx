import React, { useMemo } from 'react';
import type { PaymentPhase } from '../../types/paymentTypes';
import { PAYMENT_STEPS, getStepStatus, type StepStatus } from './stepConfig';
import ProgressStep from './ProgressStep';
import styles from './PaymentProgressTracker.module.scss';

interface Props {
  phase: PaymentPhase;
  errorKey: string | null;
  errorDetail?: string | null;
}

const PaymentProgressTracker: React.FC<Props> = ({ phase, errorKey, errorDetail }) => {
  const visibleSteps = useMemo(() => {
    return PAYMENT_STEPS.reduce<{ step: (typeof PAYMENT_STEPS)[number]; status: StepStatus }[]>(
      (acc, step, i) => {
        const stepStatus = getStepStatus(phase, errorKey, i);
        if (stepStatus.status !== 'pending') {
          acc.push({ step, status: stepStatus });
        }
        return acc;
      },
      [],
    );
  }, [phase, errorKey]);

  const failedStep = visibleSteps.find((s) => s.status.status === 'error');

  if (visibleSteps.length === 0) return null;

  return (
    <div className={styles.trackerContainer}>
      <ol className={styles.stepsList} role="list">
        {visibleSteps.map(({ step, status }) => (
          <ProgressStep key={step.key} step={step} status={status} />
        ))}
      </ol>
      {failedStep && errorDetail ? (
        <p className={styles.trackerErrorDetail} role="alert">{errorDetail}</p>
      ) : null}
    </div>
  );
};

export default PaymentProgressTracker;
