import React from 'react';
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
}) => (
  <Modal
    title="管理地址白名单"
    open={open}
    onCancel={onClose}
    footer={null}
    width={560}
    destroyOnClose
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label style={{ display: 'block', color: '#cbd5e1', fontSize: 13, marginBottom: 6 }}>
          添加新地址
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input
            placeholder="输入钱包地址"
            value={newAddress}
            onChange={(e) => onNewAddressChange(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button type="primary" onClick={onAdd}>添加</Button>
        </div>
      </div>
      <table className={styles.whitelistTable}>
        <thead>
          <tr>
            <th>地址</th>
            <th>添加时间</th>
            <th style={{ textAlign: 'right' }}>操作</th>
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
                  删除
                </button>
              </td>
            </tr>
          ))}
          {addresses.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: 'center', color: '#475569', padding: 24 }}>
                暂无白名单地址
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </Modal>
);

export default WhitelistModal;
