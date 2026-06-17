import React from 'react';
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
}) => (
  <div className={styles.queryCard}>
    <h4 className={styles.sectionLabel}>
      <i className="fas fa-shield-alt" style={{ fontSize: 13, color: '#22c55e' }}></i>
      访问控制
    </h4>

    {/* Two Factor */}
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h4 className={styles.settingTitle}>双重认证</h4>
        <p className={styles.settingDesc}>使用Google Authenticator或其他认证应用</p>
      </div>
      <div className={styles.settingAction}>
        <button
          type="button"
          className={settings.twoFactorEnabled ? styles.btnOutline : styles.btnPrimary}
          onClick={onOpenTwoFactor}
        >
          <i className={`fas ${settings.twoFactorEnabled ? 'fa-check' : 'fa-plus'}`} style={{ marginRight: 4 }}></i>
          {settings.twoFactorEnabled ? '已启用' : '设置'}
        </button>
      </div>
    </div>

    {/* Auto Lock */}
    <div className={styles.settingItem}>
      <div className={styles.settingInfo}>
        <h4 className={styles.settingTitle}>自动锁定</h4>
        <p className={styles.settingDesc}>一段时间不活动后自动锁定钱包</p>
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
        <h4 className={styles.settingTitle}>地址白名单</h4>
        <p className={styles.settingDesc}>启用后只能向白名单地址转账</p>
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
          管理
        </button>
      </div>
    </div>
  </div>
);

export default AccessControlCard;
