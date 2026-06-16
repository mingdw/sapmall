import React from 'react';
import { PAYMENT_STATUS, paymentStatusTagColor } from '../constants';
import styles from '../PersonalOrderManager.module.scss';

interface Props {
  status: number;
  label?: string;
  className?: string;
}

const STATUS_LABELS: Record<number, string> = {
  [PAYMENT_STATUS.UNPAID]: '未支付',
  [PAYMENT_STATUS.CONFIRMING]: '链上确认中',
  [PAYMENT_STATUS.PAID]: '已支付',
  [PAYMENT_STATUS.CLOSED]: '已关闭',
};

const PaymentStatusTag: React.FC<Props> = ({ status, label, className }) => {
  const text = label || STATUS_LABELS[status] || String(status);
  const color = paymentStatusTagColor(status);

  return (
    <span
      className={`${styles.payBadge} ${className || ''}`}
      style={getTagStyle(color)}
    >
      {text}
    </span>
  );
};

function getTagStyle(color: string): React.CSSProperties {
  const colorMap: Record<string, { color: string; bg: string }> = {
    warning: { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)' },
    processing: { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' },
    success: { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.12)' },
    error: { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    default: { color: '#94a3b8', bg: 'rgba(100, 116, 139, 0.12)' },
  };
  const c = colorMap[color] || colorMap.default;
  return { color: c.color, background: c.bg };
}

export default PaymentStatusTag;
