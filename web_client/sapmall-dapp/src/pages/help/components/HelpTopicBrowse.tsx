import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import { HELP_TOPIC_CATALOG } from '../constants/helpTopicCatalog';
import { HELP_ARTICLES } from '../mocks/helpArticles.mock';
import type { HelpCategory, HelpCategoryFilter } from '../types';
import { HELP_TOPIC_ICON_MAP } from '../utils/helpTopicIcons';
import HelpCardTitle from './HelpCardTitle';
import sharedStyles from '../styles/help.shared.module.scss';
import styles from './HelpTopicBrowse.module.scss';

type Props = {
  activeCategory: HelpCategoryFilter;
  onTopicSelect: (category: HelpCategoryFilter) => void;
};

const HelpTopicBrowse: React.FC<Props> = ({ activeCategory, onTopicSelect }) => {
  const { t } = useTranslation();

  const countByCategory = useMemo(() => {
    const map = new Map<HelpCategory, number>();
    for (const article of HELP_ARTICLES) {
      map.set(article.category, (map.get(article.category) ?? 0) + 1);
    }
    return map;
  }, []);

  const totalCount = HELP_ARTICLES.length;

  return (
    <div className={styles.topicBrowse} role="region" aria-label={t('help.hero.browseTopics')}>
      <HelpCardTitle icon={<LayoutGrid size={18} strokeWidth={2.25} />}>
        {t('help.hero.browseTopics')}
      </HelpCardTitle>

      <ul className={`${styles.topicBrowseGrid} ${sharedStyles.cardSectionBody}`}>
        <li>
          <button
            type="button"
            className={styles.topicBrowseItem}
            data-active={activeCategory === 'all'}
            aria-pressed={activeCategory === 'all'}
            onClick={() => onTopicSelect('all')}
          >
            <span className={styles.topicBrowseItemIcon}>
              <LayoutGrid size={24} strokeWidth={1.75} aria-hidden />
            </span>
            <span className={styles.topicBrowseItemCaption}>
              <span className={styles.topicBrowseItemLabel}>{t('help.topicBrowse.allTopic')}</span>
              <span className={styles.topicBrowseItemCount}>{totalCount}</span>
            </span>
          </button>
        </li>
        {HELP_TOPIC_CATALOG.map((topic) => {
          const Icon = HELP_TOPIC_ICON_MAP[topic.icon];
          const isActive = activeCategory === topic.category;
          return (
            <li key={topic.category}>
              <button
                type="button"
                className={styles.topicBrowseItem}
                data-active={isActive}
                aria-pressed={isActive}
                onClick={() => onTopicSelect(topic.category)}
              >
                <span className={styles.topicBrowseItemIcon}>
                  <Icon size={24} strokeWidth={1.75} aria-hidden />
                </span>
                <span className={styles.topicBrowseItemCaption}>
                  <span className={styles.topicBrowseItemLabel}>
                    {t(`help.categories.${topic.category}`)}
                  </span>
                  <span className={styles.topicBrowseItemCount}>
                    {countByCategory.get(topic.category) ?? 0}
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

export default HelpTopicBrowse;
