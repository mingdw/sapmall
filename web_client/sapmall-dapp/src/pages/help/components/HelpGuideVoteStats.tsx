import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import type { HelpArticleMeta } from '../types';

type VoteType = 'helpful' | 'notHelpful';

type Props = {
  article: HelpArticleMeta;
  className?: string;
};

const BUBBLE_MS = 550;

const voteBtn =
  'relative inline-flex items-center gap-1 rounded-md border-none bg-transparent px-1 py-0.5 text-[0.6875rem] font-medium text-slate-400 transition-colors hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500/45 active:[&_.stat-value]:text-[var(--help-panel-text)]';

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
      className={['inline-flex flex-wrap items-center gap-x-3 gap-y-2 overflow-visible', className]
        .filter(Boolean)
        .join(' ')}
      aria-label={t('help.guide.statsAria')}
    >
      <button
        type="button"
        className={voteBtn}
        aria-label={t('help.guide.voteHelpful')}
        onClick={() => vote('helpful')}
      >
        <span className="relative inline-flex items-center justify-center">
          <ThumbsUp size={13} strokeWidth={2.25} className="text-green-600" aria-hidden />
          {bubble === 'helpful' ? (
            <span className="pointer-events-none absolute -top-[1.35rem] left-1/2 z-[2] animate-help-vote-bubble whitespace-nowrap rounded-md bg-green-600 px-1.5 py-0.5 text-[0.625rem] font-bold leading-tight text-white shadow-[0_2px_8px_rgba(15,23,42,0.12)]">
              +1
            </span>
          ) : null}
        </span>
        <span className="stat-value font-medium tabular-nums text-slate-500 transition-colors">
          {counts.helpful}
        </span>
      </button>
      <button
        type="button"
        className={voteBtn}
        aria-label={t('help.guide.voteNotHelpful')}
        onClick={() => vote('notHelpful')}
      >
        <span className="relative inline-flex items-center justify-center">
          <ThumbsDown size={13} strokeWidth={2.25} className="text-red-600" aria-hidden />
          {bubble === 'notHelpful' ? (
            <span className="pointer-events-none absolute -top-[1.35rem] left-1/2 z-[2] animate-help-vote-bubble whitespace-nowrap rounded-md bg-red-600 px-1.5 py-0.5 text-[0.625rem] font-bold leading-tight text-white shadow-[0_2px_8px_rgba(15,23,42,0.12)]">
              +1
            </span>
          ) : null}
        </span>
        <span className="stat-value font-medium tabular-nums text-slate-500 transition-colors">
          {counts.notHelpful}
        </span>
      </button>
    </div>
  );
};

export default HelpGuideVoteStats;
