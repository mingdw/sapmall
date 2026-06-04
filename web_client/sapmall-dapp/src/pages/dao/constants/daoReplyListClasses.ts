/** 讨论回复列表与区块标题（Tailwind） */

export const DAO_REPLY_LIST = {
  section: 'px-5 pb-2 pt-[1.15rem] md:px-[1.65rem] md:pb-[0.65rem] md:pt-[1.35rem]',
  sectionTitle: 'm-0 mb-4 flex items-center gap-2 text-base font-bold text-[var(--dao-panel-text)]',
  sectionCount:
    'inline-flex min-w-6 items-center justify-center rounded-full bg-orange-500/10 px-[0.45rem] py-[0.1rem] text-xs font-bold text-[var(--dao-tab-discussions)]',
  list: 'm-0 flex list-none flex-col p-0',
  item: 'grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-[0.85rem] gap-y-2 border-b border-slate-100 py-[0.85rem] first:pt-0 last:border-b-0 last:pb-0',
  childItem: 'py-[0.65rem] pt-[0.65rem] first:pt-2',
  aside: 'flex justify-center pt-[0.15rem]',
  floor: 'text-[0.6875rem] font-bold tabular-nums text-slate-400',
  content: 'min-w-0',
  head: 'mb-[0.4rem] flex flex-wrap items-center justify-between gap-x-3 gap-y-[0.35rem]',
  authorRow: 'inline-flex flex-wrap items-center gap-x-2 gap-y-[0.35rem]',
  avatar:
    'inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 text-[0.6875rem] font-bold tracking-wide text-white',
  avatarSm: 'h-[1.65rem] w-[1.65rem] text-[0.625rem]',
  author: 'font-mono text-[0.8125rem] font-semibold text-[var(--dao-panel-text)]',
  opBadge:
    'rounded bg-orange-500/10 px-[0.4rem] py-[0.1rem] text-[0.625rem] font-bold tracking-wide text-[var(--dao-tab-discussions)]',
  officialBadge:
    'inline-flex items-center gap-[0.2rem] rounded bg-green-500/10 px-[0.4rem] py-[0.1rem] text-[0.625rem] font-bold text-green-600',
  time: 'text-xs text-[var(--dao-panel-muted)]',
  quote:
    'mb-[0.45rem] rounded-r border-l-2 border-orange-500/35 bg-orange-50/45 py-[0.35rem] pl-[0.55rem] text-xs leading-snug text-[var(--dao-panel-muted)]',
  body: 'm-0 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700',
  foot: 'mt-2 flex flex-wrap items-center gap-x-4 gap-y-[0.65rem]',
  actionBtn:
    'm-0 inline-flex cursor-pointer items-center gap-[0.3rem] border-none bg-transparent p-0 text-xs font-semibold text-[var(--dao-tab-discussions)] transition-colors hover:text-[var(--dao-tab-discussions-muted)] hover:underline',
  actionBtnActive: 'underline',
  likes: 'inline-flex items-center gap-[0.3rem] text-xs text-slate-400',
  thread: 'mt-2',
  children: 'm-0 list-none border-l-2 border-slate-200 py-0 pl-[0.65rem]',
  inlineForm: 'mt-[0.65rem] rounded-lg border border-slate-200 bg-slate-50 p-3',
  empty: 'mb-4 rounded-lg bg-slate-50 p-5 text-center text-sm text-[var(--dao-panel-muted)]',
} as const;
