import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from 'antd';
import MessageUtils from '../../../utils/messageUtils';
import orderApi, { GetOrderResp, OrderSummary } from '../../../services/api/orderApi';
import {
  OrderFilterBar,
  OrderListPanel,
  OrderDetailDrawer,
  type OrderFilterValues,
} from './components';
import {
  PAYMENT_STATUS,
  PAYMENT_STATUS_TABS,
  buildDappPayUrl,
  canCancelOrder,
  canResumePay,
} from './constants';
import styles from './PersonalOrderManager.module.scss';
import { useTranslation } from 'react-i18next';

const DEFAULT_FILTERS: OrderFilterValues = {
  orderStatus: 0,
  dateRange: null,
};

function matchPaymentTab(order: OrderSummary, tabKey: string): boolean {
  if (tabKey === 'all') return true;
  const tab = PAYMENT_STATUS_TABS.find((t) => t.key === tabKey);
  if (!tab || tab.value === 0) return true;
  return order.paymentStatus === tab.value;
}

const PersonalOrderManager: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<OrderFilterValues>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilterValues>(DEFAULT_FILTERS);
  const [activePaymentTab, setActivePaymentTab] = useState<string>('all');
  const [allOrders, setAllOrders] = useState<OrderSummary[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionLoadingId, setActionLoadingId] = useState<number>();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<GetOrderResp | null>(null);

  const loadAllOrders = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await orderApi.list({
        page: 1,
        pageSize: 9999,
        orderStatus: appliedFilters.orderStatus || undefined,
        orderDateStart: appliedFilters.dateRange?.[0]?.format('YYYY-MM-DD'),
        orderDateEnd: appliedFilters.dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      setAllOrders(Array.isArray(resp.data?.list) ? resp.data.list : []);
    } catch {
      MessageUtils.error(t('trading.order.loadFailed', { defaultValue: '加载订单列表失败' }));
    } finally {
      setLoading(false);
    }
  }, [appliedFilters]);

  useEffect(() => {
    loadAllOrders().catch(() => undefined);
  }, [loadAllOrders]);

  const filteredList = useMemo(() => {
    return allOrders.filter((order) => matchPaymentTab(order, activePaymentTab));
  }, [allOrders, activePaymentTab]);

  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allOrders.length };
    PAYMENT_STATUS_TABS.forEach((tab) => {
      if (tab.key === 'all') return;
      counts[tab.key] = allOrders.filter((o) => o.paymentStatus === tab.value).length;
    });
    return counts;
  }, [allOrders]);

  const total = filteredList.length;
  const pagedList = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, page, pageSize]);

  const handleSearch = () => {
    setPage(1);
    setAppliedFilters(filters);
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setActivePaymentTab('all');
    setPage(1);
  };

  const handleTabChange = (key: string) => {
    setActivePaymentTab(key);
    setPage(1);
  };

  const openDetail = async (orderCode: string) => {
    setDrawerOpen(true);
    setDetailLoading(true);
    setDetail(null);
    try {
      const resp = await orderApi.getByCode(orderCode);
      setDetail(resp.data ?? null);
    } catch {
      MessageUtils.error('加载订单明细失败');
      setDrawerOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const runModify = async (
    record: OrderSummary,
    action: 'cancel' | 'delete' | 'resumePay',
    confirmTitle: string,
    confirmContent: string,
  ) => {
    Modal.confirm({
      title: confirmTitle,
      content: confirmContent,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        setActionLoadingId(record.id);
        try {
          await orderApi.modify({ id: record.id, action });
          MessageUtils.success('操作成功');
          if (action === 'resumePay') {
            window.open(buildDappPayUrl(record.orderCode), '_blank', 'noopener,noreferrer');
          }
          await loadAllOrders();
        } catch {
          MessageUtils.error('操作失败');
        } finally {
          setActionLoadingId(undefined);
        }
      },
    });
  };

  const handleQueryStatus = async (record: OrderSummary) => {
    setActionLoadingId(record.id);
    try {
      const resp = await orderApi.queryStatus({ orderCode: record.orderCode });
      if (resp.data) {
        MessageUtils.success(`最新状态：订单状态=${resp.data.orderStatus}，支付状态=${resp.data.paymentStatus}`);
      } else {
        MessageUtils.success('查询完成');
      }
      await loadAllOrders();
    } catch {
      MessageUtils.error('查询失败');
    } finally {
      setActionLoadingId(undefined);
    }
  };

  const renderActions = (record: OrderSummary) => {
    const busy = actionLoadingId === record.id;
    const isConfirming = record.paymentStatus === PAYMENT_STATUS.CONFIRMING;
    const showView =
      activePaymentTab === String(PAYMENT_STATUS.CONFIRMING) || isConfirming;
    return (
      <div className={styles.actionGroup}>
        {showView ? (
          <button
            type="button"
            onClick={() => openDetail(record.orderCode)}
            className={styles.viewBtn}
          >
            查看
          </button>
        ) : null}
        {isConfirming ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => handleQueryStatus(record)}
            className={styles.queryStatusBtn}
          >
            手动查询
          </button>
        ) : null}
        {canResumePay(record.orderStatus, record.paymentStatus, record.orderDate) ? (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runModify(
                record,
                'resumePay',
                '继续支付',
                '将延长支付有效期，并在新窗口打开 DApp 完成链上支付。是否继续？',
              )
            }
            className={styles.resumePayBtn}
          >
            继续支付
          </button>
        ) : null}
        {canCancelOrder(record.orderStatus, record.paymentStatus) ? (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runModify(record, 'cancel', '取消订单', '取消后订单将无法继续支付，是否确认？')
            }
            className={styles.cancelBtn}
          >
            取消订单
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.personalOrdersPage}>
      <div className={styles.queryCard}>
        <OrderFilterBar
          value={filters}
          loading={loading}
          onChange={setFilters}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </div>

      <div className={styles.listCard}>
        <OrderListPanel
            loading={loading}
            list={pagedList}
            total={total}
            page={page}
            pageSize={pageSize}
            activePaymentTab={activePaymentTab}
            tabCounts={tabCounts}
            onTabChange={handleTabChange}
            onPageChange={(p, ps) => {
              setPage(p);
              setPageSize(ps);
            }}
            onOpenDetail={openDetail}
            renderActions={renderActions}
        />
      </div>

      <OrderDetailDrawer
        open={drawerOpen}
        loading={detailLoading}
        detail={detail}
        onClose={() => setDrawerOpen(false)}
      />
    </div>
  );
};

export default PersonalOrderManager;
