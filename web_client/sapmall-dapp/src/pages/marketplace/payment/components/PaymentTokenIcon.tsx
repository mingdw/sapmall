import React from 'react';
import styles from '../PaymentPage.module.scss';

const TOKEN_COLORS: Record<string, { bg: string; emoji: string }> = {
  SAP: { bg: '#5b21b6', emoji: '◈' },
  USDT: { bg: '#0d9488', emoji: '₮' },
  USDC: { bg: '#1d4ed8', emoji: '◎' },
  BUSD: { bg: '#a16207', emoji: 'B' },
  DAI: { bg: '#b45309', emoji: '◇' },
  BNB: { bg: '#ca8a04', emoji: '◆' },
  SOL: { bg: '#7c3aed', emoji: '✦' },
  EURC: { bg: '#1e40af', emoji: '€' },
  cirBTC: { bg: '#c2410c', emoji: '₿' },
};

interface Props {
  symbol: string;
}

/** 结算页币种纯图标（小尺寸、无渐变光晕） */
const PaymentTokenIcon: React.FC<Props> = ({ symbol }) => {
  const config = TOKEN_COLORS[symbol] ?? TOKEN_COLORS.SAP;
  return (
    <span className={styles.payTokenIcon} style={{ backgroundColor: config.bg }} aria-hidden>
      {config.emoji}
    </span>
  );
};

export default PaymentTokenIcon;
