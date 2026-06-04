import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpRight, BookOpen, Eye, ThumbsUp } from 'lucide-react';
import { HELP_TOPIC_CATALOG } from '../constants/helpTopicCatalog';
import type { HelpArticleMeta, HelpCategory } from '../types';
import { articleSummaryKey, articleTitleKey } from '../utils/articleI18nKey';
import { formatHelpMetricNumber } from '../utils/formatHelpMetric';
import { HELP_TOPIC_ICON_MAP } from '../utils/helpTopicIcons';
import { helpTopicPath } from '../utils/helpTopicNavigation';
import { parseTopicQaArticleIndex } from '../utils/helpTopicSlug';
import HelpCardTitle from './HelpCardTitle';

type Props = {
  articles: HelpArticleMeta[];
  category: HelpCategory;
};

const formatArticleIndex = (slug: string): string => {
  const index = parseTopicQaArticleIndex(slug) + 1;
  return String(index).padStart(2, '0');
};

const relatedCard =
  'group flex h-full items-start gap-[0.7rem] rounded-[0.72rem] border border-violet-500/10 bg-violet-500/[0.06] px-[0.9rem] py-[0.85rem] text-inherit no-underline shadow-none transition-[border-color,background,box-shadow,transform] hover:-translate-y-px hover:border-violet-500/20 hover:bg-violet-500/[0.12] hover:shadow-[0_4px_14px_rgba(139,92,246,0.08)] motion-reduce:transition-none motion-reduce:hover:translate-y-0';

const HelpArticleRelated: React.FC<Props> = ({ articles, category }) => {
  const { t, i18n } = useTranslation();

  if (articles.length === 0) return null;

  const topicMeta = HELP_TOPIC_CATALOG.find((item) => item.category === category);
  const TopicIcon = topicMeta ? HELP_TOPIC_ICON_MAP[topicMeta.icon] : BookOpen;
  const categoryLabel = t(`help.categories.${category}`);

  return (
    <section className="m-0" aria-labelledby="help-related-heading">
      <div className="border-t border-slate-900/10 pt-[1.15rem] md:pt-5">
        <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1 min-w-[min(100%,14rem)]">
            <HelpCardTitle id="help-related-heading" icon={<BookOpen size={18} strokeWidth={2.25} />}>
              {t('help.related')}
            </HelpCardTitle>
            <p
              className="mt-[0.35rem] pl-[var(--help-card-content-indent)] text-xs leading-relaxed text-[var(--help-panel-muted)]"
            >
              {t('help.relatedHint', { category: categoryLabel })}
            </p>
          </div>
          <Link
            to={helpTopicPath(category)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-violet-500/20 bg-white/90 px-3 py-[0.42rem] text-xs font-semibold text-[var(--help-primary)] no-underline transition-[border-color,background,box-shadow,color] hover:border-violet-500/40 hover:bg-white hover:text-violet-700 hover:shadow-[0_4px_14px_rgba(139,92,246,0.12)] motion-reduce:transition-none"
          >
            <span
              className="inline-flex h-[1.35rem] w-[1.35rem] items-center justify-center rounded-full bg-violet-500/10 text-[var(--help-primary)]"
              aria-hidden
            >
              <TopicIcon size={15} strokeWidth={2.25} />
            </span>
            <span>{t('help.relatedViewAll')}</span>
            <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden />
          </Link>
        </header>

        <ul className="m-0 grid list-none grid-cols-1 gap-[0.55rem] p-0 min-[640px]:grid-cols-2 min-[640px]:gap-[0.65rem]">
          {articles.map((article) => {
            const title = t(articleTitleKey(article.slug));
            const summaryKey = articleSummaryKey(article.slug);
            const summary = i18n.exists(summaryKey) ? t(summaryKey) : null;
            const viewsLabel = formatHelpMetricNumber(article.viewCount, i18n.language);
            const helpfulLabel = formatHelpMetricNumber(article.helpfulCount, i18n.language);

            return (
              <li key={article.slug}>
                <Link
                  to={`/help/a/${article.slug}`}
                  className={relatedCard}
                  aria-label={`${title}${summary ? ` — ${summary}` : ''}`}
                >
                  <span
                    className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-[0.55rem] border border-violet-500/15 bg-violet-500/10 px-1.5 text-[0.6875rem] font-bold tabular-nums tracking-wide text-violet-700 transition-[background,color,border-color] group-hover:border-violet-500/30 group-hover:bg-violet-500/20 group-hover:text-violet-800"
                    aria-hidden
                  >
                    {formatArticleIndex(article.slug)}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="block text-[0.8125rem] font-semibold leading-snug text-[var(--help-panel-text)] transition-colors group-hover:text-[var(--help-primary)]">
                      {title}
                    </span>
                    {summary ? (
                      <span className="line-clamp-2 text-[0.6875rem] font-normal leading-snug text-[var(--help-panel-muted)]">
                        {summary}
                      </span>
                    ) : null}
                    <span className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span
                        className="inline-flex items-center gap-1 text-[0.625rem] font-semibold tabular-nums text-slate-400 [&_svg]:shrink-0 [&_svg]:text-[var(--help-primary)]"
                        title={t('help.article.views')}
                      >
                        <Eye size={13} strokeWidth={2.25} aria-hidden />
                        {viewsLabel}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-[0.625rem] font-semibold tabular-nums text-slate-400 [&_svg]:shrink-0 [&_svg]:text-green-600"
                        title={t('help.guide.helpful')}
                      >
                        <ThumbsUp size={13} strokeWidth={2.25} aria-hidden />
                        {helpfulLabel}
                      </span>
                    </span>
                  </span>
                  <span
                    className="shrink-0 self-center text-slate-400 opacity-35 transition-[opacity,transform,color] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--help-primary)] group-hover:opacity-100 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
                    aria-hidden
                  >
                    <ArrowUpRight size={16} strokeWidth={2.25} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};

export default HelpArticleRelated;
