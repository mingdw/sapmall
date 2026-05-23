import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';
import { DAO_DISCORD_URL } from '../constants';
import type { DaoProposalDetail } from '../types';
import styles from '../DaoPage.module.scss';

type Props = {
  proposal: DaoProposalDetail;
};

const DaoProposalTimelineCard: React.FC<Props> = ({ proposal }) => {
  const { t } = useTranslation();
  const discordUrl = proposal.forumUrl || DAO_DISCORD_URL;

  return (
    <aside className={`${styles.panelCard} ${styles.proposalDetailSidebarCard}`}>
      <h2 className={styles.proposalDetailSidebarTitle}>{t('dao.proposalDetail.timeline.title')}</h2>

      <ol className={styles.proposalDetailTimeline}>
        {proposal.timeline.map((step) => (
          <li
            key={step.id}
            className={styles.proposalDetailTimelineItem}
            data-status={step.status}
          >
            <span className={styles.proposalDetailTimelineDot} aria-hidden />
            <div className={styles.proposalDetailTimelineBody}>
              <span className={styles.proposalDetailTimelineLabel}>{t(step.labelKey)}</span>
              <time className={styles.proposalDetailTimelineDate} dateTime={t(step.atKey)}>
                {t(step.atKey)}
              </time>
            </div>
          </li>
        ))}
      </ol>

      <a
        href={discordUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.proposalDetailForumLink}
        data-link="discord"
      >
        {t('dao.proposalDetail.timeline.discordDiscussion')}
        <ExternalLink size={14} aria-hidden />
      </a>
    </aside>
  );
};

export default DaoProposalTimelineCard;
