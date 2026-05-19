import React, { useState } from 'react';
import { Avatar, Button, Input, Select } from 'antd';
import { LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAccount } from 'wagmi';
import { Comment } from '../types/proposal.types';
import { formatRelativeTime } from '../utils/proposalUtils';
import styles from './DiscussionThread.module.scss';

interface DiscussionThreadProps {
  comments: Comment[];
  proposalId: string;
  holdersOnly?: boolean;
}

const DiscussionThread: React.FC<DiscussionThreadProps> = ({
  comments: initial,
  proposalId,
  holdersOnly,
}) => {
  const { t, i18n } = useTranslation();
  const { isConnected } = useAccount();
  const [comments, setComments] = useState(initial);
  const [sort, setSort] = useState<'latest' | 'hot'>('latest');
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);

  const sorted = [...comments].sort((a, b) => {
    if (sort === 'hot') return b.likes - a.likes;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handlePost = async () => {
    if (!draft.trim()) return;
    setPosting(true);
    await new Promise((r) => setTimeout(r, 300));
    setComments([
      {
        id: `local-${Date.now()}`,
        authorAddress: '0xYou...',
        authorDisplay: t('dao.discussion.you'),
        content: draft.trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      },
      ...comments,
    ]);
    setDraft('');
    setPosting(false);
  };

  return (
    <section className={styles.wrap}>
      {holdersOnly && (
        <p className={styles.holdersHint}>{t('dao.discussion.holdersOnly')}</p>
      )}
      <header className={styles.toolbar}>
        <Select
          size="small"
          value={sort}
          onChange={setSort}
          options={[
            { value: 'latest', label: t('dao.discussion.sortLatest') },
            { value: 'hot', label: t('dao.discussion.sortHot') },
          ]}
          className={styles.sortSelect}
        />
        <span className={styles.count}>
          {t('dao.discussion.count', { count: comments.length })}
        </span>
      </header>

      <section className={styles.composer} aria-label={t('dao.discussion.reply')}>
        <Input.TextArea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            isConnected
              ? t('dao.discussion.placeholder')
              : t('dao.discussion.connectToReply')
          }
          disabled={!isConnected}
          rows={3}
          aria-label={t('dao.discussion.reply')}
        />
        <Button
          type="primary"
          className={styles.postBtn}
          loading={posting}
          disabled={!isConnected || !draft.trim()}
          onClick={handlePost}
        >
          {t('dao.discussion.post')}
        </Button>
      </section>

      {sorted.length === 0 ? (
        <p className={styles.empty}>{t('dao.discussion.empty')}</p>
      ) : (
        <ul className={styles.list}>
          {sorted.map((c) => (
            <li key={c.id} className={styles.comment}>
              <Avatar className={styles.avatar}>{c.authorDisplay[0]?.toUpperCase()}</Avatar>
              <article className={styles.body}>
                <header className={styles.commentHead}>
                  <span className={styles.author}>{c.authorDisplay}</span>
                  <time className={styles.time} dateTime={c.createdAt}>
                    {formatRelativeTime(c.createdAt, i18n.language)}
                  </time>
                </header>
                <p className={styles.content}>{c.content}</p>
                <footer className={styles.actions}>
                  <button type="button" className={styles.actionBtn} aria-label={t('dao.discussion.like')}>
                    <LikeOutlined /> {c.likes}
                  </button>
                  <button type="button" className={styles.actionBtn}>
                    <MessageOutlined /> {t('dao.discussion.reply')}
                  </button>
                </footer>
                {c.replies?.map((r) => (
                  <article key={r.id} className={styles.reply}>
                    <span className={styles.author}>{r.authorDisplay}</span>
                    <p className={styles.content}>{r.content}</p>
                  </article>
                ))}
              </article>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default DiscussionThread;
