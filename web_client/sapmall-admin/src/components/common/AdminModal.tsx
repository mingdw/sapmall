import React from 'react';
import { Modal } from 'antd';
import type { ModalProps } from 'antd';

interface AdminModalProps extends ModalProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
}

const AdminModal: React.FC<AdminModalProps> = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  width,
  ...props
}) => {
  // 根据 size 设置默认宽度（如果未指定 width）
  const widthMap = {
    small: 480,
    medium: 800,
    large: 1000,
    xlarge: 1200,
  };

  const modalWidth = width || widthMap[size];

  return (
    <Modal
      className={className}
      width={modalWidth}
      {...props}
      centered
      maskClosable={props.maskClosable !== undefined ? props.maskClosable : false}
      destroyOnClose={props.destroyOnClose !== undefined ? props.destroyOnClose : true}
    >
      {children}
    </Modal>
  );
};

export default AdminModal;

