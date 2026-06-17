import React from 'react';
import type { DeviceInfo } from '../constants';
import styles from '../SecurityManager.module.scss';

interface Props {
  devices: DeviceInfo[];
  onDisconnect: (deviceId: string) => void;
}

const DeviceManagementCard: React.FC<Props> = ({ devices, onDisconnect }) => (
  <div className={styles.queryCard}>
    <h4 className={styles.sectionLabel}>
      <i className="fas fa-laptop" style={{ fontSize: 13, color: '#06b6d4' }}></i>
      设备管理
    </h4>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {devices.map((device) => (
        <div
          key={device.id}
          className={`${styles.deviceCard} ${device.isCurrent ? styles.deviceCurrent : ''}`}
        >
          <div className={styles.deviceMain}>
            <div className={`${styles.deviceIcon} ${device.isCurrent ? styles.deviceIconActive : styles.deviceIconDefault}`}>
              <i className={`fas ${device.icon}`}></i>
            </div>
            <div>
              <div className={styles.deviceNameRow}>
                <span className={styles.deviceName}>{device.name}</span>
                {device.isCurrent && (
                  <span className={styles.deviceCurrentTag}>当前设备</span>
                )}
              </div>
              <div className={styles.deviceMeta}>最后活动: {device.lastActive}</div>
              <div className={styles.deviceIp}>IP: {device.ip}</div>
            </div>
          </div>
          {!device.isCurrent && (
            <button
              type="button"
              className={styles.btnDanger}
              onClick={() => onDisconnect(device.id)}
            >
              <i className="fas fa-times" style={{ marginRight: 4 }}></i>
              断开连接
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default DeviceManagementCard;
