import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Table, Tabs, Tag, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { OrderSummary } from '../../../../services/api/orderApi';
import {
  ORDER_STATUS,
  PAYMENT_STATUS_TABS,
  paymentStatusTagColor,
} from '../constants';
import OrderProductThumb from './OrderProductThumb';
import styles from '../PersonalOrderManager.module.scss';

interface Props {
  loading: boolean;
  list: OrderSummary[];
  total: number;
  page: number;
  pageSize: number;
  activePaymentTab: string;
  tabCounts?: Record<string, number>;
  onTabChange: (key: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onOpenDetail: (orderCode: string) => void;
  renderActions: (record: OrderSummary) => React.ReactNode;
}

function formatDateTime(value?: string): string {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

function shortAddress(addr?: string): string {
  if (!addr) return '—';
  if (addr.length <= 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

function formatCountdown(seconds: number): string {
  if (seconds <= 0) return '已过期';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function useCountdown(orderDate?: string, orderStatus?: number): string | null {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!orderDate || orderStatus !== ORDER_STATUS.PENDING_PAY) {
      setRemaining(null);
      return;
    }
    const created = new Date(orderDate).getTime();
    if (Number.isNaN(created)) {
      setRemaining(null);
      return;
    }
    const expireAt = created + 30 * 60 * 1000;

    const tick = () => {
      const left = Math.floor((expireAt - Date.now()) / 1000);
      if (left <= 0) {
        setRemaining(0);
        return false;
      }
      setRemaining(left);
      return true;
    };

    if (!tick()) return;
    const timer = setInterval(() => {
      if (!tick()) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [orderDate, orderStatus]);

  if (remaining === null) return null;
  return formatCountdown(remaining);
}

const CountdownCell: React.FC<{ orderDate?: string; orderStatus?: number }> = ({
  orderDate,
  orderStatus,
}) => {
  const text = useCountdown(orderDate, orderStatus);
  if (text === null) return <span className={styles.mutedText}>—</span>;
  const isExpired = text === '已过期';
  return (
    <span className={isExpired ? styles.countdownExpired : styles.countdownActive}>
      {text}
    </span>
  );
};

const OrderListPanel: React.FC<Props> = ({
  loading,
  list,
  total,
  page,
  pageSize,
  activePaymentTab,
  tabCounts,
  onTabChange,
  onPageChange,
  onOpenDetail,
  renderActions,
}) => {
  const tableTheme = useMemo(
    () => ({
      components: {
        Table: {
          colorBgContainer: 'transparent',
          rowHoverBg: 'rgba(30, 41, 59, 0.45)',
          headerBg: 'rgba(30, 41, 59, 0.72)',
          headerColor: '#e2e8f0',
          borderColor: 'rgba(51, 65, 85, 0.45)',
          colorText: '#cbd5e1',
          colorTextHeading: '#e2e8f0',
        },
      },
    }),
    [],
  );

  const columns: ColumnsType<OrderSummary> = [
    {
      title: '订单号',
      dataIndex: 'orderCode',
      width: 168,
      render: (code: string) => (
        <button type="button" onClick={() => onOpenDetail(code)} className={styles.orderCodeLink}>
          {code}
        </button>
      ),
    },
    {
      title: '商品',
      dataIndex: 'productName',
      ellipsis: true,
      width: 240,
      render: (name: string, record) => (
          <div className={styles.productCell}>
            <OrderProductThumb skuImgs={record.skuImgs} />
            <div className="min-w-0">
              <p className={styles.productName}>{name || '—'}</p>
              {record.productQuantity ? (
                <p className={styles.productQty}>× {record.productQuantity}</p>
              ) : null}
            </div>
          </div>
        ),
    },
    {
      title: '订单总金额',
      dataIndex: 'totalAmount',
      width: 120,
      render: (amount: number, record) => (
        <span className={styles.amountRed}>
          {amount != null ? `${amount.toFixed(2)} ${record.currency || 'USDC'}` : '—'}
        </span>
      ),
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      width: 120,
      render: (amount: number, record) => (
        <span className={styles.amountRed}>
          {amount != null ? `${amount.toFixed(2)} ${record.currency || 'USDC'}` : '—'}
        </span>
      ),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 110,
      render: (_: number, record) => (
        <Tag color={paymentStatusTagColor(record.paymentStatus)} className={styles.paymentStatusTag}>
          {record.paymentStatusDesc || record.paymentStatus}
        </Tag>
      ),
    },
    {
      title: '下单时间',
      dataIndex: 'orderDate',
      width: 168,
      render: (v: string) => <span className={styles.mutedText}>{formatDateTime(v)}</span>,
    },
    {
      title: '支付倒计时',
      key: 'countdown',
      width: 100,
      render: (_: unknown, record) => (
        <CountdownCell orderDate={record.orderDate} orderStatus={record.orderStatus} />
      ),
    },
    {
      title: '支付钱包',
      dataIndex: 'payerAddress',
      width: 120,
      render: (addr: string) => (
        <Tooltip title={addr}>
          <span className={styles.monoText}>{shortAddress(addr)}</span>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 120,
      render: (_: unknown, record) => renderActions(record),
    },
  ];

  const pagination: TablePaginationConfig = {
    current: page,
    pageSize,
    total,
    showSizeChanger: true,
    showTotal: (t) => `共 ${t} 条`,
    onChange: onPageChange,
  };

  const tabItems = PAYMENT_STATUS_TABS.map((tab) => ({
    key: tab.key,
    label: (
      <span>
        {tab.label}
        <span className={`${styles.tabBadge} ${activePaymentTab === tab.key ? styles.tabBadgeActive : ''}`}>
          ({tabCounts?.[tab.key] ?? (activePaymentTab === tab.key ? total : 0)})
        </span>
      </span>
    ),
    children: (
      <div className={styles.tableWrapper}>
        <ConfigProvider theme={tableTheme}>
          <Table<OrderSummary>
            rowKey="id"
            size="middle"
            loading={loading}
            columns={columns}
            dataSource={list}
            pagination={pagination}
            scroll={{ x: 1100 }}
            locale={{
              emptyText: <span className={styles.tableEmptyText}>暂无订单数据</span>,
            }}
            className={styles.orderTable}
          />
        </ConfigProvider>
      </div>
    ),
  }));

  return (
    <div className={styles.listSection}>
      <h4 className={styles.sectionLabel}>订单列表</h4>
      <Tabs
        activeKey={activePaymentTab}
        onChange={onTabChange}
        items={tabItems}
        className={styles.paymentTabs}
        destroyInactiveTabPane={false}
      />
    </div>
  );
};

export default OrderListPanel;
