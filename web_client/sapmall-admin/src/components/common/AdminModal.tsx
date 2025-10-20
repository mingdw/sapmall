import React from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';
import styles from './AdminModal.module.scss';

interface AdminModalProps extends ModalProps {
  children: React.ReactNode;
}

const AdminModal: React.FC<AdminModalProps> = ({
  children,
  ...props
}) => {
  return (
    <Modal
      className={styles.adminModal}
      {...props}
      centered
      maskClosable={false}
      destroyOnClose
    >
      {children}
    </Modal>
  );
};

export default AdminModal;

