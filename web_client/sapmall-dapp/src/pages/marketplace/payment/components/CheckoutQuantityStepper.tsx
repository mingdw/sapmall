import React from 'react';
import { Minus, Plus } from 'lucide-react';
import styles from '../PaymentPage.module.scss';

interface Props {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const CheckoutQuantityStepper: React.FC<Props> = ({
  value,
  min = 1,
  max = 99,
  disabled,
  onChange,
}) => {
  const dec = () => {
    if (disabled || value <= min) return;
    onChange(value - 1);
  };
  const inc = () => {
    if (disabled || value >= max) return;
    onChange(value + 1);
  };

  return (
    <div className={styles.qtyStepper}>
      <button
        type="button"
        className={styles.qtyStepperBtn}
        onClick={dec}
        disabled={disabled || value <= min}
        aria-label="decrease"
      >
        <Minus size={14} strokeWidth={2.5} />
      </button>
      <span className={styles.qtyStepperValue}>{value}</span>
      <button
        type="button"
        className={styles.qtyStepperBtn}
        onClick={inc}
        disabled={disabled || value >= max}
        aria-label="increase"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default CheckoutQuantityStepper;
