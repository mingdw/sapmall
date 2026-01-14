import React from 'react';
import { Button } from 'antd';
import AdminCard from '../../../../components/common/AdminCard';
import StatCard from '../../../../components/common/StatCard';
import { parseTrend } from '../utils';
import type { ProductStats } from '../types';
import type { StatsPeriod } from '../constants';
import styles from '../ProductManagement.module.scss';

interface ProductStatsSectionProps {
  stats: ProductStats | null;
  period: StatsPeriod;
  onPeriodChange: (period: StatsPeriod) => void;
}

const ProductStatsSection: React.FC<ProductStatsSectionProps> = ({
  stats,
  period,
  onPeriodChange,
}) => {
  // 时间选择器作为 actions 传入 AdminCard
  const timeSelector = (
    <div className={styles.timeSelector}>
      <Button
        type={period === 'day' ? 'primary' : 'default'}
        size="small"
        onClick={() => onPeriodChange('day')}
      >
        每日
      </Button>
      <Button
        type={period === 'week' ? 'primary' : 'default'}
        size="small"
        onClick={() => onPeriodChange('week')}
      >
        每周
      </Button>
      <Button
        type={period === 'month' ? 'primary' : 'default'}
        size="small"
        onClick={() => onPeriodChange('month')}
      >
        每月
      </Button>
    </div>
  );

  return (
    <div className={styles.statsSection}>
      <AdminCard 
        icon="fas fa-chart-bar" 
        title="商品概览"
        actions={timeSelector}
      >
        <div className={styles.statsGrid}>
          <StatCard
            title="商品总数"
            value={stats?.totalProducts?.toString() || '0'}
            icon="fas fa-box"
            trend={parseTrend(stats?.totalProductsTrend)}
          />
          <StatCard
            title="订单总数"
            value={stats?.totalOrders?.toString() || '0'}
            icon="fas fa-receipt"
            trend={parseTrend(stats?.totalOrdersTrend)}
          />
          <StatCard
            title="总销售额"
            value={stats?.totalRevenue ? `${stats.totalRevenue} SAP` : '0 SAP'}
            icon="fas fa-coins"
            trend={parseTrend(stats?.totalRevenueTrend)}
          />
          <StatCard
            title="新增用户"
            value={stats?.newUsers?.toString() || '0'}
            icon="fas fa-user-plus"
            trend={parseTrend(stats?.newUsersTrend)}
          />
        </div>
      </AdminCard>
    </div>
  );
};

export default ProductStatsSection;
