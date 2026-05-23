import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ChevronRight, Eye, MessageCircle, MessagesSquare } from 'lucide-react';
import {
  getMockDiscussionReplies,
  getRelatedDaoDiscussions,
} from '../mocks/daoDiscussionDetails.mock';
import { getUserDiscussionReplies } from '../utils/daoDiscussionReply.storage';
import type { DaoDiscussionDetail as DaoDiscussionDetailType } from '../types';
import { formatHelpMetricNumber } from '../../help/utils/formatHelpMetric';
import {
  daoDiscussionPath,
  daoDiscussionsListPath,
  daoHomePath,
} from '../utils/daoNavigation';
import { shortenWalletAddress } from '../utils/walletAddress';
import { sortDiscussionTopicTags } from '../constants/discussionTopicTags';
import DaoDiscussionDetailBody from './DaoDiscussionDetailBody';
import DaoDiscussionReplyComposer from './DaoDiscussionReplyComposer';
import DaoDiscussionReplyList from './DaoDiscussionReplyList';
import styles from '../DaoPage.module.scss';

type Props = {
  discussion: DaoDiscussionDetailType;
};

const DaoDiscussionDetail: React.FC<Props> = ({ discussion }) => {
  const { t, i18n } = useTranslation();
  const title = t(discussion.titleKey);
  const viewsLabel = formatHelpMetricNumber(discussion.views, i18n.language);
  const relatedDiscussions = useMemo(() => getRelatedDaoDiscussions(discussion, 3), [discussion]);
  const [replyVersion, setReplyVersion] = useState(0);

  const mockReplies = useMemo(() => getMockDiscussionReplies(discussion), [discussion]);
  const userReplies = useMemo(
    () => getUserDiscussionReplies(discussion.id),
    [discussion.id, replyVersion],
  );

  const allReplies = useMemo(() => [...mockReplies, ...userReplies], [mockReplies, userReplies]);
  const replyCount = allReplies.length;

  const onReplyPosted = useCallback(() => {
    setReplyVersion((v) => v + 1);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [discussion.id]);

  return (
    <section className={styles.contentZoneInnerFull}>
      <article className={`${styles.panelCard} ${styles.discussionDetailCard}`} aria-label={title}>
        <header className={styles.discussionDetailHead}>
          <nav className={styles.eventDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoHomePath} className={styles.eventDetailBreadcrumbLink}>
              {t('navigation.dao')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={daoDiscussionsListPath} className={styles.eventDetailBreadcrumbLink}>
              {t('dao.tabs.discussions')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className={styles.eventDetailBreadcrumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>

          <div className={styles.discussionDetailTitleRow}>
            <div className={styles.discussionDetailTitleMain}>
              <MessageCircle className={styles.discussionDetailLeadIcon} strokeWidth={2} aria-hidden />
              <h1 className={styles.discussionDetailTitle}>{title}</h1>
              <span className={styles.discussionChannelTag}>{t(discussion.channelKey)}</span>
            </div>
            {discussion.tags.length > 0 ? (
              <div className={styles.discussionDetailTagsRow}>
                {sortDiscussionTopicTags(discussion.tags).map((tag) => (
                  <span key={tag} className={styles.discussionTopicTag} data-tag={tag}>
                    {t(`dao.topicTags.${tag}`)}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.discussionDetailMeta}>
            <span className={styles.discussionDetailMetaItem}>
              <MessagesSquare className="h-4 w-4" aria-hidden />
              {t('dao.discussionDetail.replies', { count: replyCount })}
            </span>
            <span className={styles.discussionDetailMetaItem}>
              <Eye className="h-4 w-4" aria-hidden />
              {t('dao.discussionDetail.views', { views: viewsLabel })}
            </span>
            <span className={styles.discussionDetailMetaItem}>{t(discussion.activityKey)}</span>
          </div>
        </header>

        <section className={styles.discussionOpPost} aria-label={t('dao.discussionDetail.opSection')}>
          <header className={styles.discussionOpHead}>
            <span className={styles.discussionReplyAvatar}>{discussion.authorAddress.slice(2, 4).toUpperCase()}</span>
            <div className={styles.discussionOpAuthorWrap}>
              <span className={styles.discussionOpAuthor}>{shortenWalletAddress(discussion.authorAddress)}</span>
              <span className={styles.discussionReplyOpBadge}>{t('dao.discussionDetail.opBadge')}</span>
            </div>
            <time className={styles.discussionOpTime}>{t(discussion.activityKey)}</time>
          </header>
          <p className={styles.discussionOpExcerpt}>{t(discussion.excerptKey)}</p>
          <DaoDiscussionDetailBody blocks={discussion.blocks} />
        </section>

        <section className={styles.discussionReplySection} aria-labelledby="dao-discussion-replies-title">
          <h2 id="dao-discussion-replies-title" className={styles.discussionReplySectionTitle}>
            {t('dao.discussionDetail.replySectionTitle')}
            <span className={styles.discussionReplySectionCount}>{replyCount}</span>
          </h2>
          <DaoDiscussionReplyList replies={allReplies} opAuthorAddress={discussion.authorAddress} />
        </section>

        <DaoDiscussionReplyComposer discussionId={discussion.id} onReplyPosted={onReplyPosted} />

        {relatedDiscussions.length > 0 ? (
          <footer className={styles.discussionDetailFooter}>
            <div className={styles.eventDetailRelatedHead}>
              <h2 className={styles.eventDetailRelatedTitle}>{t('dao.discussionDetail.relatedTitle')}</h2>
              <Link to={daoDiscussionsListPath} className={styles.eventDetailViewAll}>
                {t('dao.discussionDetail.viewAll')}
                <ChevronRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className={styles.discussionRelatedList}>
              {relatedDiscussions.map((item) => (
                <li key={item.id}>
                  <Link to={daoDiscussionPath(item.id)} className={styles.discussionRelatedItem}>
                    <span className={styles.discussionRelatedChannel}>{t(item.channelKey)}</span>
                    <span className={styles.discussionRelatedTitle}>{t(item.titleKey)}</span>
                    <span className={styles.discussionRelatedMeta}>
                      {t('dao.list.discussionReplies', { count: item.replies })}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </footer>
        ) : null}
      </article>
    </section>
  );
};

export default DaoDiscussionDetail;
