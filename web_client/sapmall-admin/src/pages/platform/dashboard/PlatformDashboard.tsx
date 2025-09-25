import React from 'react';
import AdminCard from '../../../components/common/AdminCard';
import StatCard from '../../../components/common/StatCard';
import SystemStatusCard from '../../../components/common/SystemStatusCard';
import AdminButton from '../../../components/common/AdminButton';
import styles from './PlatformDashboard.module.scss';

// 移除 Typography 导入，使用公共组件

interface PlatformDashboardProps {
  menuData?: any;
}

const PlatformDashboard: React.FC<PlatformDashboardProps> = ({ menuData }) => {
  // 核心数据
  const statsData = {
    totalUsers: 12345,
    totalRevenue: 1234567,
    totalProducts: 3456,
    activeMerchants: 234,
    userGrowth: 12.5,
    revenueGrowth: 8.3,
    productGrowth: 15.2,
    merchantGrowth: 5.7
  };

  // 系统状态数据 - 按照原型设计
  const systemStatus = [
    { name: 'API服务', status: 'healthy', detail: '响应时间: 45ms', icon: 'check-circle' },
    { name: '数据库', status: 'healthy', detail: '连接数: 45/100', icon: 'database' },
    { name: '缓存服务', status: 'warning', detail: '命中率: 78%', icon: 'exclamation-triangle' },
    { name: '区块链节点', status: 'healthy', detail: '区块高度: 1,234,567', icon: 'link' },
    { name: '邮件服务', status: 'healthy', detail: '成功率: 99.8%', icon: 'envelope' },
    { name: '定时任务调度', status: 'healthy', detail: '延迟: 0.2s', icon: 'tasks' },
    { name: '消息队列', status: 'healthy', detail: '积压: 0', icon: 'exchange-alt' },
    { name: '对象存储', status: 'healthy', detail: '容量: 80%', icon: 'cloud' }
  ];

  // 实时交易数据
  const recentTransactions = [
    { 
      id: 1, 
      type: 'shopping-cart', 
      title: '数字艺术作品购买', 
      buyer: '0x1234...5678', 
      amount: '￥1,299.00', 
      time: '2分钟前' 
    },
    { 
      id: 2, 
      type: 'download', 
      title: '软件授权购买', 
      buyer: '0x9876...4321', 
      amount: '￥899.00', 
      time: '5分钟前' 
    },
    { 
      id: 3, 
      type: 'graduation-cap', 
      title: '在线课程购买', 
      buyer: '0x5678...9012', 
      amount: '￥199.00', 
      time: '8分钟前' 
    }
  ];

  // 快捷操作
  const quickActions = [
    { icon: 'users-cog', title: '用户管理', description: '管理用户账户和权限', action: 'user-management' },
    { icon: 'shopping-bag', title: '订单管理', description: '查看和处理订单', action: 'order-management' },
    { icon: 'file-contract', title: '合约管理', description: '智能合约监控', action: 'contract-management' },
    { icon: 'vote-yea', title: 'DAO治理', description: '治理提案管理', action: 'dao-governance' },
    { icon: 'cog', title: '系统设置', description: '平台配置管理', action: 'system-settings' },
    { icon: 'chart-bar', title: '数据分析', description: '平台数据报表', action: 'analytics' }
  ];

  // 系统告警
  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      title: '缓存服务性能下降',
      description: 'Redis缓存命中率低于80%，建议检查缓存策略',
      time: '10分钟前',
      icon: 'exclamation-triangle'
    },
    {
      id: 2,
      type: 'info',
      title: '新用户注册量激增',
      description: '过去1小时新增用户156人，较平时增长200%',
      time: '30分钟前',
      icon: 'info-circle'
    }
  ];

  return (
    <div className={styles.dashboard}>
      {/* 平台核心数据概览 */}
      <AdminCard
        title="平台核心数据"
        icon="fas fa-chart-line"
        actions={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              icon="fas fa-refresh"
              onClick={() => console.log('刷新数据')}
            >
              刷新数据
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              icon="fas fa-download"
              onClick={() => console.log('导出报告')}
            >
              导出报告
            </AdminButton>
          </>
        }
      >
        <div className={styles.dashboardStatsGrid}>
          <StatCard
            title="总用户数"
            value={statsData.totalUsers}
            icon="fas fa-users"
            variant="primary"
            trend={{ value: `+${statsData.userGrowth}%`, type: 'positive' }}
          />
          <StatCard
            title="总交易额"
            value={`${statsData.totalRevenue.toLocaleString()} SAP`}
            icon="fas fa-money-bill-wave"
            variant="success"
            trend={{ value: `+${statsData.revenueGrowth}%`, type: 'positive' }}
          />
          <StatCard
            title="商品数量"
            value={statsData.totalProducts}
            icon="fas fa-shopping-bag"
            variant="purple"
            trend={{ value: `+${statsData.productGrowth}%`, type: 'positive' }}
          />
          <StatCard
            title="活跃商家"
            value={statsData.activeMerchants}
            icon="fas fa-store"
            variant="orange"
            trend={{ value: `+${statsData.merchantGrowth}%`, type: 'positive' }}
          />
        </div>
      </AdminCard>

      {/* 系统状态监控 */}
      <AdminCard
        title="系统状态监控"
        icon="fas fa-server"
        actions={
          <AdminButton
            variant="outline"
            size="sm"
            icon="fas fa-rotate-right"
            onClick={() => console.log('刷新系统状态')}
          >
            刷新
          </AdminButton>
        }
      >
        <div className={styles.systemStatusGrid}>
          {systemStatus.map((status, index) => (
            <SystemStatusCard
              key={index}
              name={status.name}
              status={status.status as 'healthy' | 'warning' | 'error'}
              detail={status.detail}
              icon={status.icon}
            />
          ))}
        </div>
      </AdminCard>

      {/* 实时交易监控 */}
      <AdminCard
        title="实时交易监控"
        icon="fas fa-bolt"
        actions={
          <AdminButton
            variant="outline"
            size="sm"
            icon="fas fa-external-link-alt"
            onClick={() => console.log('查看全部交易')}
          >
            查看全部
          </AdminButton>
        }
      >
        <div className={styles.realtimeTransactions}>
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className={styles.transactionItem}>
              <div className={styles.transactionIcon}>
                <i className={`fas fa-${transaction.type}`}></i>
              </div>
              <div className={styles.transactionInfo}>
                <div className={styles.transactionTitle}>{transaction.title}</div>
                <div className={styles.transactionDetails}>
                  <span className={styles.buyer}>{transaction.buyer}</span>
                  <span className={styles.amount}>{transaction.amount}</span>
                </div>
              </div>
              <div className={styles.transactionTime}>{transaction.time}</div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* 快捷操作面板 */}
      <AdminCard
        title="快捷操作"
        icon="fas fa-tools"
      >
        <div className={styles.quickActionsGrid}>
          {quickActions.map((action, index) => (
            <div key={index} className={styles.quickActionCard} onClick={() => console.log(action.action)}>
              <div className={styles.actionIcon}>
                <i className={`fas fa-${action.icon}`}></i>
              </div>
              <div className={styles.actionContent}>
                <h5>{action.title}</h5>
                <p>{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>

      {/* 系统告警 */}
      <AdminCard
        title="系统告警"
        icon="fas fa-bell"
        actions={
          <AdminButton
            variant="outline"
            size="sm"
            icon="fas fa-external-link-alt"
            onClick={() => console.log('查看全部告警')}
          >
            查看全部
          </AdminButton>
        }
      >
        <div className={styles.alertsList}>
          {systemAlerts.map((alert) => (
            <div key={alert.id} className={`${styles.alertItem} ${styles[`alert${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]}`}>
              <div className={styles.alertIcon}>
                <i className={`fas fa-${alert.icon}`}></i>
              </div>
              <div className={styles.alertContent}>
                <div className={styles.alertTitle}>{alert.title}</div>
                <div className={styles.alertDescription}>{alert.description}</div>
                <div className={styles.alertTime}>{alert.time}</div>
              </div>
              <div className={styles.alertActions}>
                <AdminButton
                  variant="outline"
                  size="xs"
                >
                  {alert.type === 'warning' ? '处理' : '查看'}
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
};

export default PlatformDashboard;
