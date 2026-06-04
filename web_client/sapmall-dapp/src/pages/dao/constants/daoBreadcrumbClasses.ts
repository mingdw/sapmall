/** 详情/编辑页面包屑与 404 区块（Tailwind） */

export const DAO_DETAIL_NOT_FOUND =
  'px-4 py-10 text-center text-[var(--dao-panel-muted)] [&_p]:m-0 [&_p]:mb-4';

export const DAO_EVENT_BREADCRUMB = {
  nav: 'flex flex-wrap items-center gap-x-1 gap-y-[0.3rem] text-xs text-slate-400',
  link: 'font-semibold text-[var(--dao-tab-events)] no-underline transition-colors hover:text-[var(--dao-tab-events-muted)] hover:underline',
  current: 'max-w-full truncate font-medium text-[var(--dao-panel-muted)]',
} as const;

export const DAO_PROPOSAL_BREADCRUMB = {
  nav: 'flex flex-wrap items-center gap-x-1 gap-y-[0.3rem] text-xs text-slate-400',
  link: 'font-semibold text-[var(--dao-tab-proposals)] no-underline transition-colors hover:text-[var(--dao-tab-proposals-muted)] hover:underline',
  current: 'max-w-full truncate font-medium text-[var(--dao-panel-muted)]',
} as const;
