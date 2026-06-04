/**
 * DAO 模块多页共用的 Tailwind 布局 class（需在 DaoLayout.pageRoot 子树内以使用 CSS 变量）。
 */
export const DAO_LAYOUT = {
  contentZoneInner:
    'relative z-[3] box-border w-[min(100%,var(--dao-content-max-width))] max-w-[var(--dao-content-max-width)] ' +
    'mb-5 mx-auto grid grid-cols-1 gap-5 ' +
    'lg:ml-[max(0px,calc((100%-var(--dao-content-align-width))/2))] lg:mr-auto ' +
    'lg:grid-cols-[minmax(0,1fr)_var(--dao-sidebar-width)] lg:items-start lg:gap-4',

  contentZoneInnerFull:
    'relative z-[3] box-border block w-[min(100%,var(--dao-content-max-width))] max-w-[var(--dao-content-max-width)] ' +
    'mb-5 mx-auto ' +
    'lg:ml-[max(0px,calc((100%-var(--dao-content-align-width))/2))] lg:mr-auto',

  sidebarColumn: 'relative w-full min-w-0 flex flex-col gap-4',
} as const;
