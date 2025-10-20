import React from 'react';
import styles from './AdminCard.module.scss';

interface AdminCardProps {
  title?: string;
  icon?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean; // 新增：是否显示标题部分，默认为true
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  icon,
  actions,
  children,
  className = '',
  showHeader = true // 默认显示标题部分
}) => {
  return (
    <div className={`${styles.adminInfoCard} ${className}`}>
      <div className={styles.adminCardContent}>
        <div className={styles.adminSection}>
          {showHeader && (title || actions) && (
            <div className={styles.governanceHeaderRow}>
              {title && (
                <h3 className={styles.adminSectionTitle}>
                  {icon && <i className={icon}></i>}
                  {title}
                </h3>
              )}
              {actions && (
                <div className={styles.dashboardActions}>
                  {actions}
                </div>
              )}
            </div>
          )}
          <div className={styles.adminCardBody}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCard;

