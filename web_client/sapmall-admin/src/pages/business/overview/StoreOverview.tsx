import React, { useState } from 'react';
import {
  MerchantIdentityBar,
  KpiSection,
  TodoPanel,
  SalesTrendChart,
  TopProductsRank,
  RecentOrdersList,
} from './components';
import { storeOverviewMock } from './mock/storeOverviewMock';
import type { KpiPeriod } from './types';
import styles from './StoreOverview.module.scss';

/**
 * 商家店铺概览看板
 * Mock 数据驱动，风格对齐「我的订单」页。
 */
const StoreOverview: React.FC = () => {
  const [period, setPeriod] = useState<KpiPeriod>('today');
  const data = storeOverviewMock;

  return (
    <div className={styles.page}>
      <MerchantIdentityBar
        merchant={data.merchant}
        conversations={data.conversations}
        recentOrders={data.recentOrders}
        topProducts={data.topProducts}
      />

      <KpiSection
        period={period}
        metrics={data.kpiByPeriod[period]}
        onPeriodChange={setPeriod}
      />

      <TodoPanel items={data.todos} />

      <div className={styles.twoCol}>
        <div className={styles.colMain}>
          <SalesTrendChart points={data.trendByPeriod[period]} />
        </div>
        <div className={styles.colSide}>
          <TopProductsRank products={data.topProducts} />
        </div>
      </div>

      <RecentOrdersList orders={data.recentOrders} />

      {/* 页面底撑开，确保与外侧内容卡下边框有明显内边距 */}
      <div className={styles.pageBottomSpacer} aria-hidden />
    </div>
  );
};

export default StoreOverview;
