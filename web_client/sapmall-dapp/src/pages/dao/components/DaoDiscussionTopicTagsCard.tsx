import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER,
  type DaoDiscussionTopicTagFilter,
} from '../constants/discussionTopicTags';
import { getDaoTopicTagFilterClass } from '../constants/daoTopicTagFilterClasses';
import type { DaoDiscussionTopicTag } from '../types';
import sharedStyles from '../styles/dao.shared.module.scss';

type Props = {
  activeFilter: DaoDiscussionTopicTagFilter;
  onFilterChange: (filter: DaoDiscussionTopicTagFilter) => void;
};

const DaoDiscussionTopicTagsCard: React.FC<Props> = ({ activeFilter, onFilterChange }) => {
  const { t } = useTranslation();

  const renderTagButton = (filter: DaoDiscussionTopicTagFilter, label: string) => (
    <button
      key={filter}
      type="button"
      className={getDaoTopicTagFilterClass(filter, activeFilter === filter)}
      data-tag={filter === 'all' ? 'all' : filter}
      data-active={activeFilter === filter ? 'true' : 'false'}
      aria-pressed={activeFilter === filter}
      onClick={() => onFilterChange(filter)}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`${sharedStyles.panelCard} box-border w-full px-[1.15rem] py-4`}
      role="group"
      aria-label={t('dao.topicTagFilter.groupAria')}
    >
      <div className="flex flex-wrap justify-start gap-[0.4rem]">
        {renderTagButton('all', t('dao.topicTagFilter.all'))}
        {DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER.map((tag: DaoDiscussionTopicTag) =>
          renderTagButton(tag, t(`dao.topicTags.${tag}`)),
        )}
      </div>
    </div>
  );
};

export default DaoDiscussionTopicTagsCard;
