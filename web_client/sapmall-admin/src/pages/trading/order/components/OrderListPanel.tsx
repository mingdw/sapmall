import React, { useMemo } from 'react';
import { ConfigProvider, Table, Tabs, Tag, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { OrderSummary } from '../../../../services/api/orderApi';
import {
  PAYMENT_STATUS_TABS,
  orderStatusTagColor,
  paymentStatusTagColor,
} from '../constants';
import styles from '../PersonalOrderManager.module.scss';

interface Props {
  loading: boolean;
  list: OrderSummary[];
  total: number;
  page: number;
  pageSize: number;
  activePaymentTab: string;
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

const OrderListPanel: React.FC<Props> = ({
  loading,
  list,
  total,
  page,
  pageSize,
  activePaymentTab,
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
      fixed: 'left',
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
      width: 200,
      render: (name: string, record) => (
        <div className="min-w-0">
          <p className={styles.productName}>{name || '—'}</p>
          {record.productQuantity ? (
            <p className={styles.productQty}>× {record.productQuantity}</p>
          ) : null}
        </div>
      ),
    },
    {
      title: '实付金额',
      dataIndex: 'payAmount',
      width: 120,
      render: (amount: number, record) => (
        <span className={styles.payAmount}>
          {amount != null ? `${amount.toFixed(2)} ${record.currency || 'USDC'}` : '—'}
        </span>
      ),
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 100,
      render: (_: number, record) => (
        <Tag color={orderStatusTagColor(record.orderStatus)}>
          {record.orderStatusDesc || record.orderStatus}
        </Tag>
      ),
    },
    {
      title: '支付状态',
      dataIndex: 'paymentStatus',
      width: 100,
      render: (_: number, record) => (
        <Tag color={paymentStatusTagColor(record.paymentStatus)}>
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
      fixed: 'right',
      width: 220,
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
        {activePaymentTab === tab.key ? (
          <span className={`${styles.tabBadge} ${styles.tabBadgeActive}`}>({total})</span>
        ) : null}
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
