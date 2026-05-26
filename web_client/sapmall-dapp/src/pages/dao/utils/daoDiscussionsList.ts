import { DAO_DISCUSSIONS } from '../mocks/dao.mock';
import type { DaoDiscussionItem } from '../types';
import { getUserDiscussionRecords, userRecordToListItem } from './daoUserDiscussion.storage';
import { sortDiscussionsForList } from '../constants/discussionTopicTags';

/** Mock 列表 + 用户本地发表的讨论 */
export const getMergedDaoDiscussions = (): DaoDiscussionItem[] => {
  const userItems = getUserDiscussionRecords().map(userRecordToListItem);
  return sortDiscussionsForList([...userItems, ...DAO_DISCUSSIONS]);
};
