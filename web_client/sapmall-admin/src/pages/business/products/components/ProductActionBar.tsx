import React from 'react';
import { Button, Space } from 'antd';
import {
  Trash2,
  Download,
  OctagonMinus,
} from 'lucide-react';
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
        icon={<Trash2 size={16} />}
        disabled={selectedCount === 0}
        onClick={onBatchDelete}
        className={styles.batchActionBtn}
      >
        批量删除
      </Button>
      <Button
        type="default"
        icon={<OctagonMinus size={16} />}
        onClick={onBatchDeactivate}
        disabled={selectedCount === 0}
        className={styles.batchActionBtn}
      >
        批量下架
      </Button>
      <Button
        type="default"
        icon={<Download size={16} />}
        onClick={onExport}
        className={styles.batchActionBtn}
      >
        导出数据
      </Button>
    </Space>
  );
};

export default ProductActionBar;
