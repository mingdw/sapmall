import React from 'react';
import { useTranslation } from 'react-i18next';
import type { AccessControlSettings } from '../constants';
import styles from '../SecurityManager.module.scss';

interface Props {
  settings: AccessControlSettings;
  onToggle: (key: keyof AccessControlSettings) => void;
  onOpenTwoFactor: () => void;
  onOpenWhitelist: () => void;
}

const AccessControlCard: React.FC<Props> = ({
  settings,
  onToggle,
  onOpenTwoFactor,
  onOpenWhitelist,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.queryCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-shield-alt" style={{ fontSize: 13, color: '#22c55e' }}></i>
        {t('personal.security.accessControl')}
      </h4>

    {/* Two Factor */}
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h4 className={styles.settingTitle}>{t('personal.security.twoFactor')}</h4>
        <p className={styles.settingDesc}>{t('personal.security.twoFactorDesc')}</p>
      </div>
      <div className={styles.settingAction}>
        <button
          type="button"
          className={settings.twoFactorEnabled ? styles.btnOutline : styles.btnPrimary}
          onClick={onOpenTwoFactor}
        >
          <i className={`fas ${settings.twoFactorEnabled ? 'fa-check' : 'fa-plus'}`} style={{ marginRight: 4 }}></i>
          {settings.twoFactorEnabled ? t('personal.security.twoFactorEnabled') : t('personal.security.twoFactorDisabled')}
        </button>
      </div>
    </div>

    {/* Auto Lock */}
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h4 className={styles.settingTitle}>{t('personal.security.autoLock')}</h4>
        <p className={styles.settingDesc}>{t('personal.security.autoLockDesc')}</p>
      </div>
      <div className={styles.settingAction}>
        <button
          type="button"
          className={`${styles.toggleSwitch} ${settings.autoLock ? styles.toggleOn : styles.toggleOff}`}
          onClick={() => onToggle('autoLock')}
        >
          <span className={styles.toggleKnob} />
        </button>
      </div>
    </div>

    {/* Address Whitelist */}
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h4 className={styles.settingTitle}>{t('personal.security.whitelist')}</h4>
        <p className={styles.settingDesc}>{t('personal.security.addressWhitelistDesc')}</p>
      </div>
      <div className={styles.settingAction}>
        <button
          type="button"
          className={`${styles.toggleSwitch} ${settings.addressWhitelist ? styles.toggleOn : styles.toggleOff}`}
          onClick={() => onToggle('addressWhitelist')}
        >
          <span className={styles.toggleKnob} />
        </button>
        <button type="button" className={styles.btnOutline} onClick={onOpenWhitelist}>
          {t('personal.security.manage')}
        </button>
      </div>
    </div>
  </div>
  );
};

export default AccessControlCard;
