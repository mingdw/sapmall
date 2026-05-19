import React, { useState } from 'react';
import { Button, message } from 'antd';
import {
  CheckOutlined,
  CloseOutlined,
  MinusOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { Proposal, VoteOption } from '../types/proposal.types';
import { canVote, formatRelativeTime } from '../utils/proposalUtils';
import { daoApiService } from '../../../services/api/daoApiService';
import { MOCK_MY_GOVERNANCE } from '../mocks/proposals.mock';
import VoteProgressBar from './VoteProgressBar';
import WalletVotingPower from './WalletVotingPower';
import styles from './VotePanel.module.scss';

interface VotePanelProps {
  proposal: Proposal;
  onVoted?: (option: VoteOption) => void;
}

const VotePanel: React.FC<VotePanelProps> = ({ proposal, onVoted }) => {
  const { t, i18n } = useTranslation();
  const { isConnected } = useAccount();
  const [selected, setSelected] = useState<VoteOption | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [userVote, setUserVote] = useState<VoteOption | null>(null);

  const votingOpen = canVote(proposal.status);
  const endsAt = proposal.timeline.votingEndsAt;

  const handleSubmit = async () => {
    if (!isConnected) {
      message.warning(t('dao.wallet.connectPrompt'));
      return;
    }
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await daoApiService.submitVote(proposal.id, selected);
      if (res.success) {
        message.success(t('dao.vote.submitSuccess'));
        setUserVote(selected);
        onVoted?.(selected);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className={styles.panel}>
      <section className={styles.panelInner}>
      <h3 className={styles.panelTitle}>{t('dao.vote.panelTitle')}</h3>

      {!votingOpen && (
        <section className={styles.discussionBanner}>
          <ClockCircleOutlined className={styles.bannerIcon} />
          <span>{t(`dao.vote.statusHint.${proposal.status}`)}</span>
          {proposal.timeline.discussionEndsAt && (
            <span className={styles.countdown}>
              {t('dao.vote.discussionEnds')}:{' '}
              {formatRelativeTime(proposal.timeline.discussionEndsAt, i18n.language)}
            </span>
          )}
        </section>
      )}

      <WalletVotingPower compact />

      {votingOpen && endsAt && (
        <p className={styles.countdown}>
          <ClockCircleOutlined /> {t('dao.vote.endsIn')}:{' '}
          {formatRelativeTime(endsAt, i18n.language)}
        </p>
      )}

      <VoteProgressBar tally={proposal.tally} showQuorum />

      {votingOpen && (
        <section className={styles.options} aria-label={t('dao.vote.chooseOption')}>
          {(['for', 'against', 'abstain'] as VoteOption[]).map((opt) => (
            <button
              key={opt}
              type="button"
              className={`${styles.optionBtn} ${selected === opt ? styles.selected : ''} ${styles[opt]}`}
              onClick={() => setSelected(opt)}
              disabled={!!userVote}
              aria-pressed={selected === opt}
            >
              {opt === 'for' && <CheckOutlined />}
              {opt === 'against' && <CloseOutlined />}
              {opt === 'abstain' && <MinusOutlined />}
              {t(`dao.vote.${opt}`)}
            </button>
          ))}
        </section>
      )}

      {votingOpen && !userVote && (
        <Button
          type="primary"
          block
          className={styles.submitBtn}
          loading={submitting}
          disabled={!selected || !isConnected}
          onClick={handleSubmit}
        >
          {t('dao.vote.confirm')}
        </Button>
      )}

      {userVote && (
        <p className={styles.votedMsg}>
          {t('dao.vote.youVoted', { option: t(`dao.vote.${userVote}`) })}
        </p>
      )}

      {votingOpen && (
        <p className={styles.powerHint}>
          {t('dao.vote.powerHint', { power: MOCK_MY_GOVERNANCE.votingPower.toLocaleString() })}
        </p>
      )}

      <p className={styles.changeRule}>{t('dao.vote.changeRule')}</p>
      </section>
    </aside>
  );
};

export default VotePanel;
