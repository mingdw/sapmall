import React from 'react';
import { WalletOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { MOCK_MY_GOVERNANCE } from '../mocks/proposals.mock';
import styles from './WalletVotingPower.module.scss';

interface WalletVotingPowerProps {
  compact?: boolean;
}

const WalletVotingPower: React.FC<WalletVotingPowerProps> = ({ compact }) => {
  const { t } = useTranslation();
  const { isConnected, address } = useAccount();
  const power = MOCK_MY_GOVERNANCE.votingPower;
  const wrapCls = `${styles.wrap} ${compact ? styles.compact : ''}`;

  if (!isConnected) {
    return (
      <span className={wrapCls} role="group">
        <span className={styles.iconWrap}>
          <WalletOutlined className={styles.icon} aria-hidden />
        </span>
        <span className={styles.text}>
          <span className={styles.label}>{t('dao.wallet.connectPrompt')}</span>
          <span className={styles.hint}>{t('dao.wallet.connectHint')}</span>
        </span>
      </span>
    );
  }

  return (
    <span className={`${wrapCls} ${styles.connected}`} role="group">
      <span className={styles.iconWrap}>
        <WalletOutlined className={styles.icon} aria-hidden />
      </span>
      <span className={styles.text}>
        <span className={styles.label}>{t('dao.wallet.votingPower')}</span>
        <span className={styles.power}>{power.toLocaleString()} SAP</span>
        {!compact && address && (
          <span className={styles.address}>
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        )}
      </span>
    </span>
  );
};

export default WalletVotingPower;
