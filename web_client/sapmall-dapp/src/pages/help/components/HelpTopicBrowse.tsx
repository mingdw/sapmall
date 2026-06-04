import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutGrid } from 'lucide-react';
import { HELP_TOPIC_CATALOG } from '../constants/helpTopicCatalog';
import { HELP_ARTICLES } from '../mocks/helpArticles.mock';
import type { HelpCategory, HelpCategoryFilter } from '../types';
import { HELP_TOPIC_ICON_MAP } from '../utils/helpTopicIcons';
import HelpCardTitle from './HelpCardTitle';
import sharedStyles from '../styles/help.shared.module.scss';

type Props = {
  activeCategory: HelpCategoryFilter;
  onTopicSelect: (category: HelpCategoryFilter) => void;
};

const topicItemBtn =
  'group flex w-full cursor-pointer flex-col items-center justify-start gap-[0.4rem] rounded-md border-none bg-transparent px-[0.2rem] py-[0.4rem] text-center transition-opacity';

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

  const renderItem = (
    isActive: boolean,
    icon: React.ReactNode,
    label: string,
    count: number,
    onClick: () => void,
  ) => (
    <button
      type="button"
      className={topicItemBtn}
      data-active={isActive}
      aria-pressed={isActive}
      onClick={onClick}
    >
      <span
        className={`flex h-7 w-7 items-center justify-center transition-colors [&_svg]:h-6 [&_svg]:w-6 group-hover:text-[var(--help-amber)] ${
          isActive ? 'text-[var(--help-amber-deep)]' : 'text-[var(--help-primary)]'
        }`}
      >
        {icon}
      </span>
      <span className="inline-flex max-w-full flex-wrap items-baseline justify-center gap-x-1 gap-y-0.5 leading-tight">
        <span
          className={`text-[0.6875rem] transition-colors group-hover:text-[var(--help-amber-deep)] ${
            isActive
              ? 'font-semibold text-[var(--help-amber-deep)]'
              : 'font-medium text-[var(--help-panel-text)]'
          }`}
        >
          {label}
        </span>
        <span
          className={`text-[0.625rem] font-semibold transition-colors group-hover:text-[var(--help-amber)] ${
            isActive ? 'text-[var(--help-amber-deep)]' : 'text-slate-400'
          }`}
        >
          {count}
        </span>
      </span>
    </button>
  );

  return (
    <div className="flex flex-col gap-3" role="region" aria-label={t('help.hero.browseTopics')}>
      <HelpCardTitle icon={<LayoutGrid size={18} strokeWidth={2.25} />}>
        {t('help.hero.browseTopics')}
      </HelpCardTitle>

      <ul
        className={`m-0 grid list-none grid-cols-2 gap-x-2 gap-y-[0.35rem] p-0 min-[520px]:grid-cols-4 ${sharedStyles.cardSectionBody}`}
      >
        <li>
          {renderItem(
            activeCategory === 'all',
            <LayoutGrid size={24} strokeWidth={1.75} aria-hidden />,
            t('help.topicBrowse.allTopic'),
            totalCount,
            () => onTopicSelect('all'),
          )}
        </li>
        {HELP_TOPIC_CATALOG.map((topic) => {
          const Icon = HELP_TOPIC_ICON_MAP[topic.icon];
          const isActive = activeCategory === topic.category;
          return (
            <li key={topic.category}>
              {renderItem(
                isActive,
                <Icon size={24} strokeWidth={1.75} aria-hidden />,
                t(`help.categories.${topic.category}`),
                countByCategory.get(topic.category) ?? 0,
                () => onTopicSelect(topic.category),
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HelpTopicBrowse;
