import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, ShieldCheck } from 'lucide-react';
import type { DaoDiscussionReplyItem } from '../types';
import { shortenWalletAddress } from '../utils/walletAddress';
import styles from '../DaoPage.module.scss';

type Props = {
  replies: DaoDiscussionReplyItem[];
  opAuthorAddress: string;
};

const formatUserReplyTime = (createdAt: number, locale: string): string => {
  const diffMs = Date.now() - createdAt;
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return locale.startsWith('zh') ? '刚刚' : 'Just now';
  if (minutes < 60) return locale.startsWith('zh') ? `${minutes} 分钟前` : `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return locale.startsWith('zh') ? `${hours} 小时前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return locale.startsWith('zh') ? `${days} 天前` : `${days}d ago`;
};

const DaoDiscussionReplyList: React.FC<Props> = ({ replies, opAuthorAddress }) => {
  const { t, i18n } = useTranslation();

  const sortedReplies = useMemo(
    () =>
      [...replies].sort((a, b) => {
        const aTime = a.createdAt ?? 0;
        const bTime = b.createdAt ?? 0;
        if (aTime && bTime) return aTime - bTime;
        if (aTime) return 1;
        if (bTime) return -1;
        return 0;
      }),
    [replies],
  );

  if (sortedReplies.length === 0) {
    return <p className={styles.discussionReplyEmpty}>{t('dao.discussionDetail.noReplies')}</p>;
  }

  return (
    <ol className={styles.discussionReplyList}>
      {sortedReplies.map((reply, index) => {
        const isOp = reply.authorAddress.toLowerCase() === opAuthorAddress.toLowerCase();
        const body = reply.body ?? (reply.bodyKey ? t(reply.bodyKey) : '');
        const timeLabel = reply.createdAt
          ? formatUserReplyTime(reply.createdAt, i18n.language)
          : reply.publishedAtKey
            ? t(reply.publishedAtKey)
            : '';

        return (
          <li key={reply.id} className={styles.discussionReplyItem}>
            <div className={styles.discussionReplyAside} aria-hidden>
              <span className={styles.discussionReplyFloor}>
                {t('dao.discussionDetail.replyFloor', { floor: index + 1 })}
              </span>
            </div>
            <article className={styles.discussionReplyCard}>
              <header className={styles.discussionReplyHead}>
                <div className={styles.discussionReplyAuthorRow}>
                  <span className={styles.discussionReplyAvatar}>
                    {reply.authorAddress.slice(2, 4).toUpperCase()}
                  </span>
                  <span className={styles.discussionReplyAuthor}>{shortenWalletAddress(reply.authorAddress)}</span>
                  {isOp ? (
                    <span className={styles.discussionReplyOpBadge}>{t('dao.discussionDetail.opBadge')}</span>
                  ) : null}
                  {reply.isOfficial ? (
                    <span className={styles.discussionReplyOfficialBadge}>
                      <ShieldCheck className="h-3 w-3" aria-hidden />
                      {t('dao.discussionDetail.officialBadge')}
                    </span>
                  ) : null}
                </div>
                {timeLabel ? <time className={styles.discussionReplyTime}>{timeLabel}</time> : null}
              </header>
              <p className={styles.discussionReplyBody}>{body}</p>
              <footer className={styles.discussionReplyFoot}>
                <span className={styles.discussionReplyLikes}>
                  <Heart className="h-3.5 w-3.5" aria-hidden />
                  {t('dao.discussionDetail.likes', { count: reply.likes })}
                </span>
              </footer>
            </article>
          </li>
        );
      })}
    </ol>
  );
};

export default DaoDiscussionReplyList;
