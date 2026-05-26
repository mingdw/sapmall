import React from 'react';
import { useTranslation } from 'react-i18next';
import DaoDiscussionReplyEditor from './DaoDiscussionReplyEditor';
import styles from './DaoDiscussionReplyComposer.module.scss';

type Props = {
  discussionId: string;
  onReplyPosted: () => void;
};

const DaoDiscussionReplyComposer: React.FC<Props> = ({ discussionId, onReplyPosted }) => {
  const { t } = useTranslation();

  return (
    <section
      id="dao-discussion-reply-composer"
      className={styles.discussionReplyComposer}
      aria-labelledby="dao-discussion-reply-title"
    >
      <h2 id="dao-discussion-reply-title" className={styles.discussionReplyComposerTitle}>
        {t('dao.discussionDetail.composer.title')}
      </h2>
      <DaoDiscussionReplyEditor discussionId={discussionId} variant="footer" onPosted={onReplyPosted} />
    </section>
  );
};

export default DaoDiscussionReplyComposer;
