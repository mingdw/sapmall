import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommentOutlined,
  ClockCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { Proposal } from '../types/proposal.types';
import ProposalStatusTag from './ProposalStatusTag';
import VoteProgressBar from './VoteProgressBar';
import { getCommentCount, formatRelativeTime } from '../utils/proposalUtils';
import styles from './ProposalCard.module.scss';

interface ProposalCardProps {
  proposal: Proposal;
  variant?: 'default' | 'compact' | 'featured';
}

const ProposalCard: React.FC<ProposalCardProps> = ({
  proposal,
  variant = 'default',
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const comments = getCommentCount(proposal);
  const endsAt = proposal.timeline.votingEndsAt;

  const handleClick = () => navigate(`/dao/proposal/${proposal.id}`);

  return (
    <article
      className={`${styles.card} ${styles[variant]}`}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      role="button"
      tabIndex={0}
      aria-label={proposal.title}
    >
      <header className={styles.header}>
        <span className={styles.number}>#{proposal.number}</span>
        <ProposalStatusTag status={proposal.status} />
      </header>
      <h3 className={styles.title}>{proposal.title}</h3>
      <p className={styles.summary}>{proposal.summary}</p>
      <span className={styles.type}>{t(`dao.type.${proposal.type}`)}</span>
      {(proposal.status === 'active' || proposal.status === 'passed' || proposal.status === 'rejected') && (
        <VoteProgressBar tally={proposal.tally} compact showQuorum={variant === 'featured'} />
      )}
      <footer className={styles.meta}>
        <span className={styles.metaItem}>
          <UserOutlined /> {proposal.proposerDisplay}
        </span>
        {endsAt && (
          <span className={styles.metaItem}>
            <ClockCircleOutlined />
            {formatRelativeTime(endsAt, i18n.language)}
          </span>
        )}
        <span className={styles.metaItem}>
          <CommentOutlined /> {comments}
        </span>
        <span className={styles.participation}>
          {t('dao.list.participation', { percent: proposal.tally.participationPercent })}
        </span>
      </footer>
    </article>
  );
};

export default ProposalCard;
