/**
 * 帮助中心多页共用的 Tailwind 布局 class（需在 HelpLayout.pageRoot 子树内以使用 CSS 变量）。
 */
export const HELP_LAYOUT = {
  contentZoneInner:
    'relative z-[3] box-border w-[min(100%,var(--help-content-max))] max-w-[var(--help-content-max)] ' +
    '-mt-[var(--help-overlap)] mb-5 mx-auto ' +
    'lg:ml-[max(0px,calc((100%-var(--help-content-align))/2))] lg:mr-auto ' +
    'grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_var(--help-sidebar-w)] lg:items-start',

  contentZoneInnerFull:
    'relative z-[3] box-border block w-[min(100%,var(--help-content-max))] max-w-[var(--help-content-max)] ' +
    '-mt-[var(--help-overlap)] mb-5 mx-auto ' +
    'lg:ml-[max(0px,calc((100%-var(--help-content-align))/2))] lg:mr-auto',

  mainListCard: 'relative w-full min-w-0 flex flex-col gap-4',

  sidebarColumn: 'relative w-full min-w-0 flex flex-col gap-4',
} as const;
