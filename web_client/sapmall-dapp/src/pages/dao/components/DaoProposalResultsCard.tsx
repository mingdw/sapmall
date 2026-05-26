import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, X } from 'lucide-react';
import type { DaoProposalDetail } from '../types';
import {
  computeProposalMetrics,
  formatProposalCompact,
  formatProposalVoteCount,
} from '../utils/daoProposalMetrics';
import listTagStyles from '../styles/dao.listTags.module.scss';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoProposalDetail.module.scss';

type Props = {
  proposal: DaoProposalDetail;
  votesFor: number;
  votesAgainst: number;
};

const statusClass: Record<DaoProposalDetail['status'], string> = {
  active: listTagStyles.statusActive,
  passed: listTagStyles.statusPassed,
  pending: listTagStyles.statusPending,
};

const DaoProposalResultsCard: React.FC<Props> = ({ proposal, votesFor, votesAgainst }) => {
  const { t, i18n } = useTranslation();

  const metrics = useMemo(
    () =>
      computeProposalMetrics({
        votesFor,
        votesAgainst,
        quorumRequired: proposal.quorumRequired,
        differentialRequired: proposal.differentialRequired,
        status: proposal.status,
      }),
    [proposal, votesAgainst, votesFor],
  );

  const forLabel = formatProposalVoteCount(votesFor, i18n.language);
  const againstLabel = formatProposalVoteCount(votesAgainst, i18n.language);
  const totalLabel = formatProposalVoteCount(metrics.totalParticipation, i18n.language);
  const quorumCurrent = formatProposalCompact(metrics.totalParticipation, i18n.language);
  const quorumRequired = formatProposalCompact(proposal.quorumRequired, i18n.language);
  const diffCurrent = formatProposalCompact(Math.max(metrics.differential, 0), i18n.language);
  const diffRequired = formatProposalCompact(proposal.differentialRequired, i18n.language);
  const againstPctDisplay =
    metrics.againstPct > 0 && metrics.againstPct < 0.01 ? '< 0.01' : Math.round(metrics.againstPct);

  return (
    <aside className={`${sharedStyles.panelCard} ${styles.proposalDetailSidebarCard}`}>
      <div className={styles.proposalDetailResultsHead}>
        <h2 className={styles.proposalDetailSidebarTitle}>{t('dao.proposalDetail.resultsCard.title')}</h2>
        <span className={statusClass[proposal.status]}>{t(proposal.statusKey)}</span>
      </div>

      <div className={styles.proposalDetailResultsWindow}>
        <span>
          {t('dao.list.startsAtLabel')} {t(proposal.startAtKey)}
        </span>
        <span className={styles.proposalDetailMetaSep} aria-hidden>
          ·
        </span>
        <span>
          {t('dao.list.endsAtLabel')} {t(proposal.endAtKey)}
        </span>
      </div>

      <div className={styles.proposalDetailResultsSection}>
        <div className={styles.proposalDetailVoteRow}>
          <div className={styles.proposalDetailVoteRowHead}>
            <span className={styles.proposalDetailVoteLabelYae}>{t('dao.proposalDetail.resultsCard.yae')}</span>
            <span className={styles.proposalDetailVoteMeta}>
              {t('dao.proposalDetail.resultsCard.votesPct', {
                amount: forLabel,
                pct: metrics.forPctRounded,
              })}
            </span>
          </div>
          <div className={styles.proposalDetailVoteBar} aria-hidden>
            <div className={styles.proposalDetailVoteBarFor} style={{ width: `${metrics.forPct}%` }} />
          </div>
        </div>

        <div className={styles.proposalDetailVoteRow}>
          <div className={styles.proposalDetailVoteRowHead}>
            <span className={styles.proposalDetailVoteLabelNay}>{t('dao.proposalDetail.resultsCard.nay')}</span>
            <span className={styles.proposalDetailVoteMeta}>
              {t('dao.proposalDetail.resultsCard.votesPct', {
                amount: againstLabel,
                pct: againstPctDisplay,
              })}
            </span>
          </div>
          <div className={styles.proposalDetailVoteBar} aria-hidden>
            <div
              className={styles.proposalDetailVoteBarAgainst}
              style={{ width: `${metrics.againstPct}%` }}
            />
          </div>
        </div>

        <p className={styles.proposalDetailResultsTotalCentered}>
          {t('dao.proposalDetail.resultsCard.totalParticipationInline', { total: totalLabel })}
        </p>
      </div>

      <div className={styles.proposalDetailThresholdSection}>
        <h3 className={styles.proposalDetailThresholdHeading}>
          {t('dao.proposalDetail.resultsCard.thresholdSection')}
        </h3>

        <div className={styles.proposalDetailThresholdRow}>
          <div className={styles.proposalDetailThresholdHead}>
            <span>{t('dao.proposalDetail.resultsCard.quorum')}</span>
            <span
              className={
                metrics.quorumReached
                  ? styles.proposalDetailThresholdReached
                  : styles.proposalDetailThresholdNotReached
              }
            >
              {metrics.quorumReached ? <Check size={14} aria-hidden /> : <X size={14} aria-hidden />}
              {t(
                metrics.quorumReached
                  ? 'dao.proposalDetail.resultsCard.reached'
                  : 'dao.proposalDetail.resultsCard.notReached',
              )}
            </span>
          </div>
          <p className={styles.proposalDetailThresholdValues}>
            {t('dao.proposalDetail.resultsCard.currentRequired', {
              current: quorumCurrent,
              required: quorumRequired,
            })}
          </p>
        </div>

        <div className={styles.proposalDetailThresholdRow}>
          <div className={styles.proposalDetailThresholdHead}>
            <span>{t('dao.proposalDetail.resultsCard.differential')}</span>
            <span
              className={
                metrics.differentialReached
                  ? styles.proposalDetailThresholdReached
                  : styles.proposalDetailThresholdNotReached
              }
            >
              {metrics.differentialReached ? <Check size={14} aria-hidden /> : <X size={14} aria-hidden />}
              {t(
                metrics.differentialReached
                  ? 'dao.proposalDetail.resultsCard.reached'
                  : 'dao.proposalDetail.resultsCard.notReached',
              )}
            </span>
          </div>
          <p className={styles.proposalDetailThresholdValues}>
            {t('dao.proposalDetail.resultsCard.currentRequired', {
              current: diffCurrent,
              required: diffRequired,
            })}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default DaoProposalResultsCard;
