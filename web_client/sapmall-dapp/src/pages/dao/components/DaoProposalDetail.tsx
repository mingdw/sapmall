import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ExternalLink } from 'lucide-react';
import { useAccount } from 'wagmi';
import { getRelatedDaoProposals } from '../mocks/daoProposalDetails.mock';
import type { DaoProposalDetail as DaoProposalDetailData, DaoProposalVoteChoice } from '../types';
import {
  applyUserVoteToTotals,
  getUserProposalVote,
} from '../utils/daoProposalVote.mock';
import { daoHomePath, daoProposalPath, daoProposalsListPath } from '../utils/daoNavigation';
import { shortenWalletAddress } from '../utils/walletAddress';
import DaoProposalDetailBody from './DaoProposalDetailBody';
import DaoProposalResultsCard from './DaoProposalResultsCard';
import DaoProposalTimelineCard from './DaoProposalTimelineCard';
import DaoProposalVoteCard from './DaoProposalVoteCard';
import detailStyles from '../styles/dao.detailCommon.module.scss';
import listTagStyles from '../styles/dao.listTags.module.scss';
import { DAO_LAYOUT } from '../constants/daoLayoutClasses';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoProposalDetail.module.scss';

type Props = {
  proposal: DaoProposalDetailData;
};

const statusClass: Record<DaoProposalDetailData['status'], string> = {
  active: listTagStyles.statusActive,
  passed: listTagStyles.statusPassed,
  pending: listTagStyles.statusPending,
};

const topicTagClass: Record<string, string> = {
  'dao.list.proposals.tags.governance': listTagStyles.topicTagGovernance,
  'dao.list.proposals.tags.treasury': listTagStyles.topicTagTreasury,
  'dao.list.proposals.tags.marketplace': listTagStyles.topicTagMarketplace,
  'dao.list.proposals.tags.staking': listTagStyles.topicTagStaking,
  'dao.list.proposals.tags.grant': listTagStyles.topicTagGrant,
  'dao.list.proposals.tags.multisig': listTagStyles.topicTagMultisig,
  'dao.list.proposals.tags.security': listTagStyles.topicTagSecurity,
};

const DaoProposalDetailView: React.FC<Props> = ({ proposal }) => {
  const { t } = useTranslation();
  const { address } = useAccount();
  const title = t(proposal.titleKey);
  const related = useMemo(() => getRelatedDaoProposals(proposal, 3), [proposal]);

  const storedVote = useMemo(
    () => getUserProposalVote(address, proposal.id),
    [address, proposal.id],
  );

  const initialTotals = useMemo(() => {
    if (!storedVote || !address) {
      return {
        votesFor: proposal.votesFor,
        votesAgainst: proposal.votesAgainst,
        votersFor: proposal.votersFor,
        votersAgainst: proposal.votersAgainst,
      };
    }
    return {
      ...applyUserVoteToTotals(proposal.votesFor, proposal.votesAgainst, storedVote, 120),
      votersFor: proposal.votersFor + (storedVote === 'for' ? 1 : 0),
      votersAgainst: proposal.votersAgainst + (storedVote === 'against' ? 1 : 0),
    };
  }, [address, proposal, storedVote]);

  const [votesFor, setVotesFor] = useState(initialTotals.votesFor);
  const [votesAgainst, setVotesAgainst] = useState(initialTotals.votesAgainst);
  const [votersFor, setVotersFor] = useState(initialTotals.votersFor);
  const [votersAgainst, setVotersAgainst] = useState(initialTotals.votersAgainst);
  const [userVote, setUserVote] = useState<DaoProposalVoteChoice | null>(storedVote);

  useEffect(() => {
    setVotesFor(initialTotals.votesFor);
    setVotesAgainst(initialTotals.votesAgainst);
    setVotersFor(initialTotals.votersFor);
    setVotersAgainst(initialTotals.votersAgainst);
    setUserVote(storedVote);
  }, [
    initialTotals.votersAgainst,
    initialTotals.votersFor,
    initialTotals.votesAgainst,
    initialTotals.votesFor,
    proposal.id,
    storedVote,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [proposal.id]);

  const onVoteSubmitted = useCallback(
    (
      choice: DaoProposalVoteChoice,
      nextFor: number,
      nextAgainst: number,
      nextVotersFor: number,
      nextVotersAgainst: number,
    ) => {
      setUserVote(choice);
      setVotesFor(nextFor);
      setVotesAgainst(nextAgainst);
      setVotersFor(nextVotersFor);
      setVotersAgainst(nextVotersAgainst);
    },
    [],
  );

  return (
    <section className={`${DAO_LAYOUT.contentZoneInnerFull} ${styles.proposalDetailLayout}`}>
      <article className={`${sharedStyles.panelCard} ${styles.proposalDetailMain}`} aria-label={title}>
        <header className={styles.proposalDetailHead}>
          <nav className={styles.proposalDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoHomePath} className={styles.proposalDetailBreadcrumbLink}>
              {t('navigation.dao')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={daoProposalsListPath} className={styles.proposalDetailBreadcrumbLink}>
              {t('dao.tabs.proposals')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className={styles.proposalDetailBreadcrumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>

          <div className={styles.proposalDetailTitleRow}>
            <div className={styles.proposalDetailTitleMain}>
              <span className={statusClass[proposal.status]}>{t(proposal.statusKey)}</span>
              <h1 className={styles.proposalDetailTitle}>{title}</h1>
            </div>
            {proposal.tagKeys.length > 0 ? (
              <div className={styles.proposalDetailTitleTags}>
                {proposal.tagKeys.map((tagKey) => (
                  <span key={tagKey} className={`${listTagStyles.proposalTopicTag} ${topicTagClass[tagKey] ?? ''}`}>
                    {t(tagKey)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.proposalDetailMeta}>
            <span>
              {t('dao.list.proposerLabel')}
              <span className={styles.proposalDetailAuthor}>{shortenWalletAddress(proposal.authorAddress)}</span>
            </span>
          </div>

          <section className={styles.proposalDetailSummary}>
            <h2 className={styles.proposalDetailSectionTitle}>{t('dao.proposalDetail.simpleSummary')}</h2>
            <p className={styles.proposalDetailLead}>{t(proposal.summaryKey)}</p>
          </section>
        </header>

        <div className={styles.proposalDetailBody}>
          <DaoProposalDetailBody blocks={proposal.blocks} />
        </div>

        {proposal.references.length > 0 ? (
          <footer className={styles.proposalDetailReferences}>
            <h2 className={styles.proposalDetailSectionTitle}>{t('dao.proposalDetail.referencesTitle')}</h2>
            <ul className={styles.proposalDetailReferencesList}>
              {proposal.references.map((ref) => (
                <li key={ref.labelKey}>
                  <a href={ref.url} target="_blank" rel="noopener noreferrer">
                    {t(ref.labelKey)}
                    <ExternalLink size={14} aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}

        {related.length > 0 ? (
          <footer className={styles.proposalDetailRelated}>
            <div className={detailStyles.eventDetailRelatedHead}>
              <h2 className={detailStyles.eventDetailRelatedTitle}>{t('dao.proposalDetail.relatedTitle')}</h2>
              <Link to={daoProposalsListPath} className={detailStyles.eventDetailViewAll}>
                {t('dao.proposalDetail.viewAll')}
                <ChevronRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className={styles.proposalDetailRelatedList}>
              {related.map((item) => (
                <li key={item.id}>
                  <Link to={daoProposalPath(item.id)} className={styles.proposalDetailRelatedItem}>
                    <span className={statusClass[item.status]}>{t(item.statusKey)}</span>
                    <span className={styles.proposalDetailRelatedTitle}>{t(item.titleKey)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>

      <aside className={styles.proposalDetailSidebar} aria-label={t('dao.proposalDetail.sidebarAria')}>
        <DaoProposalVoteCard
          proposal={proposal}
          votesFor={votesFor}
          votesAgainst={votesAgainst}
          votersFor={votersFor}
          votersAgainst={votersAgainst}
          userVote={userVote}
          onVoteSubmitted={onVoteSubmitted}
        />
        <DaoProposalResultsCard proposal={proposal} votesFor={votesFor} votesAgainst={votesAgainst} />
        <DaoProposalTimelineCard proposal={proposal} />
      </aside>
    </section>
  );
};

export default DaoProposalDetailView;
