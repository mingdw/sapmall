import React, { useMemo } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { FilePlus, MessagesSquare, UserRound } from 'lucide-react';
import { useAccount } from 'wagmi';
import { getMockUserParticipationSummary } from '../utils/daoProposalVote.mock';
import sharedStyles from '../styles/dao.shared.module.scss';

type Props = {
  onCreateProposal: () => void;
  onStartDiscussion: () => void;
  onViewParticipated: (tab: 'proposals' | 'discussions') => void;
};

const statValueBtn =
  'm-0 cursor-pointer rounded-md border-none bg-transparent px-1.5 py-0.5 text-center text-[0.9375rem] font-bold tabular-nums leading-snug text-[var(--dao-hero-value)] transition-[background-color,color] hover:bg-red-500/10 hover:text-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--dao-hero-value)]';

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
            <div className="mb-4 grid grid-cols-2 gap-x-3 gap-y-[0.65rem]">
              <div className="flex min-w-0 flex-col items-center justify-center gap-1 text-center">
                <span className="text-[0.6875rem] font-semibold tracking-wide text-slate-500">
                  {t('dao.sidebar.proposalsParticipated')}
                </span>
                <button
                  type="button"
                  className={statValueBtn}
                  onClick={() => onViewParticipated('proposals')}
                  aria-label={t('dao.sidebar.viewParticipatedProposals', {
                    count: participation.proposalsParticipated,
                  })}
                >
                  {t('dao.sidebar.participationCount', { count: participation.proposalsParticipated })}
                </button>
              </div>
              <div className="flex min-w-0 flex-col items-center justify-center gap-1 text-center">
                <span className="text-[0.6875rem] font-semibold tracking-wide text-slate-500">
                  {t('dao.sidebar.discussionsParticipated')}
                </span>
                <button
                  type="button"
                  className={statValueBtn}
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
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[0.625rem] border-none bg-gradient-to-br from-[var(--dao-amber)] to-[var(--dao-amber-deep)] px-4 py-[0.65rem] text-[0.8125rem] font-semibold text-white shadow-[0_2px_10px_rgba(245,158,11,0.3)] transition-all hover:brightness-105"
              onClick={onCreateProposal}
            >
              <FilePlus className="h-4 w-4" aria-hidden />
              {t('dao.actions.createProposal')}
            </button>
            <button
              type="button"
              className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[0.625rem] border border-slate-200 bg-white px-4 py-[0.65rem] text-[0.8125rem] font-semibold text-[var(--dao-panel-text)] transition-all hover:border-[var(--dao-primary)] hover:text-[var(--dao-primary)]"
              onClick={onStartDiscussion}
            >
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
