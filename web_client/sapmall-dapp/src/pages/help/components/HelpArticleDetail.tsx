import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Clock, Eye } from 'lucide-react';
import HelpArticleBody from './HelpArticleBody';
import HelpGuideVoteStats from './HelpGuideVoteStats';
import type { HelpArticleMeta } from '../types';
import { articleTitleKey } from '../utils/articleI18nKey';
import { formatHelpMetricNumber } from '../utils/formatHelpMetric';
import { getRelatedTopicArticles } from '../utils/getRelatedTopicArticles';
import { helpHomePath, helpTopicPath } from '../utils/helpTopicNavigation';
import styles from '../HelpPage.module.scss';

type Props = {
  article: HelpArticleMeta;
};

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
    <div className={styles.contentZoneInnerFull}>
      <article
        className={`${styles.panelCard} ${styles.panelCardAccent} ${styles.articleDetailCard}`}
        aria-label={t('help.article.aria')}
      >
        <header className={styles.articleDetailHead}>
          <nav className={styles.articleDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={helpHomePath} className={styles.articleDetailBreadcrumbLink}>
              {t('navigation.help')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link
              to={helpTopicPath(article.category)}
              className={styles.articleDetailBreadcrumbLink}
            >
              {t(`help.categories.${article.category}`)}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className={styles.articleDetailBreadcrumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>

          <div className={styles.articleDetailTitleRow}>
            <div className={styles.articleDetailTitleSide} aria-hidden />
            <h1 className={styles.articleDetailTitle}>{title}</h1>
            <HelpGuideVoteStats article={article} className={styles.articleDetailVote} />
          </div>

          <div className={styles.articleDetailMeta}>
            <span
              className={styles.articleDetailMetric}
              data-metric="views"
              title={t('help.article.views')}
            >
              <Eye size={14} strokeWidth={2.25} aria-hidden />
              <span className={styles.articleDetailMetricValue}>{viewsLabel}</span>
            </span>
            <span
              className={styles.articleDetailMetric}
              data-metric="updated"
              title={t('help.article.updated')}
            >
              <Clock size={14} strokeWidth={2.25} aria-hidden />
              <time className={styles.articleDetailMetricValue} dateTime={article.updatedAt}>
                {article.updatedAt}
              </time>
            </span>
          </div>
        </header>

        <div className={styles.articleDetailBody}>
          <HelpArticleBody blocks={article.blocks} slug={article.slug} />
        </div>

        {relatedArticles.length > 0 && (
          <div className={styles.articleDetailFooter}>
            <section className={styles.articleRelated}>
              <h2 className={styles.articleRelatedTitle}>{t('help.related')}</h2>
              <ul className={styles.articleRelatedList}>
                {relatedArticles.map((related) => (
                  <li key={related.slug}>
                    <Link to={`/help/a/${related.slug}`} className={styles.articleRelatedLink}>
                      {t(articleTitleKey(related.slug))}
                      <ChevronRight size={16} aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </article>
    </div>
  );
};

export default HelpArticleDetail;
