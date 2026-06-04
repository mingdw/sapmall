import React from 'react';
import { formatAmountNumber } from '../utils/formatPaymentAmount';
import styles from '../PaymentPage.module.scss';

export type PaymentMoneySize = 'sm' | 'md' | 'lg';

export interface PaymentMoneyProps {
  amount: number;
  currency: string;
  /** 展示在数字前的符号，如折扣行的 − */
  sign?: string;
  size?: PaymentMoneySize;
  className?: string;
}

/** 余额等场景：数字与单位已分别格式化 */
export interface PaymentMoneyPartsProps {
  num: string;
  unit: string;
  size?: PaymentMoneySize;
  className?: string;
}

const sizeClass: Record<PaymentMoneySize, string> = {
  sm: styles.amountSizeSm,
  md: styles.amountSizeMd,
  lg: styles.amountSizeLg,
};

export const PaymentMoney: React.FC<PaymentMoneyProps> = ({
  amount,
  currency,
  sign,
  size = 'md',
  className,
}) => (
  <span className={[styles.amountWrap, sizeClass[size], className].filter(Boolean).join(' ')}>
    {sign ? <span className={styles.amountSign}>{sign}</span> : null}
    <span className={styles.amountNum}>{formatAmountNumber(amount, currency)}</span>
    <span className={styles.amountUnit}>{currency}</span>
  </span>
);

export const PaymentMoneyParts: React.FC<PaymentMoneyPartsProps> = ({
  num,
  unit,
  size = 'md',
  className,
}) => (
  <span className={[styles.amountWrap, sizeClass[size], className].filter(Boolean).join(' ')}>
    <span className={styles.amountNum}>{num}</span>
    <span className={styles.amountUnit}>{unit}</span>
  </span>
);

export default PaymentMoney;
