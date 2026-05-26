import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import { DAO_DISCUSSION_CATEGORY_CATALOG } from '../constants/discussionCategoryCatalog';
import type { DaoDiscussionCategory, DaoDiscussionCategoryFilter } from '../types';
import { DAO_DISCUSSION_CATEGORY_ICON_MAP } from '../utils/daoDiscussionCategoryIcons';
import styles from './DaoDiscussionCategoryBrowse.module.scss';

export type DaoDiscussionCategoryCounts = {
  total: number;
  byCategory: Readonly<Record<DaoDiscussionCategory, number>>;
};

type Props = {
  activeCategory: DaoDiscussionCategoryFilter;
  counts: DaoDiscussionCategoryCounts;
  onCategorySelect: (category: DaoDiscussionCategoryFilter) => void;
};

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

  return (
    <div
      className={styles.categoryBrowse}
      role="region"
      aria-label={t('dao.categoryBrowse.aria')}
    >
      <ul className={styles.categoryBrowseGrid}>
        <li>
          <button
            type="button"
            className={styles.categoryBrowseItem}
            data-active={activeCategory === 'all'}
            aria-pressed={activeCategory === 'all'}
            onClick={() => handleSelect('all')}
          >
            <span className={styles.categoryBrowseItemIcon}>
              <LayoutGrid size={24} strokeWidth={1.75} aria-hidden />
            </span>
            <span className={styles.categoryBrowseItemCaption}>
              <span className={styles.categoryBrowseItemLabel}>
                {t('dao.filters.discussions.all')}
              </span>
              <span className={styles.categoryBrowseItemCount}>{counts.total}</span>
            </span>
          </button>
        </li>
        {DAO_DISCUSSION_CATEGORY_CATALOG.map((board) => {
          const Icon = DAO_DISCUSSION_CATEGORY_ICON_MAP[board.icon];
          const isActive = activeCategory === board.category;
          return (
            <li key={board.category}>
              <button
                type="button"
                className={styles.categoryBrowseItem}
                data-active={isActive}
                aria-pressed={isActive}
                onClick={() => handleSelect(board.category)}
              >
                <span className={styles.categoryBrowseItemIcon}>
                  <Icon size={24} strokeWidth={1.75} aria-hidden />
                </span>
                <span className={styles.categoryBrowseItemCaption}>
                  <span className={styles.categoryBrowseItemLabel}>
                    {t(`dao.filters.discussions.${board.category}`)}
                  </span>
                  <span className={styles.categoryBrowseItemCount}>
                    {counts.byCategory[board.category] ?? 0}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DaoDiscussionCategoryBrowse;
