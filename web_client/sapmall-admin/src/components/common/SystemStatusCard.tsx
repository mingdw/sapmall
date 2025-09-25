import React from 'react';
import styles from './SystemStatusCard.module.scss';

interface SystemStatusCardProps {
  name: string;
  status: 'healthy' | 'warning' | 'error';
  detail: string;
  icon: string;
  className?: string;
}

const SystemStatusCard: React.FC<SystemStatusCardProps> = ({
  name,
  status,
  detail,
  icon,
  className = ''
}) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy':
        return '运行正常';
      case 'warning':
        return '性能下降';
      case 'error':
        return '连接异常';
      default:
        return '未知状态';
    }
  };

  return (
    <div className={`${styles.systemStatusCard} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]} ${className}`}>
      <div className={styles.statusIcon}>
        <i className={`fas fa-${icon}`}></i>
      </div>
      <div className={styles.statusContent}>
        <h4>{name}</h4>
        <p>{getStatusText(status)}</p>
        <span className={styles.statusDetail}>{detail}</span>
      </div>
    </div>
  );
};

export default SystemStatusCard;

