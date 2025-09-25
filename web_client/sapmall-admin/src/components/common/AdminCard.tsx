import React from 'react';
import styles from './AdminCard.module.scss';

interface AdminCardProps {
  title?: string;
  icon?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  icon,
  actions,
  children,
  className = ''
}) => {
  return (
    <div className={`${styles.adminInfoCard} ${className}`}>
      <div className={styles.adminCardContent}>
        <div className={styles.adminSection}>
          {(title || actions) && (
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
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminCard;

