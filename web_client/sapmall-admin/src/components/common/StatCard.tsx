import React from 'react';
import { TrendingUp } from 'lucide-react';
import styles from './StatCard.module.scss';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string | React.ReactNode;
  trend?: {
    value: string;
    type: 'positive' | 'negative' | 'neutral';
  };
  variant?: 'primary' | 'success' | 'purple' | 'orange';
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  variant = 'primary',
  className = ''
}) => {
  return (
    <div className={`${styles.dashboardStatCard} ${styles[`stat${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${className}`}>
      <div className={styles.statIcon}>
        {typeof icon === 'string' ? <i className={icon.startsWith('fa') ? icon : `fas fa-${icon}`} /> : icon}
      </div>
      <div className={styles.statContent}>
        <div className={styles.statValueRow}>
          <h3>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
          {trend && (
            <div className={`${styles.statTrend} ${styles[trend.type]}`}>
              <TrendingUp size={12} />
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
