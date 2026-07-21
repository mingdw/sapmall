import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Input, Button } from 'antd';
import type { WhitelistAddress } from '../constants';
import { formatAddress } from '../utils/securityUtils';
import styles from '../SecurityManager.module.scss';

interface Props {
  open: boolean;
  addresses: WhitelistAddress[];
  newAddress: string;
  onNewAddressChange: (addr: string) => void;
  onAdd: () => void;
  onRemove: (addr: string) => void;
  onClose: () => void;
}

const WhitelistModal: React.FC<Props> = ({
  open,
  addresses,
  newAddress,
  onNewAddressChange,
  onAdd,
  onRemove,
  onClose,
}) => {
  const { t } = useTranslation();

  return (
  <Modal
    title={t('personal.security.modal.whitelistTitle')}
    open={open}
    onCancel={onClose}
    footer={null}
    width={560}
    destroyOnClose
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, marginBottom: 6 }}>
          {t('personal.security.modal.addNewAddress')}
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder={t('personal.security.modal.addressPlaceholder')}
            value={newAddress}
            onChange={(e) => onNewAddressChange(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={onAdd}>{t('personal.security.modal.add')}</Button>
        </div>
      </div>
      <table className={styles.whitelistTable}>
        <thead>
          <tr>
            <th>{t('personal.security.modal.address')}</th>
            <th>{t('personal.security.modal.addedAt')}</th>
            <th style={{ textAlign: 'right' }}>{t('personal.security.modal.operation')}</th>
          </tr>
        </thead>
        <tbody>
          {addresses.map((item) => (
            <tr key={item.address}>
              <td>
                <span className={styles.addressValue}>{formatAddress(item.address)}</span>
              </td>
              <td style={{ color: '#64748b' }}>{item.addedAt}</td>
              <td style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  className={styles.btnDanger}
                  onClick={() => onRemove(item.address)}
                >
                  {t('personal.security.modal.delete')}
                </button>
              </td>
            </tr>
          ))}
          {addresses.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', color: '#475569', padding: 24 }}>
                {t('personal.security.modal.noWhitelist')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Modal>
);
};

export default WhitelistModal;
