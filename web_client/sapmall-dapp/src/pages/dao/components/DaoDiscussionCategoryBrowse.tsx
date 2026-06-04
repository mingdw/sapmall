import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import { DAO_DISCUSSION_CATEGORY_CATALOG } from '../constants/discussionCategoryCatalog';
import type { DaoDiscussionCategory, DaoDiscussionCategoryFilter } from '../types';
import { DAO_DISCUSSION_CATEGORY_ICON_MAP } from '../utils/daoDiscussionCategoryIcons';

export type DaoDiscussionCategoryCounts = {
  total: number;
  byCategory: Readonly<Record<DaoDiscussionCategory, number>>;
};

type Props = {
  activeCategory: DaoDiscussionCategoryFilter;
  counts: DaoDiscussionCategoryCounts;
  onCategorySelect: (category: DaoDiscussionCategoryFilter) => void;
};

const browseBtn =
  'group flex w-full cursor-pointer flex-col items-center justify-start gap-[0.4rem] rounded-md border-none bg-transparent px-[0.2rem] py-[0.4rem] text-center transition-[color,opacity]';

const browseIcon =
  'flex h-7 w-7 items-center justify-center text-[var(--dao-tab-discussions-muted)] transition-colors ' +
  '[&_svg]:h-6 [&_svg]:w-6 group-hover:text-[var(--dao-tab-discussions)] group-data-[active=true]:text-[var(--dao-primary)]';

const browseLabel =
  'text-[0.6875rem] font-medium text-[var(--dao-panel-text)] transition-colors group-hover:text-[var(--dao-primary)] group-data-[active=true]:font-semibold group-data-[active=true]:text-[var(--dao-primary)]';

const browseCount =
  'text-[0.625rem] font-semibold text-slate-400 transition-colors group-hover:text-[var(--dao-tab-discussions)] group-data-[active=true]:text-[var(--dao-primary)]';

const DaoDiscussionCategoryBrowse: React.FC<Props> = ({
  activeCategory,
  counts,
  onCategorySelect,
}) => {
  const { t } = useTranslation();

  const handleSelect = (category: DaoDiscussionCategoryFilter) => {
    if (category !== 'all' && activeCategory === category) {
      onCategorySelect('all');
      return;
    }
    onCategorySelect(category);
  };

  const renderItem = (
    category: DaoDiscussionCategoryFilter,
    icon: React.ReactNode,
    label: string,
    count: number,
  ) => {
    const isActive = activeCategory === category;
    return (
      <li>
        <button
          type="button"
          className={browseBtn}
          data-active={isActive}
          aria-pressed={isActive}
          onClick={() => handleSelect(category)}
        >
          <span className={browseIcon}>{icon}</span>
          <span className="inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-1 gap-y-0 leading-tight">
            <span className={browseLabel}>{label}</span>
            <span className={browseCount}>{count}</span>
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="border-b border-slate-200 px-5 pb-2 pt-3" role="region" aria-label={t('dao.categoryBrowse.aria')}>
      <ul className="m-0 grid list-none grid-cols-2 gap-x-2 gap-y-[0.35rem] p-0 min-[520px]:grid-cols-4">
        {renderItem(
          'all',
          <LayoutGrid size={24} strokeWidth={1.75} aria-hidden />,
          t('dao.filters.discussions.all'),
          counts.total,
        )}
        {DAO_DISCUSSION_CATEGORY_CATALOG.map((board) => {
          const Icon = DAO_DISCUSSION_CATEGORY_ICON_MAP[board.icon];
          return (
            <React.Fragment key={board.category}>
              {renderItem(
                board.category,
                <Icon size={24} strokeWidth={1.75} aria-hidden />,
                t(`dao.filters.discussions.${board.category}`),
                counts.byCategory[board.category] ?? 0,
              )}
            </React.Fragment>
          );
        })}
      </ul>
    </div>
  );
};

export default DaoDiscussionCategoryBrowse;
