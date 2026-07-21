import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input } from 'antd';

interface Props {
  open: boolean;
  confirmation: string;
  onConfirmationChange: (val: string) => void;
  onConfirm: () => void;
  onClose: () => void;
}

const FreezeModal: React.FC<Props> = ({
  open,
  confirmation,
  onConfirmationChange,
  onConfirm,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
  <Modal
    title={t('personal.security.modal.freezeTitle')}
    open={open}
    onCancel={onClose}
    footer={
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: '4px 16px', fontSize: 13, color: '#94a3b8', background: 'transparent',
            border: '1px solid rgba(71, 85, 105, 0.5)', borderRadius: 6, cursor: 'pointer',
          }}
        >
          {t('personal.security.modal.cancel')}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          style={{
            padding: '4px 16px', fontSize: 13, color: '#f87171', background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 6, cursor: 'pointer',
          }}
        >
          {t('personal.security.modal.freezeConfirm')}
        </button>
      </div>
    }
    width={480}
    destroyOnClose
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12,
        borderRadius: 8, background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
      }}>
        <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b', marginTop: 2 }}></i>
        <div>
          <h4 style={{ margin: 0, color: '#fbbf24', fontSize: 13, fontWeight: 600 }}>
            {t('personal.security.modal.freezeWarning')}
          </h4>
          <p style={{ margin: '4px 0 0', color: 'rgba(251, 191, 36, 0.7)', fontSize: 12, lineHeight: 1.5 }}>
            {t('personal.security.modal.freezeWarningDesc')}
          </p>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, marginBottom: 6 }}>
          {t('personal.security.modal.freezeConfirmPlaceholder')}
        </label>
        <Input
          placeholder="FREEZE"
          value={confirmation}
          onChange={(e) => onConfirmationChange(e.target.value)}
        />
      </div>
    </div>
  </Modal>
);
};

export default FreezeModal;
