import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { HELP_GUIDE_PAGE_SIZE } from '../constants/helpGuide';
import type { HelpArticleMeta, HelpCategoryFilter } from '../types';
import { articleSummaryKey, articleTitleKey } from '../utils/articleI18nKey';
import HelpGuideVoteStats from './HelpGuideVoteStats';
import styles from '../HelpPage.module.scss';

type Props = {
  articles: HelpArticleMeta[];
  category: HelpCategoryFilter;
  keyword: string;
};

const HelpTopicGuideList: React.FC<Props> = ({ articles, category, keyword }) => {
  const { t } = useTranslation();
  const hasKeyword = keyword.trim().length > 0;
  const [page, setPage] = useState(1);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  const sortedArticles = useMemo(
    () => [...articles].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [articles],
  );

  useEffect(() => {
    setPage(1);
    setExpandedSlug(null);
  }, [category, keyword, articles]);

  const pageArticles = useMemo(() => {
    const start = (page - 1) * HELP_GUIDE_PAGE_SIZE;
    return sortedArticles.slice(start, start + HELP_GUIDE_PAGE_SIZE);
  }, [sortedArticles, page]);

  const toggleExpand = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  if (sortedArticles.length === 0) {
    return (
      <section className={`${styles.guideList} ${styles.cardSectionBody}`} aria-label={t('help.guide.aria')}>
        <div className={styles.emptyState}>{t('help.empty')}</div>
      </section>
    );
  }

  return (
    <section className={`${styles.guideList} ${styles.cardSectionBody}`} aria-label={t('help.guide.aria')}>
      {hasKeyword ? (
        <p className={styles.guideListHint}>{t('help.guide.searchResults')}</p>
      ) : null}
      <ul className={styles.guideRows}>
        {pageArticles.map((article) => {
          const isOpen = expandedSlug === article.slug;
          return (
            <li key={article.slug} className={styles.guideRowItem}>
              <div className={styles.guideRow}>
                <button
                  type="button"
                  className={styles.guideRowHead}
                  aria-expanded={isOpen}
                  onClick={() => toggleExpand(article.slug)}
                >
                  <span className={styles.guideRowTitle}>{t(articleTitleKey(article.slug))}</span>
                  <ChevronDown
                    className={styles.guideRowChevron}
                    data-expanded={isOpen}
                    size={18}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </button>

                {isOpen && (
                  <div className={styles.guideRowBody}>
                    <Link
                      to={`/help/a/${article.slug}`}
                      className={styles.guideRowSummaryLink}
                      title={t(articleSummaryKey(article.slug))}
                    >
                      {t(articleSummaryKey(article.slug))}
                    </Link>
                    <div className={styles.guideRowFoot}>
                      <HelpGuideVoteStats article={article} />
                      <time className={styles.guideRowDate} dateTime={article.updatedAt}>
                        {t('help.updated', { date: article.updatedAt })}
                      </time>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {sortedArticles.length > HELP_GUIDE_PAGE_SIZE && (
        <Pagination
          className={styles.guidePagination}
          current={page}
          pageSize={HELP_GUIDE_PAGE_SIZE}
          total={sortedArticles.length}
          onChange={setPage}
          showSizeChanger={false}
          showLessItems
        />
      )}
    </section>
  );
};

export default HelpTopicGuideList;
