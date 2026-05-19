import React from 'react';
import { Link } from 'react-router-dom';
import { PlusOutlined, RightOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import {
  MOCK_DAO_STATS,
  MOCK_MY_GOVERNANCE,
  MOCK_PROPOSALS,
  getActiveProposals,
  getDiscussionProposals,
} from '../mocks/proposals.mock';
import DaoKpiBar from '../components/DaoKpiBar';
import ProposalCard from '../components/ProposalCard';
import SectionTitle from '../components/SectionTitle';
import MyGovernancePanel from '../components/MyGovernancePanel';
import GovernanceRulesCollapse from '../components/GovernanceRulesCollapse';
import WalletVotingPower from '../components/WalletVotingPower';
import { sortProposals, formatRelativeTime, getCommentCount } from '../utils/proposalUtils';
import shared from '../styles/dao.shared.module.scss';
import styles from './DaoHomePage.module.scss';

const DaoHomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const active = getActiveProposals().slice(0, 3);
  const hot = getDiscussionProposals().slice(0, 5);
  const latest = sortProposals(MOCK_PROPOSALS, 'latest').slice(0, 4);
  const endingSoon = sortProposals(
    MOCK_PROPOSALS.filter((p) => p.timeline.votingEndsAt),
    'ending'
  ).slice(0, 5);

  return (
    <main className={shared.page}>
      <header className={`${shared.glassCard} ${styles.hero}`}>
        <section className={styles.heroMain}>
          <span className={shared.badge}>
            <span className={shared.badgeDot} aria-hidden />
            {t('dao.home.badge')}
          </span>
          <h1 className={shared.pageTitle}>{t('dao.home.title')}</h1>
          <p className={shared.pageSubtitle}>{t('dao.home.subtitle')}</p>
        </section>
        <section className={styles.heroAside}>
          <WalletVotingPower />
          <Link to="/dao/new" className={shared.ctaPrimary}>
            <PlusOutlined />
            {t('dao.home.createProposal')}
          </Link>
        </section>
      </header>

      <DaoKpiBar stats={MOCK_DAO_STATS} />

      <section className={shared.twoCol}>
        <section className={styles.mainCol}>
          <section className={`${shared.panel} ${styles.block}`}>
            <SectionTitle
              title={t('dao.home.activeVotes')}
              action={
                <Link to="/dao/proposals?status=active" className={shared.linkAction}>
                  {t('dao.home.viewAll')} <RightOutlined />
                </Link>
              }
            />
            {active.length === 0 ? (
              <p className={shared.muted}>{t('dao.empty.proposals')}</p>
            ) : (
              <section className={styles.activeBento}>
                {active.map((p, i) => (
                  <ProposalCard
                    key={p.id}
                    proposal={p}
                    variant={i === 0 ? 'featured' : 'default'}
                  />
                ))}
              </section>
            )}
          </section>

          <section className={styles.splitPanels}>
            <section className={`${shared.panel} ${styles.block}`}>
              <SectionTitle title={t('dao.home.hotDiscussion')} />
              <ol className={styles.hotList}>
                {hot.map((p, index) => (
                  <li key={p.id}>
                    <Link to={`/dao/proposal/${p.id}`} className={styles.hotItem}>
                      <span className={styles.hotRank}>{index + 1}</span>
                      <span className={styles.hotBody}>
                        <span className={styles.hotTitle}>
                          <FireOutlined className={styles.hotIcon} aria-hidden />
                          {p.title}
                        </span>
                        <span className={styles.hotMeta}>
                          {getCommentCount(p)} {t('dao.home.replies')} · #{p.number}
                        </span>
                      </span>
                      <ThunderboltOutlined className={styles.hotChevron} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ol>
            </section>

            <section className={`${shared.panel} ${styles.block}`}>
              <SectionTitle
                title={t('dao.home.latestProposals')}
                action={
                  <Link to="/dao/proposals" className={shared.linkAction}>
                    {t('dao.home.viewAll')} <RightOutlined />
                  </Link>
                }
              />
              <section className={styles.compactList}>
                {latest.map((p) => (
                  <ProposalCard key={p.id} proposal={p} variant="compact" />
                ))}
              </section>
            </section>
          </section>
        </section>

        <aside className={`${shared.stickySide} ${styles.sideCol}`}>
          <MyGovernancePanel snapshot={MOCK_MY_GOVERNANCE} />
          <section className={`${shared.panel} ${styles.deadlinePanel}`}>
            <SectionTitle title={t('dao.home.endingSoon')} />
            <ul className={styles.deadlineList}>
              {endingSoon.map((p) => (
                <li key={p.id}>
                  <Link to={`/dao/proposal/${p.id}`} className={styles.deadlineItem}>
                    <span className={styles.deadlineLeft}>
                      <span className={styles.deadlineNum}>#{p.number}</span>
                      <span className={styles.deadlineTitle}>{p.title}</span>
                    </span>
                    {p.timeline.votingEndsAt && (
                      <time className={styles.deadlineTime} dateTime={p.timeline.votingEndsAt}>
                        {formatRelativeTime(p.timeline.votingEndsAt, i18n.language)}
                      </time>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <GovernanceRulesCollapse />
        </aside>
      </section>
    </main>
  );
};

export default DaoHomePage;
