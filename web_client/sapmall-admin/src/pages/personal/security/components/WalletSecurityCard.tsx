import React from 'react';
import type { WalletSecuritySettings } from '../constants';
import styles from '../SecurityManager.module.scss';

interface Props {
  settings: WalletSecuritySettings;
  onToggle: (key: keyof WalletSecuritySettings) => void;
}

const WALLET_ITEMS: { key: keyof WalletSecuritySettings; title: string; description: string }[] = [
  { key: 'transactionConfirmation', title: '交易确认', description: '每笔交易前需要确认交易详情' },
  { key: 'highValueAlert', title: '高额交易提醒', description: '交易金额超过设定阈值时发出警告' },
  { key: 'contractInteractionWarning', title: '合约交互警告', description: '与智能合约交互时显示风险提示' },
];

const WalletSecurityCard: React.FC<Props> = ({ settings, onToggle }) => (
  <div className={styles.queryCard}>
    <h4 className={styles.sectionLabel}>
      <i className="fas fa-wallet" style={{ fontSize: 13, color: '#f59e0b' }}></i>
      钱包安全
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

export default WalletSecurityCard;
