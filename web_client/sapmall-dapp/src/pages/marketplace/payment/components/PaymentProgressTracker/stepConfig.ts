import type { PaymentPhase } from '../../types/paymentTypes';

export type PaymentStepKey = 'confirm' | 'create' | 'approve' | 'pay' | 'confirming' | 'success';

export interface PaymentStep {
  key: PaymentStepKey;
  labelKey: string; // 进行中 i18n key
  doneLabelKey: string; // 完成后 i18n key
  errorLabelKey: string; // 失败 i18n key
  icon: string; // emoji icon
  descriptionKey?: string; // optional description i18n key
}

export const PAYMENT_STEPS: readonly PaymentStep[] = [
  {
    key: 'confirm',
    labelKey: 'payment.steps.confirm',
    doneLabelKey: 'payment.steps.confirmDone',
    errorLabelKey: 'payment.steps.confirmError',
    icon: '📋',
  },
  {
    key: 'create',
    labelKey: 'payment.steps.create',
    doneLabelKey: 'payment.steps.createDone',
    errorLabelKey: 'payment.steps.createError',
    icon: '📝',
    descriptionKey: 'payment.steps.createDesc',
  },
  {
    key: 'approve',
    labelKey: 'payment.steps.approve',
    doneLabelKey: 'payment.steps.approveDone',
    errorLabelKey: 'payment.steps.approveError',
    icon: '🔓',
    descriptionKey: 'payment.steps.approveDesc',
  },
  {
    key: 'pay',
    labelKey: 'payment.steps.pay',
    doneLabelKey: 'payment.steps.payDone',
    errorLabelKey: 'payment.steps.payError',
    icon: '💳',
    descriptionKey: 'payment.steps.payDesc',
  },
  {
    key: 'confirming',
    labelKey: 'payment.steps.confirming',
    doneLabelKey: 'payment.steps.confirmingDone',
    errorLabelKey: 'payment.steps.confirmingError',
    icon: '⏳',
    descriptionKey: 'payment.steps.confirmingDesc',
  },
  {
    key: 'success',
    labelKey: 'payment.steps.success',
    doneLabelKey: 'payment.steps.success',
    errorLabelKey: 'payment.steps.confirmError',
    icon: '✨',
  },
] as const;

export interface StepStatus {
  status: 'pending' | 'active' | 'done' | 'error' | 'cancelled';
  timestamp?: string;
  errorKey?: string;
}

const ERROR_TO_STEP: Partial<Record<string, PaymentStepKey>> = {
  invalidParams: 'confirm',
  previewFailed: 'confirm',
  walletNotConnected: 'approve',
  wrongNetwork: 'approve',
  paymentFailed: 'pay',
  authRejected: 'approve',
  payRejected: 'pay',
};

export function getStepStatus(
  phase: PaymentPhase,
  errorKey: string | null,
  stepIndex: number
): StepStatus {
  const phaseToIndex: Record<PaymentPhase, number> = {
    idle: 0,
    submitting: 1,
    intentLoading: 1,
    approving: 2,
    paying: 3,
    confirming: 4,
    success: 5,
    authCancelled: 2,
    payCancelled: 3,
    error: -1,
  };

  const currentStepIndex = phaseToIndex[phase];

  // Cancelled states
  if (phase === 'authCancelled' && stepIndex === 2) {
    return { status: 'cancelled' };
  }
  if (phase === 'payCancelled' && stepIndex === 3) {
    return { status: 'cancelled' };
  }

  // Error state - only mark the failed step as error
  if (phase === 'error' && errorKey) {
    const failedKey = ERROR_TO_STEP[errorKey] ?? 'pay';
    const failedIndex = PAYMENT_STEPS.findIndex((s) => s.key === failedKey);

    if (stepIndex < failedIndex) {
      return { status: 'done' };
    }
    if (stepIndex === failedIndex) {
      return { status: 'error', errorKey };
    }
    return { status: 'pending' };
  }

  // Done
  if (stepIndex < currentStepIndex) {
    return { status: 'done' };
  }

  // Active
  if (stepIndex === currentStepIndex) {
    return { status: 'active' };
  }

  // Pending
  return { status: 'pending' };
}

export function getCurrentStepKey(phase: PaymentPhase): PaymentStepKey | null {
  const phaseToKey: Record<PaymentPhase, PaymentStepKey> = {
    idle: 'confirm',
    submitting: 'create',
    intentLoading: 'create',
    approving: 'approve',
    paying: 'pay',
    confirming: 'confirming',
    success: 'success',
    authCancelled: 'approve',
    payCancelled: 'pay',
    error: 'confirm',
  };

  return phaseToKey[phase] ?? null;
}

export function getStepIndexByKey(key: PaymentStepKey): number {
  return PAYMENT_STEPS.findIndex((step) => step.key === key);
}