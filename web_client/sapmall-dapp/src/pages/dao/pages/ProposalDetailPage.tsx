import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, Drawer, Tabs, Button } from 'antd';
import { HomeOutlined, LikeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { getProposalById } from '../mocks/proposals.mock';
import ProposalStatusTag from '../components/ProposalStatusTag';
import VotePanel from '../components/VotePanel';
import DiscussionThread from '../components/DiscussionThread';
import ExecutionStatus from '../components/ExecutionStatus';
import DaoEmptyState from '../components/DaoEmptyState';
import SectionTitle from '../components/SectionTitle';
import shared from '../styles/dao.shared.module.scss';
import styles from './ProposalDetailPage.module.scss';

const ProposalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const proposal = useMemo(() => (id ? getProposalById(id) : undefined), [id]);

  if (!proposal) {
    return (
      <main className={shared.page}>
        <DaoEmptyState type="detail" />
        <Link to="/dao/proposals" className={shared.ctaGhost}>
          {t('dao.detail.backToList')}
        </Link>
      </main>
    );
  }

  const metaRows = [
    [t('dao.detail.proposer'), proposal.proposerDisplay],
    [t('dao.detail.created'), new Date(proposal.timeline.createdAt).toLocaleString()],
    proposal.timeline.votingEndsAt
      ? [t('dao.detail.deadline'), new Date(proposal.timeline.votingEndsAt).toLocaleString()]
      : null,
    proposal.timeline.executedAt
      ? [t('dao.detail.executed'), new Date(proposal.timeline.executedAt).toLocaleString()]
      : null,
  ].filter(Boolean) as [string, string][];

  const tabItems = [
    {
      key: 'overview',
      label: t('dao.detail.tabOverview'),
      children: (
        <section className={styles.tabContent}>
          <SectionTitle title={t('dao.detail.summary')} />
          <p className={shared.bodyText}>{proposal.summary}</p>
          <SectionTitle title={t('dao.detail.body')} />
          <pre className={styles.markdown}>{proposal.bodyMarkdown}</pre>
          <SectionTitle title={t('dao.detail.impact')} />
          <p className={shared.bodyText}>{proposal.impact}</p>
          {proposal.onChain && (
            <details className={styles.onChain}>
              <summary>{t('dao.detail.onChain')}</summary>
              <table className={shared.zebraTable}>
                <tbody>
                  <tr>
                    <th>Chain ID</th>
                    <td>{proposal.onChain.chainId}</td>
                  </tr>
                  <tr>
                    <th>Governor</th>
                    <td>{proposal.onChain.governorAddress}</td>
                  </tr>
                </tbody>
              </table>
            </details>
          )}
        </section>
      ),
    },
    {
      key: 'discussion',
      label: t('dao.detail.tabDiscussion'),
      children: (
        <DiscussionThread
          comments={proposal.comments}
          proposalId={proposal.id}
          holdersOnly={proposal.status === 'active'}
        />
      ),
    },
    {
      key: 'votes',
      label: t('dao.detail.tabVotes'),
      children: (
        <section className={styles.tabContent}>
          {proposal.voteRecords.length === 0 ? (
            <p className={shared.muted}>{t('dao.detail.noVotes')}</p>
          ) : (
            <table className={shared.zebraTable}>
              <thead>
                <tr>
                  <th>{t('dao.detail.voter')}</th>
                  <th>{t('dao.detail.option')}</th>
                  <th>{t('dao.detail.weight')}</th>
                  <th>{t('dao.detail.verify')}</th>
                </tr>
              </thead>
              <tbody>
                {proposal.voteRecords.map((v) => (
                  <tr key={v.id}>
                    <td>
                      {v.voterAddress}
                      {v.delegatedFrom && (
                        <span className={styles.delegated}>
                          ({t('dao.detail.delegated')})
                        </span>
                      )}
                    </td>
                    <td>{t(`dao.vote.${v.option}`)}</td>
                    <td>{v.weight.toLocaleString()}</td>
                    <td>
                      {v.txHash ? (
                        <a
                          href={`https://etherscan.io/tx/${v.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.txLink}
                        >
                          {t('dao.detail.viewTx')}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ),
    },
  ];

  return (
    <main className={`${shared.page} ${styles.page}`}>
      <Breadcrumb
        className="dao-breadcrumb"
        items={[
          { title: <Link to="/dao"><HomeOutlined /> {t('dao.breadcrumb.home')}</Link> },
          { title: <Link to="/dao/proposals">{t('dao.breadcrumb.proposals')}</Link> },
          { title: `#${proposal.number}` },
        ]}
      />

      <header className={`${shared.glassCard} ${styles.heroCard}`}>
        <section className={styles.titleRow}>
          <ProposalStatusTag status={proposal.status} />
          <span className={styles.type}>{t(`dao.type.${proposal.type}`)}</span>
        </section>
        <h1 className={styles.title}>{proposal.title}</h1>
        <p className={styles.summary}>{proposal.summary}</p>
        <table className={`${shared.zebraTable} ${styles.metaTable}`}>
          <tbody>
            {metaRows.map(([label, value]) => (
              <tr key={label}>
                <th>{label}</th>
                <td>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>

      <section className={shared.detailGrid}>
        <section className={styles.mainPanel}>
          <Tabs items={tabItems} className="dao-tabs" />
          <ExecutionStatus execution={proposal.execution} />
        </section>
        <aside className={`${shared.stickySide} ${styles.voteAside}`}>
          <VotePanel proposal={proposal} />
        </aside>
      </section>

      <footer className={styles.mobileBar}>
        <Button
          type="primary"
          size="large"
          block
          className={styles.mobileVoteBtn}
          onClick={() => setDrawerOpen(true)}
        >
          <LikeOutlined />
          {t('dao.vote.panelTitle')}
        </Button>
      </footer>

      <Drawer
        title={t('dao.vote.panelTitle')}
        placement="bottom"
        height="55vh"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        className={styles.voteDrawer}
        styles={{ body: { padding: '1rem' } }}
      >
        <VotePanel proposal={proposal} />
      </Drawer>
    </main>
  );
};

export default ProposalDetailPage;
