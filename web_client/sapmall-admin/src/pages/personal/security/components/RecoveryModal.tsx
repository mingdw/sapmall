import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'antd';
import styles from '../SecurityManager.module.scss';

interface Props {
  open: boolean;
  onClose: () => void;
}

const RecoveryModal: React.FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation();

  const RECOVERY_OPTIONS = [
    { icon: 'fa-envelope', title: t('personal.security.modal.recoveryEmail'), desc: t('personal.security.modal.recoveryEmailDesc') },
    { icon: 'fa-phone', title: t('personal.security.modal.recoveryPhone'), desc: t('personal.security.modal.recoveryPhoneDesc') },
    { icon: 'fa-key', title: t('personal.security.modal.recoveryMnemonic'), desc: t('personal.security.modal.recoveryMnemonicDesc') },
  ];

  return (
  <Modal
    title={t('personal.security.modal.recoveryTitle')}
    open={open}
    onCancel={onClose}
    footer={null}
    width={480}
    destroyOnClose
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <p style={{ color: '#cbd5e1', fontSize: 13, margin: 0 }}>
        {t('personal.security.modal.recoveryDesc')}
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
};

export default RecoveryModal;
