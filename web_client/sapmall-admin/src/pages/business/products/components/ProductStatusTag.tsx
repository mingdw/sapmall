import React from 'react';
import { getProductStatusConfig } from '../utils';
import { ProductStatus } from '../constants';
import styles from './StatusTag.module.scss';

interface ProductStatusTagProps {
  status: ProductStatus;
}

const ProductStatusTag: React.FC<ProductStatusTagProps> = ({ status }) => {
  const config = getProductStatusConfig(status);
  
  // 根据状态获取对应的样式类名
  const getStatusClassName = (status: ProductStatus): string => {
    switch (status) {
      case ProductStatus.DRAFT:
        return styles.draft;
      case ProductStatus.PENDING:
        return styles.pending;
      case ProductStatus.ACTIVE:
        return styles.active;
      case ProductStatus.INACTIVE:
        return styles.inactive;
      default:
        return styles.draft;
    }
  };

  return (
    <span className={`${styles.statusTag} ${getStatusClassName(status)}`}>
      {config.text}
    </span>
  );
};

export default ProductStatusTag;
