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
import styles from '../HelpPage.module.scss';

type Props = {
  articles: HelpArticleMeta[];
  category: HelpCategory;
};

const formatArticleIndex = (slug: string): string => {
  const index = parseTopicQaArticleIndex(slug) + 1;
  return String(index).padStart(2, '0');
};

const HelpArticleRelated: React.FC<Props> = ({ articles, category }) => {
  const { t, i18n } = useTranslation();

  if (articles.length === 0) return null;

  const topicMeta = HELP_TOPIC_CATALOG.find((item) => item.category === category);
  const TopicIcon = topicMeta ? HELP_TOPIC_ICON_MAP[topicMeta.icon] : BookOpen;
  const categoryLabel = t(`help.categories.${category}`);

  return (
    <section className={styles.articleRelated} aria-labelledby="help-related-heading">
      <div className={styles.articleRelatedPanel}>
        <header className={styles.articleRelatedHead}>
          <div className={styles.articleRelatedHeadMain}>
            <HelpCardTitle id="help-related-heading" icon={<BookOpen size={18} strokeWidth={2.25} />}>
              {t('help.related')}
            </HelpCardTitle>
            <p className={styles.articleRelatedHint}>
              {t('help.relatedHint', { category: categoryLabel })}
            </p>
          </div>
          <Link to={helpTopicPath(category)} className={styles.articleRelatedViewAll}>
            <span className={styles.articleRelatedViewAllIcon} aria-hidden>
              <TopicIcon size={15} strokeWidth={2.25} />
            </span>
            <span>{t('help.relatedViewAll')}</span>
            <ArrowUpRight size={14} strokeWidth={2.25} aria-hidden />
          </Link>
        </header>

        <ul className={styles.articleRelatedGrid}>
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
                  className={styles.articleRelatedCard}
                  aria-label={`${title}${summary ? ` — ${summary}` : ''}`}
                >
                  <span className={styles.articleRelatedCardIndex} aria-hidden>
                    {formatArticleIndex(article.slug)}
                  </span>
                  <span className={styles.articleRelatedCardBody}>
                    <span className={styles.articleRelatedCardTitle}>{title}</span>
                    {summary ? (
                      <span className={styles.articleRelatedCardSummary}>{summary}</span>
                    ) : null}
                    <span className={styles.articleRelatedCardMeta}>
                      <span className={styles.articleRelatedCardMetric} title={t('help.article.views')}>
                        <Eye size={13} strokeWidth={2.25} aria-hidden />
                        {viewsLabel}
                      </span>
                      <span className={styles.articleRelatedCardMetric} title={t('help.guide.helpful')}>
                        <ThumbsUp size={13} strokeWidth={2.25} aria-hidden />
                        {helpfulLabel}
                      </span>
                    </span>
                  </span>
                  <span className={styles.articleRelatedCardArrow} aria-hidden>
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
