import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER,
  type DaoDiscussionTopicTagFilter,
} from '../constants/discussionTopicTags';
import type { DaoDiscussionTopicTag } from '../types';
import sharedStyles from '../styles/dao.shared.module.scss';
import styles from './DaoDiscussionTopicTagsCard.module.scss';

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
      className={styles.discussionTagFilterBtn}
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
      className={`${sharedStyles.panelCard} ${styles.discussionTagFilterPanel}`}
      role="group"
      aria-label={t('dao.topicTagFilter.groupAria')}
    >
      <div className={styles.discussionTagFilterGrid}>
        {renderTagButton('all', t('dao.topicTagFilter.all'))}
        {DAO_DISCUSSION_TOPIC_TAG_DISPLAY_ORDER.map((tag: DaoDiscussionTopicTag) =>
          renderTagButton(tag, t(`dao.topicTags.${tag}`)),
        )}
      </div>
    </div>
  );
};

export default DaoDiscussionTopicTagsCard;



