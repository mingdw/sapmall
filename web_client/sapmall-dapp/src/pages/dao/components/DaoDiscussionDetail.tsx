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
import {
  formatDiscussionActivity,
  getDiscussionChannel,
  getDiscussionExcerpt,
  getDiscussionTitle,
} from '../utils/daoDiscussionDisplay';
import { sortDiscussionTopicTags } from '../constants/discussionTopicTags';
import DaoDiscussionDetailBody from './DaoDiscussionDetailBody';
import DaoDiscussionReplyComposer from './DaoDiscussionReplyComposer';
import DaoDiscussionReplyList from './DaoDiscussionReplyList';
import detailStyles from '../styles/dao.detailCommon.module.scss';
import pageLayoutStyles from '../styles/dao.pageLayout.module.scss';
import sharedStyles from '../styles/dao.shared.module.scss';
import eventStyles from './DaoEventDetail.module.scss';
import replyStyles from './DaoDiscussionReplyList.module.scss';
import styles from './DaoDiscussionDetail.module.scss';

type Props = {
  discussion: DaoDiscussionDetailType;
};

const DaoDiscussionDetail: React.FC<Props> = ({ discussion }) => {
  const { t, i18n } = useTranslation();
  const title = getDiscussionTitle(discussion, t);
  const excerpt = getDiscussionExcerpt(discussion, t);
  const channelLabel = getDiscussionChannel(discussion, t);
  const activityLabel = formatDiscussionActivity(discussion, i18n.language, t);
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
    <section className={pageLayoutStyles.contentZoneInnerFull}>
      <article className={`${sharedStyles.panelCard} ${styles.discussionDetailCard}`} aria-label={title}>
        <header className={styles.discussionDetailHead}>
          <nav className={eventStyles.eventDetailBreadcrumb} aria-label="Breadcrumb">
            <Link to={daoHomePath} className={eventStyles.eventDetailBreadcrumbLink}>
              {t('navigation.dao')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link to={daoDiscussionsListPath()} className={eventStyles.eventDetailBreadcrumbLink}>
              {t('dao.tabs.discussions')}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <Link
              to={daoDiscussionsListPath(discussion.category)}
              className={eventStyles.eventDetailBreadcrumbLink}
            >
              {t(`dao.filters.discussions.${discussion.category}`)}
            </Link>
            <ChevronRight size={14} aria-hidden />
            <span className={eventStyles.eventDetailBreadcrumbCurrent} aria-current="page">
              {title}
            </span>
          </nav>

          <div className={styles.discussionDetailTitleRow}>
            <div className={styles.discussionDetailTitleMain}>
              <MessageCircle className={styles.discussionDetailLeadIcon} strokeWidth={2} aria-hidden />
              <h1 className={styles.discussionDetailTitle}>{title}</h1>
              <span className={styles.discussionChannelTag}>{channelLabel}</span>
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
            <span className={styles.discussionDetailMetaItem}>{activityLabel}</span>
          </div>
        </header>

        <section className={styles.discussionOpPost} aria-label={t('dao.discussionDetail.opSection')}>
          <header className={styles.discussionOpHead}>
            <span className={replyStyles.discussionReplyAvatar}>{discussion.authorAddress.slice(2, 4).toUpperCase()}</span>
            <div className={styles.discussionOpAuthorWrap}>
              <span className={styles.discussionOpAuthor}>{shortenWalletAddress(discussion.authorAddress)}</span>
              <span className={replyStyles.discussionReplyOpBadge}>{t('dao.discussionDetail.opBadge')}</span>
            </div>
            <time className={styles.discussionOpTime}>{activityLabel}</time>
          </header>
          <p className={styles.discussionOpExcerpt}>{excerpt}</p>
          <DaoDiscussionDetailBody blocks={discussion.blocks} />
        </section>

        <section className={replyStyles.discussionReplySection} aria-labelledby="dao-discussion-replies-title">
          <h2 id="dao-discussion-replies-title" className={replyStyles.discussionReplySectionTitle}>
            {t('dao.discussionDetail.replySectionTitle')}
            <span className={replyStyles.discussionReplySectionCount}>{replyCount}</span>
          </h2>
          <DaoDiscussionReplyList
            discussionId={discussion.id}
            replies={allReplies}
            opAuthorAddress={discussion.authorAddress}
            onReplyPosted={onReplyPosted}
          />
        </section>

        <DaoDiscussionReplyComposer discussionId={discussion.id} onReplyPosted={onReplyPosted} />

        {relatedDiscussions.length > 0 ? (
          <footer className={styles.discussionDetailFooter}>
            <div className={detailStyles.eventDetailRelatedHead}>
              <h2 className={detailStyles.eventDetailRelatedTitle}>{t('dao.discussionDetail.relatedTitle')}</h2>
              <Link to={daoDiscussionsListPath()} className={detailStyles.eventDetailViewAll}>
                {t('dao.discussionDetail.viewAll')}
                <ChevronRight size={14} aria-hidden />
              </Link>
            </div>
            <ul className={styles.discussionRelatedList}>
              {relatedDiscussions.map((item) => (
                <li key={item.id}>
                  <Link to={daoDiscussionPath(item.id)} className={styles.discussionRelatedItem}>
                    <span className={styles.discussionRelatedChannel}>{getDiscussionChannel(item, t)}</span>
                    <span className={styles.discussionRelatedTitle}>{getDiscussionTitle(item, t)}</span>
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
