import React from 'react';
import { useTranslation } from 'react-i18next';
import { VoteTally } from '../types/proposal.types';
import { getVotePercentages } from '../utils/proposalUtils';
import styles from './VoteProgressBar.module.scss';

interface VoteProgressBarProps {
  tally: VoteTally;
  compact?: boolean;
  showQuorum?: boolean;
}

const VoteProgressBar: React.FC<VoteProgressBarProps> = ({
  tally,
  compact,
  showQuorum = true,
}) => {
  const { t } = useTranslation();
  const pct = getVotePercentages(tally);

  const Root = 'div' as const;
  const Row = 'div' as const;
  return (
    <Root className={styles.wrap}>
      <Row className={styles.barRow}>
        <span className={styles.label}>{t('dao.vote.for')}</span>
        <Row className={styles.track}>
          <Row className={styles.for} style={{ width: `${pct.for}%` }} />
        </Row>
        <span className={styles.pct}>{pct.for}%</span>
      </Row>
      <Row className={styles.barRow}>
        <span className={styles.label}>{t('dao.vote.against')}</span>
        <Row className={styles.track}>
          <Row className={styles.against} style={{ width: `${pct.against}%` }} />
        </Row>
        <span className={styles.pct}>{pct.against}%</span>
      </Row>
      {!compact && pct.abstain > 0 && (
        <Row className={styles.barRow}>
          <span className={styles.label}>{t('dao.vote.abstain')}</span>
          <Row className={styles.track}>
            <Row className={styles.abstain} style={{ width: `${pct.abstain}%` }} />
          </Row>
          <span className={styles.pct}>{pct.abstain}%</span>
        </Row>
      )}
      {showQuorum && (
        <Row className={styles.quorumRow}>
          <span className={styles.quorumLabel}>{t('dao.vote.quorum')}</span>
          <Row className={styles.quorumTrack}>
            <Row
              className={styles.quorumFill}
              style={{ width: `${Math.min(tally.quorumPercent, 100)}%` }}
            />
          </Row>
          <span className={styles.pct}>
            {tally.quorumPercent}% / {tally.quorumRequired}%
          </span>
        </Row>
      )}
    </Root>
  );
};

export default VoteProgressBar;
