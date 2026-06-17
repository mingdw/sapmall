import React from 'react';
import type { ChannelSettings, NotificationChannel } from '../types';
import styles from '../NotificationManager.module.scss';

interface Props {
  channels: ChannelSettings;
  onToggle: (channel: NotificationChannel) => void;
  onValueChange: (channel: NotificationChannel, value: string) => void;
  onSave: () => void;
}

const CHANNEL_ITEMS: {
  key: NotificationChannel;
  title: string;
  desc: string;
  placeholder: string;
  icon: string;
}[] = [
  {
    key: 'email',
    title: '邮件通知',
    desc: '设置接收通知的邮箱地址',
    placeholder: '请输入接收通知的邮箱',
    icon: 'fa-envelope',
  },
  {
    key: 'mobile',
    title: '手机通知',
    desc: '设置接收通知的手机号码',
    placeholder: '请输入接收通知的手机号码',
    icon: 'fa-mobile-alt',
  },
  {
    key: 'browser',
    title: '浏览器通知',
    desc: '启用后，您将在浏览器中收到实时通知提醒',
    placeholder: '',
    icon: 'fa-desktop',
  },
];

const ChannelSettingsCard: React.FC<Props> = ({
  channels,
  onToggle,
  onValueChange,
  onSave,
}) => (
  <div className={styles.queryCard}>
    <h4 className={styles.sectionLabel}>
      <i className="fas fa-bell" style={{ fontSize: 13, color: '#f59e0b' }}></i>
      通知渠道设置
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
          保存通知渠道设置
        </button>
      </div>
    </div>
  </div>
);

export default ChannelSettingsCard;
