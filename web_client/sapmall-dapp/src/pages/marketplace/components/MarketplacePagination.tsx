import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface MarketplacePaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showPageSize?: boolean;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
}

function buildPageList(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 1) return total === 1 ? [1] : [];
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current]);
  if (current > 1) pages.add(current - 1);
  if (current < total) pages.add(current + 1);
  if (current <= 2) {
    pages.add(2);
    pages.add(3);
  }
  if (current >= total - 1) {
    pages.add(total - 1);
    pages.add(total - 2);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | 'ellipsis')[] = [];

  sorted.forEach((page, index) => {
    const prev = sorted[index - 1];
    if (index > 0 && page - prev > 1) {
      result.push('ellipsis');
    }
    result.push(page);
  });

  return result;
}

const navBtnClass =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-none bg-transparent text-slate-300 transition-[color,background,opacity] hover:bg-cyan-400/10 hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-30';

const pageBtnClass =
  'inline-flex h-8 min-w-8 items-center justify-center rounded-full border-none px-2 text-[0.8125rem] font-semibold tabular-nums text-slate-400 transition-[color,background,box-shadow] hover:bg-white/5 hover:text-slate-200';

const pageBtnActiveClass =
  'bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-[0_4px_14px_rgba(99,102,241,0.35)] hover:bg-gradient-to-br hover:from-indigo-500 hover:to-cyan-500 hover:text-white';

const pageSizeSelectClass =
  'h-8 min-w-[5.5rem] cursor-pointer appearance-none rounded-lg border border-slate-500/25 bg-slate-950/60 py-0 pl-2.5 pr-7 text-xs font-semibold tabular-nums text-slate-200 outline-none transition-[border-color,box-shadow] hover:border-cyan-400/30 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15';

const MarketplacePagination: React.FC<MarketplacePaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange,
}) => {
  const { t } = useTranslation();

  const startIndex = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const pageNumbers = useMemo(
    () => buildPageList(currentPage, totalPages),
    [currentPage, totalPages],
  );

  const showNav = totalPages > 1;
  const showSummary = showInfo && totalItems > 0;
  const showSizes = showPageSize && !!onPageSizeChange;

  if (!showNav && !showSummary && !showSizes) {
    return null;
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const pageSizeControl = showSizes ? (
    <label
      className={
        'inline-flex shrink-0 items-center gap-1.5 ' +
        (showSummary ? "before:mx-0.5 before:text-slate-500 before:opacity-50 before:content-['·']" : '')
      }
      htmlFor="marketplace-page-size"
    >
      <span className="text-xs font-medium text-slate-500">
        {t('marketplacePage.pageSizeLabel')}
      </span>
      <span className="relative inline-flex">
        <select
          id="marketplace-page-size"
          className={pageSizeSelectClass}
          value={itemsPerPage}
          onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          aria-label={t('marketplacePage.pageSizeAria')}
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {t('marketplacePage.pageSizeOption', { size })}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
    </label>
  ) : null;

  return (
    <nav
      className="mt-5 border-t border-slate-500/10 pt-4"
      aria-label={t('marketplacePage.paginationAria')}
    >
      <div
        className={
          'flex flex-col gap-3 rounded-2xl border border-slate-500/15 bg-slate-900/40 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] ' +
          'sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-4 sm:gap-y-2 sm:px-4 sm:py-3'
        }
      >
        {showSummary || showSizes ? (
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1.5 sm:justify-start">
            {showSummary ? (
              <span className="text-xs font-medium leading-relaxed text-slate-400">
                {t('marketplacePage.paginationRange', {
                  start: startIndex,
                  end: endIndex,
                  total: totalItems,
                })}
              </span>
            ) : null}
            {pageSizeControl}
            {showSummary && showNav ? (
              <span className="text-xs font-medium text-slate-500 before:mx-0.5 before:opacity-50 before:content-['·']">
                {t('marketplacePage.paginationStatus', {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
            ) : null}
          </div>
        ) : (
          <span className="hidden min-w-0 flex-1 sm:block" aria-hidden />
        )}

        {showNav ? (
          <div
            className="mx-auto inline-flex items-center gap-1 rounded-full border border-slate-500/20 bg-slate-950/50 px-1 py-0.5 sm:mx-0"
            role="group"
            aria-label={t('marketplacePage.paginationAria')}
          >
            <button
              type="button"
              className={navBtnClass}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!canPrev}
              aria-label={t('marketplacePage.paginationPrev')}
            >
              <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </button>

            <div className="inline-flex items-center gap-0.5 px-0.5">
              {pageNumbers.map((page, index) =>
                page === 'ellipsis' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex h-8 min-w-5 items-center justify-center text-xs tracking-widest text-slate-500 select-none"
                    aria-hidden
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    className={`${pageBtnClass} ${currentPage === page ? pageBtnActiveClass : ''}`}
                    onClick={() => onPageChange(page)}
                    aria-current={currentPage === page ? 'page' : undefined}
                    aria-label={t('marketplacePage.paginationPage', { page })}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              type="button"
              className={navBtnClass}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!canNext}
              aria-label={t('marketplacePage.paginationNext')}
            >
              <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </nav>
  );
};

export default MarketplacePagination;
