import React, { useCallback, useMemo, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useTranslation } from 'react-i18next';
import { Modal, message } from 'antd';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useAccount } from 'wagmi';
import type { DaoProposalDetail, DaoProposalVoteChoice } from '../types';
import {
  getMockUserGovernanceStats,
  getMockVotingPower,
  setUserProposalVote,
} from '../utils/daoProposalVote.mock';
import { formatProposalVoteCount } from '../utils/daoProposalMetrics';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoProposalDetail.module.scss';

type Props = {
  proposal: DaoProposalDetail;
  votesFor: number;
  votesAgainst: number;
  votersFor: number;
  votersAgainst: number;
  userVote: DaoProposalVoteChoice | null;
  onVoteSubmitted: (
    choice: DaoProposalVoteChoice,
    nextFor: number,
    nextAgainst: number,
    nextVotersFor: number,
    nextVotersAgainst: number,
  ) => void;
};

const DaoProposalVoteCard: React.FC<Props> = ({
  proposal,
  votesFor,
  votesAgainst,
  votersFor,
  votersAgainst,
  userVote,
  onVoteSubmitted,
}) => {
  const { t, i18n } = useTranslation();
  const { address, isConnected } = useAccount();
  const [submitting, setSubmitting] = useState(false);

  const votingPower = address ? getMockVotingPower(address) : 0;
  const canVote = proposal.status === 'active' && isConnected && !!address && !userVote;
  const showVoteActions = proposal.status === 'active';

  const userStats = useMemo(
    () => (address ? getMockUserGovernanceStats(address) : null),
    [address],
  );

  const lifetimeWeightLabel = userStats
    ? formatProposalVoteCount(userStats.lifetimeVoteWeight, i18n.language)
    : '';

  const submitVote = useCallback(
    (choice: DaoProposalVoteChoice) => {
      if (!address || !canVote) return;

      Modal.confirm({
        title: t('dao.proposalDetail.voteCard.confirmTitle'),
        content: t('dao.proposalDetail.voteCard.confirmBody', {
          choice: t(`dao.proposalDetail.voteCard.choice.${choice}`),
          power: votingPower,
        }),
        okText: t('dao.proposalDetail.voteCard.confirmOk'),
        cancelText: t('common.cancel'),
        onOk: () =>
          new Promise<void>((resolve) => {
            setSubmitting(true);
            window.setTimeout(() => {
              setUserProposalVote(address, proposal.id, choice);
              const nextFor = choice === 'for' ? votesFor + votingPower : votesFor;
              const nextAgainst = choice === 'against' ? votesAgainst + votingPower : votesAgainst;
              const nextVotersFor = choice === 'for' ? votersFor + 1 : votersFor;
              const nextVotersAgainst = choice === 'against' ? votersAgainst + 1 : votersAgainst;
              onVoteSubmitted(choice, nextFor, nextAgainst, nextVotersFor, nextVotersAgainst);
              message.success(t('dao.proposalDetail.voteCard.successToast'));
              setSubmitting(false);
              resolve();
            }, 900);
          }),
      });
    },
    [
      address,
      canVote,
      onVoteSubmitted,
      proposal.id,
      t,
      votesAgainst,
      votesFor,
      votersAgainst,
      votersFor,
      votingPower,
    ],
  );

  const renderUserStats = () => {
    if (!userStats) return null;

    return (
      <div className={styles.proposalDetailVoteStats}>
        <div className={styles.proposalDetailVoteStatItem}>
          <span className={styles.proposalDetailVoteStatLabel}>
            {t('dao.proposalDetail.voteCard.stats.historicalParticipation')}
          </span>
          <span className={styles.proposalDetailVoteStatValue} data-stat="participation">
            <span className={styles.proposalDetailVoteStatNumber}>{userStats.historicalParticipation}</span>
            <span className={styles.proposalDetailVoteStatUnit}>
              {t('dao.proposalDetail.voteCard.stats.timesUnit')}
            </span>
          </span>
        </div>
        <div className={styles.proposalDetailVoteStatItem}>
          <span className={styles.proposalDetailVoteStatLabel}>
            {t('dao.proposalDetail.voteCard.stats.votingPower')}
          </span>
          <span className={styles.proposalDetailVoteStatValue} data-stat="power">
            <span className={styles.proposalDetailVoteStatNumber}>{userStats.votingPower}</span>
            <span className={styles.proposalDetailVoteStatUnit}> SAP</span>
          </span>
        </div>
        <div className={styles.proposalDetailVoteStatItem}>
          <span className={styles.proposalDetailVoteStatLabel}>
            {t('dao.proposalDetail.voteCard.stats.lifetimeWeight')}
          </span>
          <span className={styles.proposalDetailVoteStatValue} data-stat="lifetime">
            <span className={styles.proposalDetailVoteStatNumber}>{lifetimeWeightLabel}</span>
            <span className={styles.proposalDetailVoteStatUnit}> SAP</span>
          </span>
        </div>
        <div className={styles.proposalDetailVoteStatItem}>
          <span className={styles.proposalDetailVoteStatLabel}>
            {t('dao.proposalDetail.voteCard.stats.activeLevel')}
          </span>
          <span
            className={styles.proposalDetailVoteStatValue}
            data-stat="activity"
            data-level={userStats.activeLevel}
          >
            {t(`dao.proposalDetail.voteCard.stats.activeLevelValue.${userStats.activeLevel}`)}
          </span>
        </div>
      </div>
    );
  };

  const renderVoteActions = (disabled: boolean) => (
    <div className={styles.proposalDetailVoteActions}>
      <button
        type="button"
        className={`${styles.proposalDetailVoteBtnFor} ${userVote === 'for' ? styles.proposalDetailVoteBtnSelected : ''}`}
        disabled={disabled || submitting}
        aria-pressed={userVote === 'for'}
        onClick={() => submitVote('for')}
      >
        <span className={styles.proposalDetailVoteBtnLabel}>
          <ThumbsUp size={16} aria-hidden />
          {t('dao.proposalDetail.voteCard.voteFor')}
        </span>
        <span className={styles.proposalDetailVoteBtnCount}>
          {t('dao.proposalDetail.voteCard.voterCount', { count: votersFor })}
        </span>
      </button>
      <button
        type="button"
        className={`${styles.proposalDetailVoteBtnAgainst} ${userVote === 'against' ? styles.proposalDetailVoteBtnSelected : ''}`}
        disabled={disabled || submitting}
        aria-pressed={userVote === 'against'}
        onClick={() => submitVote('against')}
      >
        <span className={styles.proposalDetailVoteBtnLabel}>
          <ThumbsDown size={16} aria-hidden />
          {t('dao.proposalDetail.voteCard.voteAgainst')}
        </span>
        <span className={styles.proposalDetailVoteBtnCount}>
          {t('dao.proposalDetail.voteCard.voterCount', { count: votersAgainst })}
        </span>
      </button>
    </div>
  );

  const renderBody = () => {
    if (proposal.status === 'pending') {
      return (
        <p className={styles.proposalDetailSidebarHint}>
          {t('dao.proposalDetail.voteCard.notOpenYet', { date: t(proposal.startAtKey) })}
        </p>
      );
    }

    if (!isConnected || !address) {
      return (
        <>
          <p className={styles.proposalDetailSidebarHint}>{t('dao.proposalDetail.voteCard.connectHint')}</p>
          <ConnectButton.Custom>
            {({ openConnectModal, mounted, authenticationStatus }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              return (
                <button
                  type="button"
                  className={sharedStyles.connectBtn}
                  disabled={!ready || proposal.status !== 'active'}
                  onClick={openConnectModal}
                >
                  {t('dao.proposalDetail.voteCard.connectToVote')}
                </button>
              );
            }}
          </ConnectButton.Custom>
          {showVoteActions ? renderVoteActions(true) : null}
        </>
      );
    }

    if (proposal.status === 'active' && userVote) {
      return (
        <>
          {renderUserStats()}
          <p className={styles.proposalDetailVoteSubmitted}>
            {t(`dao.proposalDetail.voteCard.alreadyVoted.${userVote}`, { power: votingPower })}
          </p>
          {renderVoteActions(true)}
        </>
      );
    }

    if (proposal.status === 'active') {
      return (
        <>
          {renderUserStats()}
          {renderVoteActions(!canVote)}
        </>
      );
    }

    if (userVote) {
      return (
        <>
          {renderUserStats()}
          <p className={styles.proposalDetailVoteSubmitted}>
            {t(`dao.proposalDetail.voteCard.alreadyVoted.${userVote}`, { power: votingPower })}
          </p>
        </>
      );
    }

    return (
      <>
        {renderUserStats()}
        <p className={styles.proposalDetailSidebarHint}>{t('dao.proposalDetail.voteCard.notParticipated')}</p>
      </>
    );
  };

  return (
    <aside className={`${sharedStyles.panelCard} ${styles.proposalDetailSidebarCard}`}>
      <h2 className={styles.proposalDetailSidebarTitle}>{t('dao.proposalDetail.voteCard.title')}</h2>
      {renderBody()}
    </aside>
  );
};

export default DaoProposalVoteCard;
