import React from 'react';
import MessageUtils from '../../../../utils/messageUtils';
import type { OrderStatus, RecentOrder } from '../types';
import styles from '../StoreOverview.module.scss';

interface RecentOrdersListProps {
  orders: RecentOrder[];
}

const statusMap: Record<OrderStatus, { label: string; className: string }> = {
  pending_ship: { label: '待发货', className: 'statusPending' },
  shipped: { label: '已发货', className: 'statusShipped' },
  completed: { label: '已完成', className: 'statusCompleted' },
  after_sale: { label: '售后中', className: 'statusAfterSale' },
};

const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ orders }) => {
  const handleRowClick = (order: RecentOrder) => {
    MessageUtils.info(`订单详情即将开放：${order.orderNo}`);
  };

  return (
    <section className={styles.sectionCard}>
      <div className={styles.sectionHead}>
        <h3 className={styles.sectionLabel}>最近订单</h3>
      </div>
      <div className={styles.orderList}>
        {orders.map((order) => {
          const status = statusMap[order.status];
          return (
            <button
              key={order.id}
              type="button"
              className={styles.orderRow}
              onClick={() => handleRowClick(order)}
            >
              <div className={styles.orderMain}>
                <div className={styles.orderTitle}>
                  <span className={styles.orderNo}>{order.orderNo}</span>
                  <span className={`${styles.orderStatus} ${styles[status.className]}`}>
                    {status.label}
                  </span>
                </div>
                <div className={styles.orderDesc}>
                  {order.productName} · {order.buyer}
                </div>
              </div>
              <div className={styles.orderSide}>
                <div className={styles.orderAmount}>{order.amount}</div>
                <div className={styles.orderTime}>{order.time}</div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default RecentOrdersList;
