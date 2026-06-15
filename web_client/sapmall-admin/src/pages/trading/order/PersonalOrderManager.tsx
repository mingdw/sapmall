import React, { useCallback, useEffect, useState } from 'react';
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
  PAYMENT_STATUS_TABS,
  buildDappPayUrl,
  canCancelOrder,
  canDeleteOrder,
  canResumePay,
} from './constants';
import styles from './PersonalOrderManager.module.scss';

const DEFAULT_FILTERS: OrderFilterValues = {
  orderStatus: 0,
  dateRange: null,
};

function resolvePaymentStatus(tabKey: string): number | undefined {
  const tab = PAYMENT_STATUS_TABS.find((item) => item.key === tabKey);
  if (!tab || tab.value === 0) return undefined;
  return tab.value;
}

const PersonalOrderManager: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<OrderFilterValues>(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<OrderFilterValues>(DEFAULT_FILTERS);
  const [activePaymentTab, setActivePaymentTab] = useState<string>('all');
  const [list, setList] = useState<OrderSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [actionLoadingId, setActionLoadingId] = useState<number>();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<GetOrderResp | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const resp = await orderApi.list({
        page,
        pageSize,
        orderStatus: appliedFilters.orderStatus || undefined,
        paymentStatus: resolvePaymentStatus(activePaymentTab),
        orderDateStart: appliedFilters.dateRange?.[0]?.format('YYYY-MM-DD'),
        orderDateEnd: appliedFilters.dateRange?.[1]?.format('YYYY-MM-DD'),
      });
      setList(Array.isArray(resp.data?.list) ? resp.data.list : []);
      setTotal(resp.data?.total ?? 0);
    } catch {
      MessageUtils.error('加载订单列表失败');
    } finally {
      setLoading(false);
    }
  }, [activePaymentTab, appliedFilters, page, pageSize]);

  useEffect(() => {
    loadOrders().catch(() => undefined);
  }, [loadOrders]);

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
          await loadOrders();
        } catch {
          MessageUtils.error('操作失败');
        } finally {
          setActionLoadingId(undefined);
        }
      },
    });
  };

  const renderActions = (record: OrderSummary) => {
    const busy = actionLoadingId === record.id;
    return (
      <div className={styles.actionGroup}>
        <button
          type="button"
          disabled={busy}
          onClick={() => openDetail(record.orderCode)}
          className={`${styles.actionLink} ${styles.actionPrimary}`}
        >
          明细
        </button>
        {canResumePay(record.orderStatus, record.paymentStatus) ? (
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
            className={`${styles.actionLink} ${styles.actionWarning}`}
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
            className={`${styles.actionLink} ${styles.actionMuted}`}
          >
            取消
          </button>
        ) : null}
        {canDeleteOrder(record.orderStatus, record.paymentStatus) ? (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runModify(record, 'delete', '删除订单', '软删除后列表将不再展示该订单，是否确认？')
            }
            className={`${styles.actionLink} ${styles.actionDanger}`}
          >
            删除
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
            list={list}
            total={total}
            page={page}
            pageSize={pageSize}
            activePaymentTab={activePaymentTab}
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
