import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { HelpArticleMeta } from '../types';
import styles from './HelpGuideVoteStats.module.scss';

type VoteType = 'helpful' | 'notHelpful';

type Props = {
  article: HelpArticleMeta;
  className?: string;
};

const BUBBLE_MS = 550;

const HelpGuideVoteStats: React.FC<Props> = ({ article, className }) => {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({
    helpful: article.helpfulCount,
    notHelpful: article.notHelpfulCount,
  });
  const [bubble, setBubble] = useState<VoteType | null>(null);

  useEffect(() => {
    setCounts({
      helpful: article.helpfulCount,
      notHelpful: article.notHelpfulCount,
    });
  }, [article.slug, article.helpfulCount, article.notHelpfulCount]);

  useEffect(() => {
    if (!bubble) return undefined;
    const timer = window.setTimeout(() => setBubble(null), BUBBLE_MS);
    return () => window.clearTimeout(timer);
  }, [bubble]);

  const vote = useCallback((type: VoteType) => {
    setCounts((prev) => ({
      helpful: type === 'helpful' ? prev.helpful + 1 : prev.helpful,
      notHelpful: type === 'notHelpful' ? prev.notHelpful + 1 : prev.notHelpful,
    }));
    setBubble(type);
  }, []);

  return (
    <div
      className={[styles.guideRowStats, className].filter(Boolean).join(' ')}
      aria-label={t('help.guide.statsAria')}
    >
      <button
        type="button"
        className={`${styles.guideVoteBtn} ${styles.guideVoteBtnHelpful}`}
        aria-label={t('help.guide.voteHelpful')}
        onClick={() => vote('helpful')}
      >
        <span className={styles.guideVoteIconWrap}>
          <ThumbsUp size={13} strokeWidth={2.25} aria-hidden />
          {bubble === 'helpful' ? (
            <span className={`${styles.guideVoteBubble} ${styles.guideVoteBubbleHelpful}`}>+1</span>
          ) : null}
        </span>
        <span className={styles.guideRowStatValue}>{counts.helpful}</span>
      </button>
      <button
        type="button"
        className={`${styles.guideVoteBtn} ${styles.guideVoteBtnNotHelpful}`}
        aria-label={t('help.guide.voteNotHelpful')}
        onClick={() => vote('notHelpful')}
      >
        <span className={styles.guideVoteIconWrap}>
          <ThumbsDown size={13} strokeWidth={2.25} aria-hidden />
          {bubble === 'notHelpful' ? (
            <span className={`${styles.guideVoteBubble} ${styles.guideVoteBubbleNotHelpful}`}>+1</span>
          ) : null}
        </span>
        <span className={styles.guideRowStatValue}>{counts.notHelpful}</span>
      </button>
    </div>
  );
};

export default HelpGuideVoteStats;
