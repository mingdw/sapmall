import React, { useState } from 'react';
import { Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import AdminButton from '../../../../components/common/AdminButton';
import {
  getProductStatusOptions,
  getChainStatusOptions,
  getTimeRangeOptions,
  type ViewMode,
} from '../constants';
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
  onFilterChange,
  onClearFilters,
  onAdd,
  selectedCount,
  onBatchDelete,
  onExport,
  onQuery,
}) => {
  const { t } = useTranslation();
  const [productName, setProductName] = useState(searchParams.productName || '');
  const [productCode, setProductCode] = useState(searchParams.productCode || '');

  const productStatusOptions = getProductStatusOptions(t);
  const chainStatusOptions = getChainStatusOptions(t);
  const timeRangeOptions = getTimeRangeOptions(t);

  const handleQuery = () => {
    onFilterChange('productName', productName);
    onFilterChange('productCode', productCode);
    onQuery();
  };

  const handleReset = () => {
    setProductName('');
    setProductCode('');
    onClearFilters();
  };

  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.toolbarRow}>
        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>{t('business.products.productName')}：</label>
          <Input
            placeholder={t('business.products.searchPlaceholder')}
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            onPressEnter={handleQuery}
            className={styles.filterInput}
          />
        </div>

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

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>{t('common.status')}：</label>
          <Select
            className={styles.filterSelect}
            popupClassName="product-filter-dropdown"
            value={searchParams.status === undefined || searchParams.status === '' ? '' : searchParams.status}
            onChange={(value) => onFilterChange('status', value || '')}
            allowClear={false}
          >
            {productStatusOptions.map((option) => (
              <Option key={String(option.value)} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>{t('business.products.chainStatus')}：</label>
          <Select
            className={styles.filterSelect}
            popupClassName="product-filter-dropdown"
            value={searchParams.chainStatus === undefined || searchParams.chainStatus === '' ? '' : searchParams.chainStatus}
            onChange={(value) => onFilterChange('chainStatus', value || '')}
            allowClear={false}
          >
            {chainStatusOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <div className={styles.filterItem}>
          <label className={styles.filterLabel}>时间范围：</label>
          <Select
            className={styles.filterSelect}
            popupClassName="product-filter-dropdown"
            value={searchParams.timeRange === undefined || searchParams.timeRange === '' ? '' : searchParams.timeRange}
            onChange={(value) => onFilterChange('timeRange', value || '')}
            allowClear={false}
          >
            {timeRangeOptions.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>

        <AdminButton
          variant="query"
          size="xs"
          icon="fas fa-search"
          onClick={handleQuery}
          className={styles.firstButton}
        >
          {t('common.search')}
        </AdminButton>
        <AdminButton
          variant="reset"
          size="xs"
          icon="fas fa-redo"
          onClick={handleReset}
        >
          {t('common.reset')}
        </AdminButton>

        <div className={styles.lineBreak}></div>

        <AdminButton
          variant="add"
          size="xs"
          icon="fas fa-plus"
          onClick={onAdd}
        >
          {t('business.products.createProduct')}
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
