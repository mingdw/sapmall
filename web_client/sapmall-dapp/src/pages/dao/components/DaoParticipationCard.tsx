import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { FilePlus, MessagesSquare, UserRound } from 'lucide-react';
import { useAccount } from 'wagmi';
import styles from '../DaoPage.module.scss';

type Props = {
  onCreateProposal: () => void;
  onStartDiscussion: () => void;
  onVote: () => void;
};

const shortenAddress = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

const DaoParticipationCard: React.FC<Props> = ({ onCreateProposal, onStartDiscussion, onVote }) => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();

  return (
    <aside className={`${styles.panelCard} ${styles.sidebarCard}`} aria-labelledby="dao-participation-title">
      <h2 id="dao-participation-title" className={styles.sidebarTitle}>
        <UserRound className={styles.sidebarTitleIcon} strokeWidth={2.25} aria-hidden />
        <span>{t('dao.sidebar.title')}</span>
      </h2>

      {!isConnected || !address ? (
        <>
          <p className={styles.sidebarHint}>{t('dao.sidebar.connectHint')}</p>
          <ConnectButton.Custom>
            {({ openConnectModal, mounted, authenticationStatus }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              return (
                <button
                  type="button"
                  className={styles.connectBtn}
                  disabled={!ready}
                  onClick={openConnectModal}
                >
                  {t('dao.sidebar.connectWallet')}
                </button>
              );
            }}
          </ConnectButton.Custom>
        </>
      ) : (
        <>
          <p className={styles.walletAddress}>{shortenAddress(address)}</p>
          <p className={styles.participationStat}>{t('dao.sidebar.connectedStat')}</p>
          <div className={styles.sidebarActions}>
            <button type="button" className={styles.sidebarBtnPrimary} onClick={onCreateProposal}>
              <FilePlus className="h-4 w-4" aria-hidden />
              {t('dao.actions.createProposal')}
            </button>
            <button type="button" className={styles.sidebarBtnOutline} onClick={onStartDiscussion}>
              <MessagesSquare className="h-4 w-4" aria-hidden />
              {t('dao.actions.startDiscussion')}
            </button>
            <button type="button" className={styles.sidebarBtnGhost} onClick={onVote}>
              {t('dao.sidebar.voteAction')}
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default DaoParticipationCard;
