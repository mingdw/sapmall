import type { DaoViewTab } from '../types';

/** 社区参与上下区 Tab 展示顺序：大事件 → 热门讨论 → 提案治理 */
export const DAO_VIEW_TAB_ORDER: DaoViewTab[] = ['events', 'discussions', 'proposals'];

export const DAO_DEFAULT_VIEW_TAB: DaoViewTab = 'events';

export const daoViewTabToIndex = (tab: DaoViewTab): number =>
  DAO_VIEW_TAB_ORDER.indexOf(tab);

export const daoViewTabFromIndex = (index: number): DaoViewTab =>
  DAO_VIEW_TAB_ORDER[index] ?? DAO_DEFAULT_VIEW_TAB;
