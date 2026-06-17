import React from 'react';
import styles from '../SecurityManager.module.scss';

interface Props {
  onOpenFreeze: () => void;
  onOpenRecovery: () => void;
}

const EmergencyOperationsCard: React.FC<Props> = ({ onOpenFreeze, onOpenRecovery }) => (
  <div className={styles.queryCard}>
    <h4 className={styles.sectionLabel}>
      <i className="fas fa-exclamation-triangle" style={{ fontSize: 13, color: '#f59e0b' }}></i>
      紧急操作
    </h4>
    <div className={styles.emergencyGrid}>
      <div className={`${styles.emergencyCard} ${styles.emergencyCardDanger}`}>
        <h4 className={styles.emergencyTitle}>紧急冻结账户</h4>
        <p className={styles.emergencyDesc}>
          如果您发现可疑活动或认为您的钱包已被盗用，可以紧急冻结账户
        </p>
        <button type="button" className={styles.btnDanger} onClick={onOpenFreeze}>
          <i className="fas fa-lock" style={{ marginRight: 4 }}></i>
          紧急冻结
        </button>
      </div>
      <div className={`${styles.emergencyCard} ${styles.emergencyCardPrimary}`}>
        <h4 className={styles.emergencyTitle}>账户恢复</h4>
        <p className={styles.emergencyDesc}>
          设置账户恢复选项，以便在紧急情况下恢复对钱包的访问
        </p>
        <button type="button" className={styles.btnPrimary} onClick={onOpenRecovery}>
          <i className="fas fa-life-ring" style={{ marginRight: 4 }}></i>
          设置恢复选项
        </button>
      </div>
    </div>
  </div>
);

export default EmergencyOperationsCard;
