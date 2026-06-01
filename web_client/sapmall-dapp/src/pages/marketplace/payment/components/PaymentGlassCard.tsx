import React from 'react';

interface PaymentGlassCardProps {
  children: React.ReactNode;
  className?: string;
  as?: 'section' | 'div';
}

/** 商城支付页通用玻璃卡片容器 */
const PaymentGlassCard: React.FC<PaymentGlassCardProps> = ({
  children,
  className = '',
  as: Tag = 'section',
}) => (
  <Tag
    className={`rounded-xl border border-slate-600/40 bg-white/[0.04] backdrop-blur-md shadow-lg shadow-black/10 ${className}`}
  >
    {children}
  </Tag>
);

export default PaymentGlassCard;
