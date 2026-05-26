import React, { useMemo } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { FilePlus, MessagesSquare, UserRound } from 'lucide-react';
import { useAccount } from 'wagmi';
import { getMockUserParticipationSummary } from '../utils/daoProposalVote.mock';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoParticipationCard.module.scss';

type Props = {
  onCreateProposal: () => void;
  onStartDiscussion: () => void;
  onViewParticipated: (tab: 'proposals' | 'discussions') => void;
};

const DaoParticipationCard: React.FC<Props> = ({
  onCreateProposal,
  onStartDiscussion,
  onViewParticipated,
}) => {
  const { t } = useTranslation();
  const { address, isConnected } = useAccount();

  const participation = useMemo(
    () => (address ? getMockUserParticipationSummary(address) : null),
    [address],
  );

  return (
    <aside className={`${sharedStyles.panelCard} ${sharedStyles.sidebarCard}`} aria-labelledby="dao-participation-title">
      <h2 id="dao-participation-title" className={sharedStyles.sidebarTitle}>
        <UserRound className={sharedStyles.sidebarTitleIcon} strokeWidth={2.25} aria-hidden />
        <span>{t('dao.sidebar.title')}</span>
      </h2>

      {!isConnected || !address ? (
        <>
          <p className={sharedStyles.sidebarHint}>{t('dao.sidebar.connectHint')}</p>
          <ConnectButton.Custom>
            {({ openConnectModal, mounted, authenticationStatus }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              return (
                <button
                  type="button"
                  className={sharedStyles.connectBtn}
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
          {participation ? (
            <div className={styles.participationStats}>
              <div className={styles.participationStatItem}>
                <span className={styles.participationStatLabel}>{t('dao.sidebar.proposalsParticipated')}</span>
                <button
                  type="button"
                  className={styles.participationStatValueBtn}
                  onClick={() => onViewParticipated('proposals')}
                  aria-label={t('dao.sidebar.viewParticipatedProposals', {
                    count: participation.proposalsParticipated,
                  })}
                >
                  {t('dao.sidebar.participationCount', { count: participation.proposalsParticipated })}
                </button>
              </div>
              <div className={styles.participationStatItem}>
                <span className={styles.participationStatLabel}>{t('dao.sidebar.discussionsParticipated')}</span>
                <button
                  type="button"
                  className={styles.participationStatValueBtn}
                  onClick={() => onViewParticipated('discussions')}
                  aria-label={t('dao.sidebar.viewParticipatedDiscussions', {
                    count: participation.discussionsParticipated,
                  })}
                >
                  {t('dao.sidebar.participationCount', { count: participation.discussionsParticipated })}
                </button>
              </div>
            </div>
          ) : null}
          <div className={styles.sidebarActions}>
            <button type="button" className={styles.sidebarBtnPrimary} onClick={onCreateProposal}>
              <FilePlus className="h-4 w-4" aria-hidden />
              {t('dao.actions.createProposal')}
            </button>
            <button type="button" className={styles.sidebarBtnOutline} onClick={onStartDiscussion}>
              <MessagesSquare className="h-4 w-4" aria-hidden />
              {t('dao.actions.startDiscussion')}
            </button>
          </div>
        </>
      )}
    </aside>
  );
};

export default DaoParticipationCard;
