import React from 'react';
import type { ActivityRecord, ActivityFilterType } from '../constants';
import { ACTIVITY_PAGE_SIZE, ACTIVITY_FILTER_OPTIONS } from '../constants';
import styles from '../SecurityManager.module.scss';

interface Props {
  activities: ActivityRecord[];
  total: number;
  page: number;
  filter: ActivityFilterType;
  searchQuery: string;
  onFilterChange: (filter: ActivityFilterType) => void;
  onSearchChange: (query: string) => void;
  onPageChange: (page: number) => void;
  onDisconnect: (deviceId: string) => void;
}

const ActivityHistoryCard: React.FC<Props> = ({
  activities,
  total,
  page,
  filter,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / ACTIVITY_PAGE_SIZE);
  const startIdx = (page - 1) * ACTIVITY_PAGE_SIZE + 1;
  const endIdx = Math.min(page * ACTIVITY_PAGE_SIZE, total);

  return (
    <div className={styles.listCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-history" style={{ fontSize: 13, color: '#8b5cf6' }}></i>
        最近活动记录
      </h4>

      <div className={styles.activityToolbar}>
        <div className={styles.filterGroup}>
          {ACTIVITY_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              className={`${styles.filterBtn} ${filter === opt.key ? styles.filterBtnActive : ''}`}
              onClick={() => {
                onFilterChange(opt.key);
                onPageChange(1);
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className={styles.searchBox}>
          <i className={`fas fa-search ${styles.searchIcon}`}></i>
          <input
            type="text"
            placeholder="搜索活动..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onPageChange(1);
            }}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div>
        {activities.map((activity) => (
          <div key={activity.id} className={styles.activityItem}>
            <div
              className={`${styles.activityIcon} ${
                activity.warning ? styles.activityIconWarning : styles.activityIconDefault
              }`}
            >
              <i className={`fas ${activity.icon}`}></i>
            </div>
            <div className={styles.activityBody}>
              <div className={styles.activityHeader}>
                <h4 className={styles.activityTitle}>{activity.title}</h4>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
              <p className={styles.activityDetail}>{activity.detail}</p>
            </div>
            <div className={styles.activityStatus}>
              {activity.status === 'success' && (
                <i className={`fas fa-check-circle ${styles.statusSuccess}`}></i>
              )}
              {activity.status === 'warning' && (
                <i className={`fas fa-exclamation-circle ${styles.statusWarning}`}></i>
              )}
              {activity.status === 'pending' && (
                <i className={`fas fa-clock ${styles.statusPending}`}></i>
              )}
            </div>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className={styles.pagination}>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className={styles.paginationInfo}>
            显示 {startIdx}-{endIdx} / {total}
          </span>
          <button
            type="button"
            className={styles.paginationBtn}
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityHistoryCard;
