import React, { useState } from 'react';
import { Input, Select, Row, Col, Space } from 'antd';
import AdminButton from '../../../../components/common/AdminButton';
import { PRODUCT_STATUS_OPTIONS, CHAIN_STATUS_OPTIONS, TIME_RANGE_OPTIONS, type ViewMode } from '../constants';
import type { ProductListParams } from '../types';
import styles from '../ProductManagement.module.scss';

const { Option } = Select;

interface ProductToolbarProps {
  searchParams: ProductListParams;
  viewMode: ViewMode;
  onSearch: (value: string) => void;
  onFilterChange: (key: keyof ProductListParams, value: any) => void;
  onClearFilters: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAdd: () => void;
  selectedCount: number;
  onBatchDelete: () => void;
  onBatchDeactivate: () => void;
  onExport: () => void;
  onQuery: () => void;
}

const ProductToolbar: React.FC<ProductToolbarProps> = ({
  searchParams,
  viewMode,
  onSearch,
  onFilterChange,
  onClearFilters,
  onViewModeChange,
  onAdd,
  selectedCount,
  onBatchDelete,
  onBatchDeactivate,
  onExport,
  onQuery,
}) => {
  const [productName, setProductName] = useState(searchParams.productName || '');
  const [productCode, setProductCode] = useState(searchParams.productCode || '');

  const handleQuery = () => {
    // 更新搜索参数
    onFilterChange('productName', productName);
    onFilterChange('productCode', productCode);
    // 触发查询
    onQuery();
  };

  const handleReset = () => {
    setProductName('');
    setProductCode('');
    onClearFilters();
  };

  return (
    <div className={styles.toolbarContainer}>
      {/* 筛选条件和操作按钮在同一行，按顺序排列，自动换行 */}
      <div className={styles.toolbarRow}>
        {/* 商品名称 */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>商品名称：</label>
          <Input
            placeholder="请输入商品名称"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onPressEnter={handleQuery}
            className={styles.filterInput}
          />
        </div>

        {/* 商品编码 */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>商品编码：</label>
          <Input
            placeholder="请输入商品编码"
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            onPressEnter={handleQuery}
            className={styles.filterInput}
          />
        </div>

        {/* 商品状态 */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>商品状态：</label>
          <Select
            className={styles.filterSelect}
            popupClassName="product-filter-dropdown"
            value={searchParams.status === undefined || searchParams.status === '' ? '' : searchParams.status}
            onChange={(value) => onFilterChange('status', value || '')}
            allowClear={false}
          >
            {PRODUCT_STATUS_OPTIONS.map((option) => (
              <Option key={String(option.value)} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* 链上状态 */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>链上状态：</label>
          <Select
            className={styles.filterSelect}
            popupClassName="product-filter-dropdown"
            value={searchParams.chainStatus === undefined || searchParams.chainStatus === '' ? '' : searchParams.chainStatus}
            onChange={(value) => onFilterChange('chainStatus', value || '')}
            allowClear={false}
          >
            {CHAIN_STATUS_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* 时间范围 */}
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>时间范围：</label>
          <Select
            className={styles.filterSelect}
            popupClassName="product-filter-dropdown"
            value={searchParams.timeRange === undefined || searchParams.timeRange === '' ? '' : searchParams.timeRange}
            onChange={(value) => onFilterChange('timeRange', value || '')}
            allowClear={false}
          >
            {TIME_RANGE_OPTIONS.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        {/* 操作按钮，每个按钮作为独立的 flex 项 */}
        <AdminButton
          variant="query"
          size="xs"
          icon="fas fa-search"
          onClick={handleQuery}
          className={styles.firstButton}
        >
          查询
        </AdminButton>
        <AdminButton
          variant="reset"
          size="xs"
          icon="fas fa-redo"
          onClick={handleReset}
        >
          重置
        </AdminButton>
        
        {/* 强制换行，让后续按钮显示在下一行 */}
        <div className={styles.lineBreak}></div>
        
        <AdminButton
          variant="add"
          size="xs"
          icon="fas fa-plus"
          onClick={onAdd}
        >
          新增
        </AdminButton>
        <AdminButton
          variant="delete"
          size="xs"
          icon="fas fa-trash-alt"
          onClick={onBatchDelete}
          disabled={selectedCount === 0}
          className={styles.deleteButton}
        >
          批量删除
        </AdminButton>
        <AdminButton
          variant="export"
          size="xs"
          icon="fas fa-download"
          onClick={onExport}
        >
          批量导出
        </AdminButton>
      </div>
    </div>
  );
};

export default ProductToolbar;
