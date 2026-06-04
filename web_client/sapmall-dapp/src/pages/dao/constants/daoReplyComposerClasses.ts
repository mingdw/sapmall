/** 讨论回复编辑器 /  composer 共用 Tailwind class */

export const DAO_REPLY = {
  composer:
    'border-t border-slate-100 bg-[#fafafa] px-5 pb-[1.35rem] pt-4 md:px-[1.65rem] md:pb-[1.55rem] md:pt-[1.15rem]',
  composerTitle: 'm-0 mb-3 text-[0.9375rem] font-bold text-[var(--dao-panel-text)]',
  guest:
    'flex flex-col items-start gap-[0.65rem] rounded-lg border border-dashed border-slate-300 bg-white p-4',
  guestInline:
    'flex flex-col items-start gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-[0.65rem]',
  hint: 'm-0 text-[0.8125rem] text-[var(--dao-panel-muted)]',
  connectBtn:
    'inline-flex items-center justify-center rounded-lg border-none bg-gradient-to-br from-orange-400 to-orange-600 px-[0.9rem] py-[0.45rem] text-[0.8125rem] font-semibold text-white cursor-pointer hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-55',
  form: 'flex flex-col gap-[0.65rem]',
  targetBanner:
    'flex items-start justify-between gap-2 rounded-lg border border-orange-500/20 bg-orange-50/65 px-[0.65rem] py-2',
  targetBannerInline:
    'mb-[0.15rem] flex items-center justify-between gap-2',
  targetText:
    'flex min-w-0 flex-col gap-[0.2rem] text-xs font-semibold text-[var(--dao-tab-discussions)]',
  targetPreview: 'break-words font-normal leading-snug text-[var(--dao-panel-muted)]',
  targetCancel:
    'm-0 inline-flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent p-0 text-slate-500 hover:bg-slate-900/5 hover:text-slate-700',
  textarea: 'dao-discussion-reply-textarea',
  actions: 'flex flex-wrap items-center justify-between gap-x-3 gap-y-2',
  actionBtns: 'inline-flex shrink-0 flex-wrap items-center gap-2',
  cancelBtn:
    'm-0 cursor-pointer rounded-lg border-none bg-transparent px-3 py-2 text-[0.8125rem] font-semibold text-[var(--dao-panel-muted)] hover:bg-slate-900/5 hover:text-slate-700',
  charCount: 'text-xs tabular-nums text-[var(--dao-panel-muted)]',
  submitBtn:
    'inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border-none bg-gradient-to-br from-orange-400 to-orange-600 px-4 py-2 text-[0.8125rem] font-semibold text-white hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50',
} as const;
