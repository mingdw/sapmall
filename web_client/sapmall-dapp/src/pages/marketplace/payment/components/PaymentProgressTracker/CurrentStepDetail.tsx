import React from 'react';
import { useTranslation } from 'react-i18next';
import type { PaymentStep } from './stepConfig';
import styles from './PaymentProgressTracker.module.scss';

interface Props {
  currentStep: PaymentStep | null;
  errorKey: string | null;
}

const CurrentStepDetail: React.FC<Props> = ({ currentStep, errorKey }) => {
  const { t } = useTranslation();

  if (!currentStep) return null;

  const getDetailText = () => {
    if (errorKey) {
      return t(`payment.errors.${errorKey}`) || t('payment.status.error');
    }

    if (currentStep.descriptionKey) {
      return t(currentStep.descriptionKey);
    }

    // Fallback to status keys
    const statusKey = `payment.status.${currentStep.key}`;
    const translated = t(statusKey);
    return translated !== statusKey ? translated : t('payment.status.creatingOrder');
  };

  return (
    <div className={styles.stepDetail}>
      <p style={{ margin: 0 }}>{getDetailText()}</p>
    </div>
  );
};

export default CurrentStepDetail;