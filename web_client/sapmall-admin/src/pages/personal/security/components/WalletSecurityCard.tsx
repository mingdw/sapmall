import React from 'react';
import { useTranslation } from 'react-i18next';
import type { WalletSecuritySettings } from '../constants';
import styles from '../SecurityManager.module.scss';

interface Props {
  settings: WalletSecuritySettings;
  onToggle: (key: keyof WalletSecuritySettings) => void;
}

const WalletSecurityCard: React.FC<Props> = ({ settings, onToggle }) => {
  const { t } = useTranslation();

  const WALLET_ITEMS: { key: keyof WalletSecuritySettings; title: string; description: string }[] = [
    { key: 'transactionConfirmation', title: t('personal.security.transactionConfirmation'), description: t('personal.security.transactionConfirmationDesc') },
    { key: 'highValueAlert', title: t('personal.security.highValueAlert'), description: t('personal.security.highValueAlertDesc') },
    { key: 'contractInteractionWarning', title: t('personal.security.contractInteractionWarning'), description: t('personal.security.contractInteractionWarningDesc') },
  ];

  return (
    <div className={styles.queryCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-wallet" style={{ fontSize: 13, color: '#f59e0b' }}></i>
        {t('personal.security.walletSecurity')}
      </h4>
    {WALLET_ITEMS.map((item) => (
      <div key={item.key} className={styles.settingItem}>
        <div className={styles.settingInfo}>
          <h4 className={styles.settingTitle}>{item.title}</h4>
          <p className={styles.settingDesc}>{item.description}</p>
        </div>
        <div className={styles.settingAction}>
          <button
            type="button"
            className={`${styles.toggleSwitch} ${settings[item.key] ? styles.toggleOn : styles.toggleOff}`}
            onClick={() => onToggle(item.key)}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
      </div>
    ))}
  </div>
  );
};

export default WalletSecurityCard;
