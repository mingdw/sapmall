import React, { useEffect } from 'react';
import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { CalendarOutlined } from '@ant-design/icons';
import AdminButton from '../../../../components/common/AdminButton';
import { ORDER_STATUS_OPTIONS } from '../constants';
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
  useEffect(() => {
    dayjs.locale('zh-cn');
  }, []);

  return (
    <div className={styles.querySection}>
      <h4 className={styles.sectionLabel}>查询条件</h4>
      <div className={styles.toolbarRow}>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>订单状态：</span>
          <Select
            value={value.orderStatus}
            options={ORDER_STATUS_OPTIONS}
            onChange={(orderStatus) => onChange({ ...value, orderStatus })}
            className={styles.filterSelect}
            popupMatchSelectWidth={false}
            popupClassName={styles.filterDropdown}
          />
        </div>

        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>下单时间：</span>
          <RangePicker
            value={value.dateRange}
            onChange={(dateRange) => onChange({ ...value, dateRange })}
            className={styles.filterDateRange}
            popupClassName={styles.dateRangePopup}
            locale={locale.DatePicker}
            format="YYYY-MM-DD"
            allowEmpty={[true, true]}
            placeholder={['开始日期', '结束日期']}
            suffixIcon={<CalendarOutlined className={styles.datePickerIcon} />}
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
            查询
          </AdminButton>
          <AdminButton
            variant="reset"
            size="sm"
            icon="fas fa-redo"
            disabled={loading}
            onClick={onReset}
          >
            重置
          </AdminButton>
        </div>
      </div>
    </div>
  );
};

export default OrderFilterBar;
