import React from 'react';
import { Loader2 } from 'lucide-react';
import { useWalletTokenBalances } from '../hooks/useWalletTokenBalances';
import styles from './WalletBalancePanel.module.scss';

type Props = {
  chainId?: number;
  address?: `0x${string}`;
  variant?: 'compact' | 'full';
};

const WalletBalancePanel: React.FC<Props> = ({
  chainId,
  address,
  variant = 'compact',
}) => {
  const {
    nativeSymbol,
    nativeAmount,
    sapAmount,
    isLoading,
    isFetching,
  } = useWalletTokenBalances(chainId, address);

  const rootClass = [
    styles.balanceTable,
    variant === 'full' ? styles.balanceTableFull : styles.balanceTableCompact,
  ].join(' ');

  return (
    <div className={rootClass}>
      {isFetching && !isLoading ? (
        <Loader2 size={13} className={styles.balanceSpinner} aria-hidden />
      ) : null}

      <div className={styles.balanceCol} data-token="native">
        <span className={styles.balanceSymbol}>{nativeSymbol}</span>
        <span className={styles.balanceValue}>
          {isLoading ? <span className={styles.balanceSkeleton} /> : nativeAmount}
        </span>
      </div>

      <div className={styles.balanceCol} data-token="sap">
        <span className={styles.balanceSymbol}>SAP</span>
        <span className={styles.balanceValue}>
          {isLoading ? <span className={styles.balanceSkeleton} /> : sapAmount}
        </span>
      </div>
    </div>
  );
};

export default WalletBalancePanel;
