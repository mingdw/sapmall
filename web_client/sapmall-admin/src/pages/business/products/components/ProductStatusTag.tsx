import React from 'react';
import { Tag } from 'antd';
import { getProductStatusConfig } from '../utils';
import { ProductStatus } from '../constants';

interface ProductStatusTagProps {
  status: ProductStatus;
}

const ProductStatusTag: React.FC<ProductStatusTagProps> = ({ status }) => {
  const config = getProductStatusConfig(status);
  return <Tag color={config.color}>{config.text}</Tag>;
};

export default ProductStatusTag;
