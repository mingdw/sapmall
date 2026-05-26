import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, MessageCircle, ShieldCheck } from 'lucide-react';
import type { DaoDiscussionReplyItem, DaoDiscussionReplyTarget } from '../types';
import {
  buildDiscussionReplyTree,
  countReplyDescendants,
  type DaoDiscussionReplyNode,
} from '../utils/daoDiscussionReplyTree';
import { shortenWalletAddress } from '../utils/walletAddress';
import DaoDiscussionReplyEditor from './DaoDiscussionReplyEditor';
import styles from './DaoDiscussionReplyList.module.scss';

type Props = {
  discussionId: string;
  replies: DaoDiscussionReplyItem[];
  opAuthorAddress: string;
  onReplyPosted: () => void;
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

const snippet = (text: string, max = 72): string => {
  const trimmed = text.replace(/\s+/g, ' ').trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
};

type ReplyRowProps = {
  node: DaoDiscussionReplyNode;
  depth: number;
  floor?: number;
  discussionId: string;
  opAuthorAddress: string;
  expandedIds: Record<string, boolean>;
  onToggleThread: (replyId: string) => void;
  onEnsureExpanded: (replyId: string) => void;
  onReplyPosted: () => void;
};

const ReplyRow: React.FC<ReplyRowProps> = ({
  node,
  depth,
  floor,
  discussionId,
  opAuthorAddress,
  expandedIds,
  onToggleThread,
  onEnsureExpanded,
  onReplyPosted,
}) => {
  const { t, i18n } = useTranslation();
  const { reply, children } = node;
  const isExpanded = !!expandedIds[reply.id];
  const descendantCount = countReplyDescendants(node);
  const hasThread = descendantCount > 0 || isExpanded;

  const isOp = reply.authorAddress.toLowerCase() === opAuthorAddress.toLowerCase();
  const body = reply.body ?? (reply.bodyKey ? t(reply.bodyKey) : '');
  const timeLabel = reply.createdAt
    ? formatUserReplyTime(reply.createdAt, i18n.language)
    : reply.publishedAtKey
      ? t(reply.publishedAtKey)
      : '';

  const replyTarget: DaoDiscussionReplyTarget = {
    replyId: reply.id,
    authorAddress: reply.authorAddress,
    preview: snippet(body),
  };

  const handleInlinePosted = () => {
    onReplyPosted();
    onEnsureExpanded(reply.id);
  };

  const collapseThread = () => onToggleThread(reply.id);

  const replyActionLabel = isExpanded
    ? t('dao.discussionDetail.replyCollapse')
    : descendantCount > 0
      ? t('dao.discussionDetail.replyActionWithCount', { count: descendantCount })
      : t('dao.discussionDetail.replyAction');

  const isRoot = depth === 0;

  return (
    <li
      className={`${isRoot ? styles.discussionReplyItem : styles.discussionReplyChildItem}`}
      data-depth={depth}
    >
      {isRoot && floor !== undefined ? (
        <div className={styles.discussionReplyAside} aria-hidden>
          <span className={styles.discussionReplyFloor}>
            {t('dao.discussionDetail.replyFloor', { floor })}
          </span>
        </div>
      ) : null}

      <div className={styles.discussionReplyContent}>
        <header className={styles.discussionReplyHead}>
          <div className={styles.discussionReplyAuthorRow}>
            <span
              className={`${styles.discussionReplyAvatar}${!isRoot ? ` ${styles.discussionReplyAvatarSm}` : ''}`}
            >
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

        {reply.replyToAuthorAddress && reply.replyToSnippet ? (
          <p className={styles.discussionReplyQuote}>
            {t('dao.discussionDetail.replyToQuote', {
              user: shortenWalletAddress(reply.replyToAuthorAddress),
              excerpt: reply.replyToSnippet,
            })}
          </p>
        ) : null}

        <p className={styles.discussionReplyBody}>{body}</p>

        <footer className={styles.discussionReplyFoot}>
          <button
            type="button"
            className={`${styles.discussionReplyActionBtn}${isExpanded ? ` ${styles.discussionReplyActionBtnActive}` : ''}`}
            onClick={() => onToggleThread(reply.id)}
            aria-expanded={isExpanded}
            aria-controls={`dao-reply-thread-${reply.id}`}
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden />
            {replyActionLabel}
          </button>
          <span className={styles.discussionReplyLikes}>
            <Heart className="h-3.5 w-3.5" aria-hidden />
            {t('dao.discussionDetail.likes', { count: reply.likes })}
          </span>
        </footer>

        {isExpanded ? (
          <div
            id={`dao-reply-thread-${reply.id}`}
            className={styles.discussionReplyThread}
            role="region"
            aria-label={t('dao.discussionDetail.replyThreadLabel', {
              user: shortenWalletAddress(reply.authorAddress),
            })}
          >
            {children.length > 0 ? (
              <ol className={styles.discussionReplyChildren}>
                {children.map((child) => (
                  <ReplyRow
                    key={child.reply.id}
                    node={child}
                    depth={depth + 1}
                    discussionId={discussionId}
                    opAuthorAddress={opAuthorAddress}
                    expandedIds={expandedIds}
                    onToggleThread={onToggleThread}
                    onEnsureExpanded={onEnsureExpanded}
                    onReplyPosted={onReplyPosted}
                  />
                ))}
              </ol>
            ) : null}

            <div
              className={styles.discussionReplyInlineForm}
              aria-label={t('dao.discussionDetail.composer.replyingTo', {
                user: shortenWalletAddress(reply.authorAddress),
              })}
            >
              <DaoDiscussionReplyEditor
                discussionId={discussionId}
                replyTarget={replyTarget}
                variant="inline"
                autoFocus={!hasThread}
                onPosted={handleInlinePosted}
                onCancel={collapseThread}
              />
            </div>
          </div>
        ) : null}
      </div>
    </li>
  );
};

const DaoDiscussionReplyList: React.FC<Props> = ({ discussionId, replies, opAuthorAddress, onReplyPosted }) => {
  const { t } = useTranslation();
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

  const replyTree = useMemo(() => buildDiscussionReplyTree(replies), [replies]);

  const onToggleThread = useCallback((replyId: string) => {
    setExpandedIds((prev) => ({ ...prev, [replyId]: !prev[replyId] }));
  }, []);

  const onEnsureExpanded = useCallback((replyId: string) => {
    setExpandedIds((prev) => (prev[replyId] ? prev : { ...prev, [replyId]: true }));
  }, []);

  if (replyTree.length === 0) {
    return <p className={styles.discussionReplyEmpty}>{t('dao.discussionDetail.noReplies')}</p>;
  }

  return (
    <ol className={styles.discussionReplyList}>
      {replyTree.map((node, index) => (
        <ReplyRow
          key={node.reply.id}
          node={node}
          depth={0}
          floor={index + 1}
          discussionId={discussionId}
          opAuthorAddress={opAuthorAddress}
          expandedIds={expandedIds}
          onToggleThread={onToggleThread}
          onEnsureExpanded={onEnsureExpanded}
          onReplyPosted={onReplyPosted}
        />
      ))}
    </ol>
  );
};

export default DaoDiscussionReplyList;
