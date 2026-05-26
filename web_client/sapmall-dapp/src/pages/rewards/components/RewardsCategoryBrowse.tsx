import React from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import { REWARDS_CATEGORY_CATALOG } from '../constants/rewardsCategoryCatalog';
import type { CampaignCategoryFilter } from '../types';
import { REWARDS_CATEGORY_ICON_MAP } from '../utils/rewardsCategoryIcons';
import styles from './RewardsCategoryBrowse.module.scss';

type Props = {
  activeCategory: CampaignCategoryFilter;
  countByCategory: Readonly<Record<string, number>>;
  onCategorySelect: (category: CampaignCategoryFilter) => void;
};

const RewardsCategoryBrowse: React.FC<Props> = ({
  activeCategory,
  countByCategory,
  onCategorySelect,
}) => {
  const { t } = useTranslation();

  const handleSelect = (category: CampaignCategoryFilter) => {
    if (category !== 'all' && activeCategory === category) {
      onCategorySelect('all');
      return;
    }
    onCategorySelect(category);
  };

  const total = Object.values(countByCategory).reduce((sum, n) => sum + n, 0);

  return (
    <div className={styles.categoryBrowse} role="group" aria-label={t('rewards.categoryFilterLabel')}>
      <ul className={styles.categoryGrid}>
        <li>
          <button
            type="button"
            className={styles.categoryItem}
            data-active={activeCategory === 'all'}
            aria-pressed={activeCategory === 'all'}
            onClick={() => handleSelect('all')}
          >
            <span className={styles.categoryIcon}>
              <LayoutGrid size={20} strokeWidth={1.75} aria-hidden />
            </span>
            <span className={styles.categoryCaption}>
              <span className={styles.categoryLabel}>{t('rewards.filterAll')}</span>
              <span className={styles.categoryCount}>{total}</span>
            </span>
          </button>
        </li>
        {REWARDS_CATEGORY_CATALOG.map((item) => {
          const Icon = REWARDS_CATEGORY_ICON_MAP[item.icon];
          const isActive = activeCategory === item.category;
          return (
            <li key={item.category}>
              <button
                type="button"
                className={styles.categoryItem}
                data-active={isActive}
                data-category={item.category}
                aria-pressed={isActive}
                onClick={() => handleSelect(item.category)}
              >
                <span className={styles.categoryIcon}>
                  <Icon size={20} strokeWidth={1.75} aria-hidden />
                </span>
                <span className={styles.categoryCaption}>
                  <span className={styles.categoryLabel}>{t(`rewards.categories.${item.category}`)}</span>
                  <span className={styles.categoryCount}>
                    {countByCategory[item.category] ?? 0}
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

export default RewardsCategoryBrowse;
