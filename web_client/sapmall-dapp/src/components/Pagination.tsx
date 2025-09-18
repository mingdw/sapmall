import React from 'react';
import styles from './Pagination.module.scss';

interface PaginationProps {
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

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showPageSize = false,
  pageSizeOptions = [10, 20, 50, 100],
  onPageSizeChange
}) => {
  // 计算显示范围
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // 生成页码数组
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 7;
    
    if (totalPages <= maxVisiblePages) {
      // 如果总页数小于等于最大可见页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // 复杂分页逻辑
      if (currentPage <= 4) {
        // 当前页在前面
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // 当前页在后面
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // 当前页在中间
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onPageSizeChange) {
      onPageSizeChange(parseInt(e.target.value));
    }
  };

  return (
    <div className={styles.paginationContainer}>
      {/* 分页信息 */}
      {showInfo && (
        <div className={styles.paginationInfo}>
          显示 <span className={styles.highlight}>{startIndex}</span> 到{' '}
          <span className={styles.highlight}>{endIndex}</span> 条，共{' '}
          <span className={styles.highlight}>{totalItems}</span> 条记录
        </div>
      )}

      {/* 分页控制 */}
      <div className={styles.paginationControls}>
        {/* 第一页 */}
        <button
          className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="第一页"
        >
          <i className="fas fa-angle-double-left"></i>
        </button>

        {/* 上一页 */}
        <button
          className={`${styles.paginationBtn} ${currentPage === 1 ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="上一页"
        >
          <i className="fas fa-angle-left"></i>
        </button>

        {/* 页码 */}
        <div className={styles.paginationPages}>
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className={styles.paginationEllipsis}>...</span>
              ) : (
                <button
                  className={`${styles.paginationBtn} ${styles.paginationPage} ${
                    currentPage === page ? styles.active : ''
                  }`}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* 下一页 */}
        <button
          className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="下一页"
        >
          <i className="fas fa-angle-right"></i>
        </button>

        {/* 最后一页 */}
        <button
          className={`${styles.paginationBtn} ${currentPage === totalPages ? styles.disabled : ''}`}
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="最后一页"
        >
          <i className="fas fa-angle-double-right"></i>
        </button>
      </div>

      {/* 每页条数选择 */}
      {showPageSize && onPageSizeChange && (
        <div className={styles.pageSizeSelector}>
          <select
            value={itemsPerPage}
            onChange={handlePageSizeChange}
            className={styles.pageSizeSelect}
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}条/页
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Pagination;
