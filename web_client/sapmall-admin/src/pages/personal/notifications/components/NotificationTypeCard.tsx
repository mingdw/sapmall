import React from 'react';
import { useTranslation } from 'react-i18next';
import type {
  NotificationTypeItem,
  TypeFilterTab,
  NotificationChannel,
  FrequencyOption,
} from '../types';
import {
  getTypeFilterTabs,
  getFrequencyOptions,
  IMPORTANCE_CONFIG,
} from '../constants';
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
  const { t } = useTranslation();
  const typeTabs = getTypeFilterTabs(t);
  const frequencyOptions = getFrequencyOptions(t);
  const filtered = filter === 'all' ? types : types.filter((item) => item.category === filter);

  const channelIcons: { key: NotificationChannel; icon: string; label: string }[] = [
    { key: 'email', icon: 'fa-envelope', label: t('personal.notifications.email') },
    { key: 'mobile', icon: 'fa-mobile-alt', label: t('personal.notifications.mobile') },
    { key: 'browser', icon: 'fa-desktop', label: t('personal.notifications.browser') },
  ];

  return (
    <div className={styles.listCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-list-alt" style={{ fontSize: 13, color: '#06b6d4' }}></i>
        {t('personal.notifications.types')}
      </h4>

      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {typeTabs.map((tab) => (
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
            {t('common.enable')}
          </button>
          <button type="button" className={styles.btnOutline} onClick={onDisableAll}>
            <i className="fas fa-times-circle"></i>
            {t('common.disable')}
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
                  {t(`personal.notifications.typeItems.${item.id.replace(/-/g, '')}`)}
                  {impCfg && (
                    <span
                      className={styles.importanceBadge}
                      style={{
                        color: impCfg.color,
                        background: impCfg.bg,
                        border: `1px solid ${impCfg.border}`,
                      }}
                    >
                      {t(impCfg.labelKey)}
                    </span>
                  )}
                </h4>
              </div>
              <p className={styles.notifDesc}>{t(`personal.notifications.typeItems.${item.id.replace(/-/g, '')}Desc`)}</p>
              <div className={styles.channelRow}>
                <div className={styles.channelOptions}>
                  {channelIcons.map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      title={ch.label}
                      className={`${styles.channelOption} ${
                        item.channels[ch.key] ? styles.channelOptionActive : ''
                      }`}
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
                    onChange={(e) =>
                      onFrequencyChange(item.id, e.target.value as FrequencyOption)
                    }
                  >
                    {frequencyOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
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
                {t('personal.notifications.preview')}
              </button>
              <button
                type="button"
                className={`${styles.toggleSwitch} ${
                  item.enabled ? styles.toggleOn : styles.toggleOff
                }`}
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
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationTypeCard;
