import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './MarketplacePagination.module.scss';

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

  if (totalPages <= 1 && !showPageSize) {
    if (!showInfo || totalItems === 0) return null;
  }

  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <nav className={styles.root} aria-label={t('marketplacePage.paginationAria')}>
      {totalPages > 1 && (
        <div className={styles.bar}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={!canPrev}
            aria-label={t('marketplacePage.paginationPrev')}
          >
            <i className="fas fa-chevron-left" aria-hidden />
          </button>

          <div className={styles.pages}>
            {pageNumbers.map((page, index) =>
              page === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden>
                  ···
                </span>
              ) : (
                <button
                  key={page}
                  type="button"
                  className={`${styles.pageBtn} ${currentPage === page ? styles.pageBtnActive : ''}`}
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
            className={styles.navBtn}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={!canNext}
            aria-label={t('marketplacePage.paginationNext')}
          >
            <i className="fas fa-chevron-right" aria-hidden />
          </button>
        </div>
      )}

      <div className={styles.meta}>
        {showInfo && totalItems > 0 && (
          <p className={styles.summary}>
            {t('marketplacePage.paginationRange', {
              start: startIndex,
              end: endIndex,
              total: totalItems,
            })}
            {totalPages > 1 && (
              <span className={styles.pageIndicator}>
                {t('marketplacePage.paginationStatus', {
                  current: currentPage,
                  total: totalPages,
                })}
              </span>
            )}
          </p>
        )}

        {showPageSize && onPageSizeChange && (
          <div className={styles.pageSizeGroup} role="group" aria-label={t('marketplacePage.pageSizeAria')}>
            {pageSizeOptions.map((size) => (
              <button
                key={size}
                type="button"
                className={`${styles.pageSizeBtn} ${itemsPerPage === size ? styles.pageSizeBtnActive : ''}`}
                onClick={() => onPageSizeChange(size)}
                aria-pressed={itemsPerPage === size}
              >
                {t('marketplacePage.pageSizeOption', { size })}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default MarketplacePagination;
