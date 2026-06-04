import React from 'react';
import { useTranslation } from 'react-i18next';
import { DAO_REPLY } from '../constants/daoReplyComposerClasses';
import DaoDiscussionReplyEditor from './DaoDiscussionReplyEditor';

type Props = {
  discussionId: string;
  onReplyPosted: () => void;
};

const DaoDiscussionReplyComposer: React.FC<Props> = ({ discussionId, onReplyPosted }) => {
  const { t } = useTranslation();

  return (
    <section
      id="dao-discussion-reply-composer"
      className={DAO_REPLY.composer}
      aria-labelledby="dao-discussion-reply-title"
    >
      <h2 id="dao-discussion-reply-title" className={DAO_REPLY.composerTitle}>
        {t('dao.discussionDetail.composer.title')}
      </h2>
      <DaoDiscussionReplyEditor discussionId={discussionId} variant="footer" onPosted={onReplyPosted} />
    </section>
  );
};

export default DaoDiscussionReplyComposer;
