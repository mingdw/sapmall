import type { DaoDiscussionReplyItem } from '../types';

export type DaoDiscussionReplyNode = {
  reply: DaoDiscussionReplyItem;
  children: DaoDiscussionReplyNode[];
};

const sortByTime = (a: DaoDiscussionReplyItem, b: DaoDiscussionReplyItem): number => {
  const aTime = a.createdAt ?? 0;
  const bTime = b.createdAt ?? 0;
  if (aTime && bTime) return aTime - bTime;
  if (aTime) return 1;
  if (bTime) return -1;
  return 0;
};

/** 扁平回复列表 → 按 parentReplyId 组树的顶层楼层 */
export const buildDiscussionReplyTree = (replies: DaoDiscussionReplyItem[]): DaoDiscussionReplyNode[] => {
  const sorted = [...replies].sort(sortByTime);
  const nodes = new Map<string, DaoDiscussionReplyNode>();

  for (const reply of sorted) {
    nodes.set(reply.id, { reply, children: [] });
  }

  const roots: DaoDiscussionReplyNode[] = [];

  for (const reply of sorted) {
    const node = nodes.get(reply.id);
    if (!node) continue;

    const parentId = reply.parentReplyId;
    const parent = parentId ? nodes.get(parentId) : undefined;

    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortNodes = (list: DaoDiscussionReplyNode[]): void => {
    list.sort((a, b) => sortByTime(a.reply, b.reply));
    list.forEach((n) => sortNodes(n.children));
  };
  sortNodes(roots);

  return roots;
};

/** 该楼层下全部子回复数量（含嵌套） */
export const countReplyDescendants = (node: DaoDiscussionReplyNode): number => {
  let count = node.children.length;
  for (const child of node.children) {
    count += countReplyDescendants(child);
  }
  return count;
};
