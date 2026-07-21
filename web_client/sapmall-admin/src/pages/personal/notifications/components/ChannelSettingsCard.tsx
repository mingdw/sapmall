import React from 'react';
import { useTranslation } from 'react-i18next';
import type { ChannelSettings, NotificationChannel } from '../types';
import styles from '../NotificationManager.module.scss';

interface Props {
  channels: ChannelSettings;
  onToggle: (channel: NotificationChannel) => void;
  onValueChange: (channel: NotificationChannel, value: string) => void;
  onSave: () => void;
}

const ChannelSettingsCard: React.FC<Props> = ({
  channels,
  onToggle,
  onValueChange,
  onSave,
}) => {
  const { t } = useTranslation();

  const CHANNEL_ITEMS: {
    key: NotificationChannel;
    title: string;
    desc: string;
    placeholder: string;
    icon: string;
  }[] = [
    {
      key: 'email',
      title: t('personal.notifications.emailTitle'),
      desc: t('personal.notifications.emailDesc'),
      placeholder: t('personal.notifications.emailPlaceholder'),
      icon: 'fa-envelope',
    },
    {
      key: 'mobile',
      title: t('personal.notifications.mobileTitle'),
      desc: t('personal.notifications.mobileDesc'),
      placeholder: t('personal.notifications.mobilePlaceholder'),
      icon: 'fa-mobile-alt',
    },
    {
      key: 'browser',
      title: t('personal.notifications.browserTitle'),
      desc: t('personal.notifications.browserDesc'),
      placeholder: '',
      icon: 'fa-desktop',
    },
  ];

  return (
    <div className={styles.queryCard}>
      <h4 className={styles.sectionLabel}>
        <i className="fas fa-bell" style={{ fontSize: 13, color: '#f59e0b' }}></i>
        {t('personal.notifications.channelSettings')}
      </h4>

    {CHANNEL_ITEMS.map((item) => (
      <div key={item.key} className={styles.channelItem}>
        <div className={styles.channelInfo}>
          <h4 className={styles.channelTitle}>{item.title}</h4>
          <p className={styles.channelDesc}>{item.desc}</p>
          {item.placeholder && (
            <input
              type={item.key === 'email' ? 'email' : 'text'}
              className={styles.channelInput}
              placeholder={item.placeholder}
              value={channels[item.key].value}
              onChange={(e) => onValueChange(item.key, e.target.value)}
            />
          )}
        </div>
        <div className={styles.channelAction}>
          <button
            type="button"
            className={`${styles.toggleSwitch} ${channels[item.key].enabled ? styles.toggleOn : styles.toggleOff}`}
            onClick={() => onToggle(item.key)}
          >
            <span className={styles.toggleKnob} />
          </button>
        </div>
      </div>
    ))}

    <div className={styles.channelItem} style={{ borderBottom: 'none', paddingBottom: 0 }}>
      <div className={styles.channelInfo}>
        <button type="button" className={styles.btnPrimary} onClick={onSave}>
          <i className="fas fa-save"></i>
          {t('personal.notifications.saveChannelSettings')}
        </button>
      </div>
    </div>
  </div>
  );
};

export default ChannelSettingsCard;
