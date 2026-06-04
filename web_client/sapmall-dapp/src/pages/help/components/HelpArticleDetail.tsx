import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Clock, Eye } from 'lucide-react';
import HelpArticleBody from './HelpArticleBody';
import HelpArticleRelated from './HelpArticleRelated';
import HelpGuideVoteStats from './HelpGuideVoteStats';
import type { HelpArticleMeta } from '../types';
import { articleTitleKey } from '../utils/articleI18nKey';
import { formatHelpMetricNumber } from '../utils/formatHelpMetric';
import { getRelatedTopicArticles } from '../utils/getRelatedTopicArticles';
import { helpHomePath, helpTopicPath } from '../utils/helpTopicNavigation';
import { HELP_LAYOUT } from '../constants/helpLayoutClasses';
import sharedStyles from '../styles/help.shared.module.scss';

type Props = {
  article: HelpArticleMeta;
};

const breadcrumbLink =
  'font-medium text-[var(--help-primary)] no-underline transition-colors hover:text-violet-700 hover:underline';

const HelpArticleDetail: React.FC<Props> = ({ article }) => {
  const { t, i18n } = useTranslation();
  const title = t(articleTitleKey(article.slug));
  const viewsLabel = formatHelpMetricNumber(article.viewCount, i18n.language);

  const relatedArticles = useMemo(
    () => getRelatedTopicArticles(article.slug, article.category),
    [article.slug, article.category],
  );

  useEffect(() => {
    const zone = document.getElementById('help-content-zone');
    zone?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [article.slug]);

  return (
    <div className={HELP_LAYOUT.contentZoneInnerFull}>
      <article
        className={`${sharedStyles.panelCard} px-[1.15rem] pb-6 pt-[1.15rem] md:px-[1.65rem] md:pb-7 md:pt-[1.35rem]`}
        aria-label={t('help.article.aria')}
      >
        <header className="mb-4 flex flex-col gap-3">
          <nav
            className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-slate-400"
            aria-label="Breadcrumb"
          >
            <Link to={helpHomePath} className={breadcrumbLink}>
              {t('navigation.help')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={helpTopicPath(article.category)} className={breadcrumbLink}>
              {t(`help.categories.${article.category}`)}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span
              className="max-w-full truncate font-medium text-[var(--help-panel-muted)]"
              aria-current="page"
            >
              {title}
            </span>
          </nav>

          <div className="grid grid-cols-1 items-center gap-2 text-center max-sm:justify-items-center sm:grid-cols-[minmax(5.5rem,1fr)_minmax(0,2.2fr)_minmax(5.5rem,1fr)] sm:gap-x-3">
            <div className="hidden min-h-px sm:block" aria-hidden />
            <h1 className="m-0 text-center text-[clamp(1.125rem,2.5vw,1.5rem)] font-semibold leading-snug tracking-tight text-[var(--help-panel-text)]">
              {title}
            </h1>
            <HelpGuideVoteStats article={article} className="sm:justify-self-end max-sm:justify-self-center" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-[1.1rem] gap-y-[0.65rem]">
            <span
              className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[var(--help-panel-muted)] [&_svg]:shrink-0 [&_svg]:text-[var(--help-primary)]"
              title={t('help.article.views')}
            >
              <Eye size={14} strokeWidth={2.25} aria-hidden />
              <span className="font-semibold tabular-nums tracking-wide text-slate-500">{viewsLabel}</span>
            </span>
            <span
              className="inline-flex items-center gap-1.5 text-[0.8125rem] text-[var(--help-panel-muted)] [&_svg]:shrink-0 [&_svg]:text-[var(--help-amber-deep)]"
              title={t('help.article.updated')}
            >
              <Clock size={14} strokeWidth={2.25} aria-hidden />
              <time
                className="font-semibold tabular-nums tracking-wide text-slate-500"
                dateTime={article.updatedAt}
              >
                {article.updatedAt}
              </time>
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-[52rem]">
          <HelpArticleBody blocks={article.blocks} slug={article.slug} />
        </div>

        {relatedArticles.length > 0 && (
          <div className="mt-7">
            <HelpArticleRelated articles={relatedArticles} category={article.category} />
          </div>
        )}
      </article>
    </div>
  );
};

export default HelpArticleDetail;
