import React, { useEffect, useMemo, useState } from 'react';
import { ConfigProvider, Table, Tabs, Tag, Tooltip } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { useTranslation } from 'react-i18next';
import type { OrderSummary } from '../../../../services/api/orderApi';
import {
  ORDER_STATUS,
  getPaymentStatusTabs,
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

function formatCountdown(seconds: number, expiredLabel: string): string {
  if (seconds <= 0) return expiredLabel;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function useCountdown(orderDate?: string, orderStatus?: number): number | null {
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
  return remaining;
}

const CountdownCell: React.FC<{ orderDate?: string; orderStatus?: number }> = ({
  orderDate,
  orderStatus,
}) => {
  const { t } = useTranslation();
  const remaining = useCountdown(orderDate, orderStatus);
  if (remaining === null) return <span className={styles.mutedText}>—</span>;
  const expiredLabel = t('trading.order.expired');
  const text = formatCountdown(remaining, expiredLabel);
  const isExpired = remaining <= 0;
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
  const { t } = useTranslation();
  const paymentTabs = getPaymentStatusTabs(t);

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
      title: t('trading.order.colOrderNo'),
      dataIndex: 'orderCode',
      width: 168,
      render: (code: string) => (
        <button type="button" onClick={() => onOpenDetail(code)} className={styles.orderCodeLink}>
          {code}
        </button>
      ),
    },
    {
      title: t('trading.order.colProducts'),
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
      title: t('trading.order.colTotalAmount', { defaultValue: '订单总金额' }),
      dataIndex: 'totalAmount',
      width: 140,
      render: (amount: number, record) => {
        if (amount == null) return <span className={styles.mutedText}>—</span>;
        return (
          <span>
            <span className={styles.amountRed}>{amount.toFixed(2)}</span>
            <span className={styles.currencyUnit}>{record.currency || 'USDC'}</span>
          </span>
        );
      },
    },
    {
      title: t('trading.order.colPayAmount', { defaultValue: '实付金额' }),
      dataIndex: 'payAmount',
      width: 140,
      render: (amount: number, record) => {
        if (amount == null) return <span className={styles.mutedText}>—</span>;
        const currency = record.settleCurrency || record.tokenSymbol || record.currency || 'USDC';
        return (
          <span>
            <span className={styles.amountRed}>{amount.toFixed(2)}</span>
            <span className={styles.currencyUnit}>{currency}</span>
          </span>
        );
      },
    },
    {
      title: t('trading.order.colFee', { defaultValue: '手续费' }),
      dataIndex: 'platformFeeAmount',
      width: 120,
      render: (amount: number, record) => {
        if (amount == null) return <span className={styles.mutedText}>—</span>;
        return (
          <span>
            <span className={styles.amountRed}>{amount.toFixed(2)}</span>
            <span className={styles.currencyUnit}>{record.currency || 'USDC'}</span>
          </span>
        );
      },
    },
    {
      title: t('trading.order.colGas', { defaultValue: '实际Gas' }),
      dataIndex: 'actGasFee',
      width: 120,
      render: (amount: number, record) => {
        if (amount == null) return <span className={styles.mutedText}>—</span>;
        const currency = record.settleCurrency || record.tokenSymbol || record.currency || 'USDC';
        return (
          <span>
            <span className={styles.amountRed}>{amount.toFixed(2)}</span>
            <span className={styles.currencyUnit}>{currency}</span>
          </span>
        );
      },
    },
    {
      title: t('trading.order.colChain', { defaultValue: '链' }),
      key: 'chain',
      width: 100,
      render: (_: unknown, record) =>
        record.chainName ? (
          <Tooltip title={`ChainID: ${record.chainId}`}>
            <span className={styles.mutedText}>{record.chainName}</span>
          </Tooltip>
        ) : (
          <span className={styles.mutedText}>—</span>
        ),
    },
    {
      title: t('trading.order.colPayStatus'),
      dataIndex: 'paymentStatus',
      width: 110,
      render: (_: number, record) => (
        <Tag color={paymentStatusTagColor(record.paymentStatus)} className={styles.paymentStatusTag}>
          {record.paymentStatusDesc || record.paymentStatus}
        </Tag>
      ),
    },
    {
      title: t('trading.order.dateRange'),
      dataIndex: 'orderDate',
      width: 168,
      render: (v: string) => <span className={styles.mutedText}>{formatDateTime(v)}</span>,
    },
    {
      title: t('trading.order.colCountdown', { defaultValue: '支付倒计时' }),
      key: 'countdown',
      width: 100,
      render: (_: unknown, record) => (
        <CountdownCell orderDate={record.orderDate} orderStatus={record.orderStatus} />
      ),
    },
    {
      title: t('trading.order.colConfirmedAt', { defaultValue: '确认时间' }),
      dataIndex: 'confirmedAt',
      width: 168,
      render: (v: string) => <span className={styles.mutedText}>{formatDateTime(v)}</span>,
    },
    {
      title: t('trading.order.colPayer', { defaultValue: '支付钱包' }),
      dataIndex: 'payerAddress',
      width: 120,
      render: (addr: string) => (
        <Tooltip title={addr}>
          <span className={styles.monoText}>{shortAddress(addr)}</span>
        </Tooltip>
      ),
    },
    {
      title: t('trading.order.colActions'),
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
    showTotal: (count) => t('trading.order.totalCount', { count }),
    onChange: onPageChange,
  };

  const tabItems = paymentTabs.map((tab) => ({
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
            scroll={{ x: 1700 }}
            locale={{
              emptyText: <span className={styles.tableEmptyText}>{t('trading.order.empty')}</span>,
            }}
            className={styles.orderTable}
          />
        </ConfigProvider>
      </div>
    ),
  }));

  return (
    <div className={styles.listSection}>
      <h4 className={styles.sectionLabel}>{t('trading.order.title')}</h4>
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
