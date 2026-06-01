import React from 'react';
import { useTranslation } from 'react-i18next';
import { PaymentPhase } from '../types/paymentTypes';
import { getTxExplorerUrl } from '../../../../config/paymentChains';

interface Props {
  phase: PaymentPhase;
  statusMessageKey?: string;
  txHash?: string | null;
  chainId?: number;
  expireAt?: string;
}

const PaymentStatusBanner: React.FC<Props> = ({
  phase,
  statusMessageKey,
  txHash,
  chainId,
  expireAt,
}) => {
  const { t } = useTranslation();

  if (phase === 'idle' && !statusMessageKey) return null;

  const messageKey =
    statusMessageKey ??
    (phase === 'submitting'
      ? 'payment.status.creatingOrder'
      : phase === 'intentLoading'
        ? 'payment.status.preparingIntent'
        : phase === 'approving'
          ? 'payment.status.approving'
          : phase === 'paying'
            ? 'payment.status.paying'
            : phase === 'confirming'
              ? 'payment.status.confirming'
              : phase === 'success'
                ? 'payment.status.success'
                : phase === 'error'
                  ? 'payment.status.error'
                  : null);

  if (!messageKey) return null;

  const explorer =
    txHash && chainId ? getTxExplorerUrl(chainId, txHash) : undefined;

  const tone =
    phase === 'error'
      ? 'border-red-500/40 bg-red-500/10 text-red-200'
      : phase === 'success'
        ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-100'
        : 'border-sky-500/30 bg-sky-500/10 text-sky-100';

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${tone}`} role="status" aria-live="polite">
      <p>{t(messageKey)}</p>
      {expireAt && phase === 'idle' ? (
        <p className="mt-1 text-xs opacity-80">
          {t('payment.status.expireHint', { time: new Date(expireAt).toLocaleString() })}
        </p>
      ) : null}
      {txHash ? (
        <p className="mt-2 text-xs font-mono break-all opacity-90">
          {t('payment.status.txHash')}: {txHash.slice(0, 10)}…{txHash.slice(-8)}
          {explorer ? (
            <>
              {' '}
              <a
                href={explorer}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-inherit hover:opacity-80"
              >
                {t('payment.status.viewExplorer')}
              </a>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
};

export default PaymentStatusBanner;
