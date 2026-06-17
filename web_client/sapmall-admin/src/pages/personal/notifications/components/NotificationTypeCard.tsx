import React from 'react';
import type {
  NotificationTypeItem,
  TypeFilterTab,
  NotificationChannel,
  FrequencyOption,
} from '../types';
import { TYPE_FILTER_TABS, FREQUENCY_OPTIONS, IMPORTANCE_CONFIG } from '../constants';
import styles from '../NotificationManager.module.scss';

interface Props {
  types: NotificationTypeItem[];
  filter: TypeFilterTab;
  onFilterChange: (tab: TypeFilterTab) => void;
  onToggleType: (id: string) => void;
  onToggleChannel: (id: string, channel: NotificationChannel) => void;
  onFrequencyChange: (id: string, freq: FrequencyOption) => void;
  onEnableAll: () => void;
  onDisableAll: () => void;
  onPreview: (id: string) => void;
  onSave: () => void;
}

const CHANNEL_ICONS: { key: NotificationChannel; icon: string; label: string }[] = [
  { key: 'email', icon: 'fa-envelope', label: '邮件通知' },
  { key: 'mobile', icon: 'fa-mobile-alt', label: '手机通知' },
  { key: 'browser', icon: 'fa-desktop', label: '浏览器通知' },
];

const NotificationTypeCard: React.FC<Props> = ({
  types,
  filter,
  onFilterChange,
  onToggleType,
  onToggleChannel,
  onFrequencyChange,
  onEnableAll,
  onDisableAll,
  onPreview,
  onSave,
}) => {
  const filtered = filter === 'all' ? types : types.filter((t) => t.category === filter);

  return (
    <div className={styles.listCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-list-alt" style={{ fontSize: 13, color: '#06b6d4' }}></i>
        通知类型设置
      </h4>

      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {TYPE_FILTER_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`${styles.filterBtn} ${filter === tab.key ? styles.filterBtnActive : ''}`}
              onClick={() => onFilterChange(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className={styles.actionGroup}>
          <button type="button" className={styles.btnOutline} onClick={onEnableAll}>
            <i className="fas fa-check-circle"></i>
            全部启用
          </button>
          <button type="button" className={styles.btnOutline} onClick={onDisableAll}>
            <i className="fas fa-times-circle"></i>
            全部禁用
          </button>
        </div>
      </div>

      {filtered.map((item) => {
        const impCfg = IMPORTANCE_CONFIG[item.importance];
        return (
          <div key={item.id} className={styles.notifItem}>
            <div className={styles.notifInfo}>
              <div className={styles.notifTitleRow}>
                <div
                  className={styles.notifIcon}
                  style={{ background: `${item.iconColor}18`, color: item.iconColor }}
                >
                  <i className={`fas ${item.icon}`}></i>
                </div>
                <h4 className={styles.notifTitle}>
                  {item.title}
                  {impCfg && (
                    <span
                      className={styles.importanceBadge}
                      style={{ color: impCfg.color, background: impCfg.bg, border: `1px solid ${impCfg.border}` }}
                    >
                      {impCfg.label}
                    </span>
                  )}
                </h4>
              </div>
              <p className={styles.notifDesc}>{item.description}</p>
              <div className={styles.channelRow}>
                <div className={styles.channelOptions}>
                  {CHANNEL_ICONS.map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      title={ch.label}
                      className={`${styles.channelOption} ${item.channels[ch.key] ? styles.channelOptionActive : ''}`}
                      onClick={() => onToggleChannel(item.id, ch.key)}
                    >
                      <i className={`fas ${ch.icon}`}></i>
                    </button>
                  ))}
                </div>
                {item.hasFrequency && (
                  <select
                    className={styles.frequencySelect}
                    value={item.frequency || 'immediate'}
                    onChange={(e) => onFrequencyChange(item.id, e.target.value as FrequencyOption)}
                  >
                    {FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className={styles.notifAction}>
              <button
                type="button"
                className={styles.btnOutline}
                onClick={() => onPreview(item.id)}
              >
                <i className="fas fa-eye"></i>
                预览
              </button>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${item.enabled ? styles.toggleOn : styles.toggleOff}`}
                onClick={() => onToggleType(item.id)}
              >
                <span className={styles.toggleKnob} />
              </button>
            </div>
          </div>
        );
      })}

      <div className={styles.notifItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
        <div className={styles.notifInfo}>
          <button type="button" className={styles.btnPrimary} onClick={onSave}>
            <i className="fas fa-save"></i>
            保存通知设置
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTypeCard;
