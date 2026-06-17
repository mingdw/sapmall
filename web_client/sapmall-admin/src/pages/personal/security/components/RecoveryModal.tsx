import React from 'react';
import { Modal } from 'antd';
import styles from '../SecurityManager.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RECOVERY_OPTIONS = [
  { icon: 'fa-envelope', title: '邮箱恢复', desc: '通过注册邮箱接收恢复链接' },
  { icon: 'fa-phone', title: '手机号恢复', desc: '通过绑定手机号接收验证码' },
  { icon: 'fa-key', title: '助记词恢复', desc: '使用助记词恢复钱包访问' },
];

const RecoveryModal: React.FC<Props> = ({ open, onClose }) => (
  <Modal
    title="设置恢复选项"
    open={open}
    onCancel={onClose}
    footer={null}
    width={480}
    destroyOnClose
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0 }}>
        选择一种恢复方式，以便在紧急情况下恢复对钱包的访问：
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {RECOVERY_OPTIONS.map((opt) => (
          <div key={opt.title} className={styles.recoveryOption}>
            <div className={styles.recoveryIcon}>
              <i className={`fas ${opt.icon}`}></i>
            </div>
            <div>
              <h4 className={styles.recoveryTitle}>{opt.title}</h4>
              <p className={styles.recoveryDesc}>{opt.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </Modal>
);

export default RecoveryModal;
