import React from 'react';
import { Button, Space } from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import styles from '../ProductManagement.module.scss';

interface ProductActionBarProps {
  selectedCount: number;
  onBatchDelete: () => void;
  onBatchDeactivate: () => void;
  onExport: () => void;
}

const ProductActionBar: React.FC<ProductActionBarProps> = ({
  selectedCount,
  onBatchDelete,
  onBatchDeactivate,
  onExport,
}) => {
  return (
    <Space size={6} wrap>
      <Button
        danger
        icon={<DeleteOutlined />}
        disabled={selectedCount === 0}
        onClick={onBatchDelete}
        className={styles.batchActionBtn}
      >
        批量删除
      </Button>
      <Button
        type="default"
        icon={<StopOutlined />}
        onClick={onBatchDeactivate}
        disabled={selectedCount === 0}
        className={styles.batchActionBtn}
      >
        批量下架
      </Button>
      <Button
        type="default"
        icon={<DownloadOutlined />}
        onClick={onExport}
        className={styles.batchActionBtn}
      >
        导出数据
      </Button>
    </Space>
  );
};

export default ProductActionBar;
