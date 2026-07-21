import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../SecurityManager.module.scss';

interface Props {
  onOpenFreeze: () => void;
  onOpenRecovery: () => void;
}

const EmergencyOperationsCard: React.FC<Props> = ({ onOpenFreeze, onOpenRecovery }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.queryCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: 13, color: '#f59e0b' }}></i>
        {t('personal.security.emergency')}
      </h4>
      <div className={styles.emergencyGrid}>
        <div className={`${styles.emergencyCard} ${styles.emergencyCardDanger}`}>
          <h4 className={styles.emergencyTitle}>{t('personal.security.freezeAccount')}</h4>
          <p className={styles.emergencyDesc}>
            {t('personal.security.freezeAccountDesc')}
          </p>
          <button type="button" className={styles.btnDanger} onClick={onOpenFreeze}>
            <i className="fas fa-lock" style={{ marginRight: 4 }}></i>
            {t('personal.security.freeze')}
          </button>
        </div>
        <div className={`${styles.emergencyCard} ${styles.emergencyCardPrimary}`}>
          <h4 className={styles.emergencyTitle}>{t('personal.security.accountRecovery')}</h4>
          <p className={styles.emergencyDesc}>
            {t('personal.security.accountRecoveryDesc')}
          </p>
          <button type="button" className={styles.btnPrimary} onClick={onOpenRecovery}>
            <i className="fas fa-life-ring" style={{ marginRight: 4 }}></i>
            {t('personal.security.setRecovery')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyOperationsCard;
