import React from 'react';
import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminButton from '../../../../components/common/AdminButton';
import {
  getOrderStatusOptions,
  ORDER_STATUS_TAG_COLORS,
} from '../constants';
import styles from '../PersonalOrderManager.module.scss';

const { RangePicker } = DatePicker;

export interface OrderFilterValues {
  orderStatus: number;
  dateRange: [Dayjs | null, Dayjs | null] | null;
}

interface OrderFilterBarProps {
  value: OrderFilterValues;
  loading?: boolean;
  onChange: (next: OrderFilterValues) => void;
  onSearch: () => void;
  onReset: () => void;
}

const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  value,
  loading,
  onChange,
  onSearch,
  onReset,
}) => {
  const { t } = useTranslation();
  const statusOptions = getOrderStatusOptions(t);

  const orderStatusOptions = statusOptions.map((opt) => ({
    ...opt,
    label:
      opt.value === 0 ? (
        opt.label
      ) : (
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-block',
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: ORDER_STATUS_TAG_COLORS[opt.value]?.color || '#94a3b8',
              flexShrink: 0,
            }}
          />
          {opt.label}
        </span>
      ),
  }));

  return (
    <div className={styles.querySection}>
      <h4 className={styles.sectionLabel}>{t('trading.order.querySection')}</h4>
      <div className={styles.toolbarRow}>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>{t('trading.order.orderStatus')}：</span>
          <Select
            value={value.orderStatus}
            options={orderStatusOptions}
            onChange={(orderStatus) => onChange({ ...value, orderStatus })}
            className={styles.filterSelect}
            popupMatchSelectWidth={false}
            popupClassName={styles.filterDropdown}
          />
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>{t('trading.order.dateRange')}：</span>
          <RangePicker
            value={value.dateRange}
            onChange={(dateRange) => onChange({ ...value, dateRange })}
            className={styles.filterDateRange}
            popupClassName={styles.dateRangePopup}
            format="YYYY-MM-DD"
            allowEmpty={[true, true]}
            placeholder={[t('common.startDate'), t('common.endDate')]}
            suffixIcon={<Calendar size={16} className={styles.datePickerIcon} />}
          />
        </div>

        <div className={styles.buttonGroup}>
          <AdminButton
            variant="query"
            size="sm"
            icon="fas fa-search"
            disabled={loading}
            onClick={onSearch}
          >
            {t('common.search')}
          </AdminButton>
          <AdminButton
            variant="reset"
            size="sm"
            icon="fas fa-redo"
            disabled={loading}
            onClick={onReset}
          >
            {t('common.reset')}
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

export default OrderFilterBar;
