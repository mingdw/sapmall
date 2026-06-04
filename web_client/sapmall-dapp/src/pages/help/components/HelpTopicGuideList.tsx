import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';
import { HELP_GUIDE_PAGE_SIZE } from '../constants/helpGuide';
import type { HelpArticleMeta, HelpCategoryFilter } from '../types';
import { articleSummaryKey, articleTitleKey } from '../utils/articleI18nKey';
import HelpGuideVoteStats from './HelpGuideVoteStats';
import sharedStyles from '../styles/help.shared.module.scss';

type Props = {
  articles: HelpArticleMeta[];
  category: HelpCategoryFilter;
  keyword: string;
};

const rowHeadBtn =
  'flex w-full cursor-pointer items-center justify-between gap-3 border-none bg-transparent py-[0.8rem] text-left transition-colors hover:[&_.row-title]:text-[var(--help-primary)]';

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
      <section className={`m-0 ${sharedStyles.cardSectionBody}`} aria-label={t('help.guide.aria')}>
        <div className={sharedStyles.emptyState}>{t('help.empty')}</div>
      </section>
    );
  }

  return (
    <section className={`m-0 ${sharedStyles.cardSectionBody}`} aria-label={t('help.guide.aria')}>
      {hasKeyword ? (
        <p className="mb-[0.65rem] text-xs font-medium text-slate-400">{t('help.guide.searchResults')}</p>
      ) : null}
      <ul className="m-0 list-none p-0">
        {pageArticles.map((article) => {
          const isOpen = expandedSlug === article.slug;
          return (
            <li key={article.slug} className="border-b border-[#eef1f5] last:border-b-0">
              <div className="p-0">
                <button
                  type="button"
                  className={rowHeadBtn}
                  aria-expanded={isOpen}
                  onClick={() => toggleExpand(article.slug)}
                >
                  <span className="row-title m-0 min-w-0 flex-1 text-sm font-medium leading-snug tracking-wide text-[var(--help-panel-text)] transition-colors">
                    {t(articleTitleKey(article.slug))}
                  </span>
                  <ChevronDown
                    className={`h-[18px] w-[18px] shrink-0 text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 text-[var(--help-primary)]' : ''
                    }`}
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </button>

                {isOpen && (
                  <div className="overflow-visible pb-[0.85rem]">
                    <Link
                      to={`/help/a/${article.slug}`}
                      className="mb-[0.55rem] line-clamp-3 text-xs font-normal leading-relaxed text-slate-500 no-underline transition-colors hover:text-[var(--help-primary)]"
                      title={t(articleSummaryKey(article.slug))}
                    >
                      {t(articleSummaryKey(article.slug))}
                    </Link>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <HelpGuideVoteStats article={article} />
                      <time
                        className="ml-auto shrink-0 whitespace-nowrap text-[0.6875rem] font-medium tracking-wide text-slate-400"
                        dateTime={article.updatedAt}
                      >
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
          className="help-guide-pagination mt-4 flex justify-end"
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
