import React from 'react';
import styles from '../PaymentPage.module.scss';

interface PaymentGlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div';
}

const PaymentGlassCard: React.FC<PaymentGlassCardProps> = ({
  children,
  className = '',
  as: Tag = 'section',
}) => <Tag className={`${styles.glassCard} ${className}`}>{children}</Tag>;

export default PaymentGlassCard;
