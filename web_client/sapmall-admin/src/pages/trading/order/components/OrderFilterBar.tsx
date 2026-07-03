import React, { useEffect } from 'react';
import { DatePicker, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import locale from 'antd/locale/zh_CN';
import { Calendar } from 'lucide-react';
import AdminButton from '../../../../components/common/AdminButton';
import { ORDER_STATUS_OPTIONS, ORDER_STATUS_TAG_COLORS, ORDER_STATUS } from '../constants';
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

const ORDER_STATUS_LABELS: Record<number, string> = {
  [ORDER_STATUS.PENDING_PAY]: '待支付',
  [ORDER_STATUS.ON_CHAIN_CONFIRMING]: '链上确认中',
  [ORDER_STATUS.PAID]: '已支付',
  [ORDER_STATUS.TO_SHIP]: '待发货',
  [ORDER_STATUS.SHIPPED]: '已发货',
  [ORDER_STATUS.COMPLETED]: '已完成',
  [ORDER_STATUS.CANCELLED]: '已取消',
  [ORDER_STATUS.EXPIRED]: '已过期',
  [ORDER_STATUS.PAY_FAILED]: '支付失败',
};

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

  const orderStatusOptions = ORDER_STATUS_OPTIONS.map((opt) => ({
    ...opt,
    label: opt.value === 0 ? (
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
        {ORDER_STATUS_LABELS[opt.value] || opt.label}
      </span>
    ),
  }));

  return (
    <div className={styles.querySection}>
      <h4 className={styles.sectionLabel}>查询条件</h4>
      <div className={styles.toolbarRow}>
        <div className={styles.filterItem}>
          <span className={styles.filterLabel}>订单状态：</span>
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
