import React, { useState, useEffect } from 'react';
import AdminCard from '../../../components/common/AdminCard';
import StatCard from '../../../components/common/StatCard';
import AdminButton from '../../../components/common/AdminButton';
import styles from './UserManage.module.scss';

interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string;
  status: 'active' | 'inactive' | 'locked';
  userType: 'admin' | 'merchant' | 'customer';
  registerTime: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
}

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalRevenue: number;
  userGrowth: number;
  revenueGrowth: number;
}

const UserManage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    activeUsers: 0,
    newUsersToday: 0,
    totalRevenue: 0,
    userGrowth: 0,
    revenueGrowth: 0
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeFunction, setActiveFunction] = useState<string>('user-list');

  // 模拟数据加载
  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    // 模拟API调用
    setTimeout(() => {
      const mockUsers: User[] = [
        {
          id: 1,
          username: 'alice_crypto',
          email: 'alice@example.com',
          nickname: 'Alice',
          avatar: '/avatars/alice.jpg',
          status: 'active',
          userType: 'customer',
          registerTime: '2024-01-15',
          lastLogin: '2024-01-20 14:30',
          totalOrders: 12,
          totalSpent: 2340.50
        },
        {
          id: 2,
          username: 'bob_artist',
          email: 'bob@example.com',
          nickname: 'Bob Artist',
          avatar: '/avatars/bob.jpg',
          status: 'active',
          userType: 'merchant',
          registerTime: '2024-01-10',
          lastLogin: '2024-01-20 16:45',
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: 3,
          username: 'charlie_admin',
          email: 'charlie@example.com',
          nickname: 'Charlie Admin',
          avatar: '/avatars/charlie.jpg',
          status: 'active',
          userType: 'admin',
          registerTime: '2024-01-01',
          lastLogin: '2024-01-20 18:20',
          totalOrders: 0,
          totalSpent: 0
        },
        {
          id: 4,
          username: 'diana_buyer',
          email: 'diana@example.com',
          nickname: 'Diana',
          avatar: '/avatars/diana.jpg',
          status: 'inactive',
          userType: 'customer',
          registerTime: '2024-01-12',
          lastLogin: '2024-01-18 10:15',
          totalOrders: 5,
          totalSpent: 890.00
        },
        {
          id: 5,
          username: 'eve_creator',
          email: 'eve@example.com',
          nickname: 'Eve Creator',
          avatar: '/avatars/eve.jpg',
          status: 'locked',
          userType: 'merchant',
          registerTime: '2024-01-08',
          lastLogin: '2024-01-15 09:30',
          totalOrders: 0,
          totalSpent: 0
        }
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  };

  const loadStats = async () => {
    // 模拟统计数据
    setStats({
      totalUsers: 12345,
      activeUsers: 9876,
      newUsersToday: 156,
      totalRevenue: 2345678.90,
      userGrowth: 12.5,
      revenueGrowth: 8.3
    });
  };

  // 筛选用户
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesType = typeFilter === 'all' || user.userType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // 获取状态显示文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '正常';
      case 'inactive': return '禁用';
      case 'locked': return '锁定';
      default: return status;
    }
  };

  // 获取状态样式类
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'inactive': return styles.statusInactive;
      case 'locked': return styles.statusLocked;
      default: return '';
    }
  };

  // 获取用户类型显示文本
  const getUserTypeText = (type: string) => {
    switch (type) {
      case 'admin': return '管理员';
      case 'merchant': return '商家';
      case 'customer': return '客户';
      default: return type;
    }
  };

  // 获取用户类型样式类
  const getUserTypeClass = (type: string) => {
    switch (type) {
      case 'admin': return styles.typeAdmin;
      case 'merchant': return styles.typeMerchant;
      case 'customer': return styles.typeCustomer;
      default: return '';
    }
  };

  // 用户操作
  const handleUserAction = (action: string, userId: number) => {
    console.log(`执行操作: ${action}, 用户ID: ${userId}`);
    // 这里实现具体的用户操作逻辑
  };

  return (
    <div className={styles.userManage}>
      {/* 用户统计概览 */}
      <AdminCard
        title="用户统计概览"
        icon="fas fa-users"
        actions={
          <>
            <AdminButton
              variant="outline"
              size="sm"
              icon="fas fa-refresh"
              onClick={loadStats}
            >
              刷新数据
            </AdminButton>
            <AdminButton
              variant="primary"
              size="sm"
              icon="fas fa-download"
              onClick={() => console.log('导出用户数据')}
            >
              导出数据
            </AdminButton>
          </>
        }
      >
        <div className={styles.statsGrid}>
          <StatCard
            title="总用户数"
            value={stats.totalUsers}
            icon="fas fa-users"
            variant="primary"
            trend={{ value: `+${stats.userGrowth}%`, type: 'positive' }}
          />
          <StatCard
            title="活跃用户"
            value={stats.activeUsers}
            icon="fas fa-user-check"
            variant="success"
            trend={{ value: `+5.2%`, type: 'positive' }}
          />
          <StatCard
            title="今日新增"
            value={stats.newUsersToday}
            icon="fas fa-user-plus"
            variant="purple"
            trend={{ value: `+23.1%`, type: 'positive' }}
          />
          <StatCard
            title="用户消费总额"
            value={`${stats.totalRevenue.toLocaleString()} SAP`}
            icon="fas fa-money-bill-wave"
            variant="orange"
            trend={{ value: `+${stats.revenueGrowth}%`, type: 'positive' }}
          />
        </div>
      </AdminCard>

      {/* 快速操作区 */}
      <AdminCard
        title="快速操作"
        icon="fas fa-bolt"
      >
        <div className={styles.quickActionsGrid}>
          <div 
            className={`${styles.quickActionCard} ${activeFunction === 'user-list' ? styles.active : ''}`}
            onClick={() => setActiveFunction('user-list')}
          >
            <div className={styles.actionIcon}>
              <i className="fas fa-users-cog"></i>
            </div>
            <div className={styles.actionContent}>
              <h5>用户管理</h5>
              <p>查看和管理所有用户账户</p>
            </div>
          </div>
          
          <div 
            className={`${styles.quickActionCard} ${activeFunction === 'kyc-review' ? styles.active : ''}`}
            onClick={() => setActiveFunction('kyc-review')}
          >
            <div className={styles.actionIcon}>
              <i className="fas fa-id-card"></i>
            </div>
            <div className={styles.actionContent}>
              <h5>KYC审核</h5>
              <p>处理用户身份认证申请</p>
              <span className={styles.actionBadge}>12</span>
            </div>
          </div>
          
          <div 
            className={`${styles.quickActionCard} ${activeFunction === 'permissions' ? styles.active : ''}`}
            onClick={() => setActiveFunction('permissions')}
          >
            <div className={styles.actionIcon}>
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className={styles.actionContent}>
              <h5>权限分配</h5>
              <p>管理用户角色和权限</p>
            </div>
          </div>
          
          <div 
            className={`${styles.quickActionCard} ${activeFunction === 'user-analytics' ? styles.active : ''}`}
            onClick={() => setActiveFunction('user-analytics')}
          >
            <div className={styles.actionIcon}>
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className={styles.actionContent}>
              <h5>数据分析</h5>
              <p>用户行为和数据统计</p>
            </div>
          </div>
        </div>
      </AdminCard>

      {/* 功能区容器 */}
      <div className={styles.functionCardsContainer}>
        {/* 用户管理功能 */}
        {activeFunction === 'user-list' && (
          <AdminCard
            title="用户列表管理"
            icon="fas fa-list"
            actions={
              <>
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon="fas fa-plus"
                  onClick={() => console.log('添加用户')}
                >
                  添加用户
                </AdminButton>
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon="fas fa-upload"
                  onClick={() => console.log('批量导入')}
                >
                  批量导入
                </AdminButton>
              </>
            }
          >
        {/* 搜索和筛选 */}
        <div className={styles.filters}>
          <div className={styles.searchBox}>
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="搜索用户名、邮箱或昵称..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">全部状态</option>
              <option value="active">正常</option>
              <option value="inactive">禁用</option>
              <option value="locked">锁定</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="all">全部类型</option>
              <option value="admin">管理员</option>
              <option value="merchant">商家</option>
              <option value="customer">客户</option>
            </select>
          </div>
        </div>

        {/* 用户列表表格 */}
        <div className={styles.userTable}>
          <div className={styles.tableHeader}>
            <div className={styles.colAvatar}>头像</div>
            <div className={styles.colUser}>用户信息</div>
            <div className={styles.colType}>类型</div>
            <div className={styles.colStatus}>状态</div>
            <div className={styles.colStats}>统计</div>
            <div className={styles.colTime}>时间</div>
            <div className={styles.colActions}>操作</div>
          </div>
          
          {loading ? (
            <div className={styles.loadingRow}>
              <i className="fas fa-spinner fa-spin"></i>
              <span>加载中...</span>
            </div>
          ) : (
            <div className={styles.tableBody}>
              {filteredUsers.map((user) => (
                <div key={user.id} className={styles.tableRow}>
                  <div className={styles.colAvatar}>
                    <div className={styles.avatar}>
                      <img src={user.avatar} alt={user.nickname} />
                    </div>
                  </div>
                  <div className={styles.colUser}>
                    <div className={styles.userInfo}>
                      <div className={styles.username}>{user.username}</div>
                      <div className={styles.nickname}>{user.nickname}</div>
                      <div className={styles.email}>{user.email}</div>
                    </div>
                  </div>
                  <div className={styles.colType}>
                    <span className={`${styles.userType} ${getUserTypeClass(user.userType)}`}>
                      {getUserTypeText(user.userType)}
                    </span>
                  </div>
                  <div className={styles.colStatus}>
                    <span className={`${styles.status} ${getStatusClass(user.status)}`}>
                      {getStatusText(user.status)}
                    </span>
                  </div>
                  <div className={styles.colStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>订单:</span>
                      <span className={styles.statValue}>{user.totalOrders}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>消费:</span>
                      <span className={styles.statValue}>{user.totalSpent.toFixed(2)} SAP</span>
                    </div>
                  </div>
                  <div className={styles.colTime}>
                    <div className={styles.timeItem}>
                      <div className={styles.timeLabel}>注册:</div>
                      <div className={styles.timeValue}>{user.registerTime}</div>
                    </div>
                    <div className={styles.timeItem}>
                      <div className={styles.timeLabel}>登录:</div>
                      <div className={styles.timeValue}>{user.lastLogin}</div>
                    </div>
                  </div>
                  <div className={styles.colActions}>
                    <div className={styles.actionButtons}>
                      <AdminButton
                        variant="outline"
                        size="xs"
                        icon="fas fa-eye"
                        onClick={() => handleUserAction('view', user.id)}
                      >
                        查看
                      </AdminButton>
                      <AdminButton
                        variant="outline"
                        size="xs"
                        icon="fas fa-edit"
                        onClick={() => handleUserAction('edit', user.id)}
                      >
                        编辑
                      </AdminButton>
                      {user.status === 'active' ? (
                        <AdminButton
                          variant="warning"
                          size="xs"
                          icon="fas fa-lock"
                          onClick={() => handleUserAction('lock', user.id)}
                        >
                          锁定
                        </AdminButton>
                      ) : (
                        <AdminButton
                          variant="outline"
                          size="xs"
                          icon="fas fa-unlock"
                          onClick={() => handleUserAction('unlock', user.id)}
                        >
                          解锁
                        </AdminButton>
                      )}
                      <AdminButton
                        variant="danger"
                        size="xs"
                        icon="fas fa-trash"
                        onClick={() => handleUserAction('delete', user.id)}
                      >
                        删除
                      </AdminButton>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 分页 */}
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            显示 1-{filteredUsers.length} 条，共 {filteredUsers.length} 条记录
          </div>
          <div className={styles.paginationControls}>
            <AdminButton variant="outline" size="sm" disabled>
              上一页
            </AdminButton>
            <span className={styles.pageInfo}>第 1 页，共 1 页</span>
            <AdminButton variant="outline" size="sm" disabled>
              下一页
            </AdminButton>
          </div>
        </div>
          </AdminCard>
        )}

        {/* KYC审核功能 */}
        {activeFunction === 'kyc-review' && (
          <AdminCard
            title="KYC审核"
            icon="fas fa-id-card"
            actions={
              <>
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon="fas fa-clock"
                  onClick={() => console.log('待审核')}
                >
                  待审核 <span className={styles.tabBadge}>3</span>
                </AdminButton>
                <AdminButton
                  variant="outline"
                  size="sm"
                  icon="fas fa-check-circle"
                  onClick={() => console.log('已审核')}
                >
                  已审核 <span className={styles.tabBadge}>2</span>
                </AdminButton>
              </>
            }
          >
            <div className={styles.kycListContainer}>
              <div className={styles.kycTableHeader}>
                <div className={styles.headerItem}>申请人信息</div>
                <div className={styles.headerItem}>证件信息</div>
                <div className={styles.headerItem}>申请时间</div>
                <div className={styles.headerItem}>风险等级</div>
                <div className={styles.headerItem}>状态</div>
                <div className={styles.headerItem}>操作</div>
              </div>
              <div className={styles.kycContent}>
                <div className={styles.emptyState}>
                  <i className="fas fa-id-card"></i>
                  <p>暂无KYC申请数据</p>
                </div>
              </div>
            </div>
          </AdminCard>
        )}

        {/* 权限分配功能 */}
        {activeFunction === 'permissions' && (
          <AdminCard
            title="权限分配"
            icon="fas fa-shield-alt"
            actions={
              <AdminButton
                variant="primary"
                size="sm"
                icon="fas fa-plus"
                onClick={() => console.log('新增角色')}
              >
                新增角色
              </AdminButton>
            }
          >
            <div className={styles.adminTableContainer}>
              <table className={styles.adminTable}>
                <thead>
                  <tr>
                    <th>角色名称</th>
                    <th>编码</th>
                    <th>状态</th>
                    <th>描述</th>
                    <th className={styles.textCenter}>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>超级管理员</td>
                    <td>super_admin</td>
                    <td><span className={styles.statusActive}>启用</span></td>
                    <td>拥有系统所有权限</td>
                    <td className={styles.textCenter}>
                      <AdminButton variant="outline" size="xs" icon="fas fa-edit">
                        编辑
                      </AdminButton>
                    </td>
                  </tr>
                  <tr>
                    <td>普通管理员</td>
                    <td>admin</td>
                    <td><span className={styles.statusActive}>启用</span></td>
                    <td>拥有部分管理权限</td>
                    <td className={styles.textCenter}>
                      <AdminButton variant="outline" size="xs" icon="fas fa-edit">
                        编辑
                      </AdminButton>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AdminCard>
        )}

        {/* 数据分析功能 */}
        {activeFunction === 'user-analytics' && (
          <AdminCard
            title="数据分析"
            icon="fas fa-chart-bar"
          >
            <div className={styles.analyticsContainer}>
              <div className={styles.analyticsGrid}>
                <div className={styles.analyticsCard}>
                  <h4>用户增长趋势</h4>
                  <div className={styles.chartPlaceholder}>
                    <i className="fas fa-chart-line"></i>
                    <p>用户增长图表</p>
                  </div>
                </div>
                <div className={styles.analyticsCard}>
                  <h4>用户活跃度分析</h4>
                  <div className={styles.chartPlaceholder}>
                    <i className="fas fa-chart-pie"></i>
                    <p>活跃度分布图表</p>
                  </div>
                </div>
                <div className={styles.analyticsCard}>
                  <h4>KYC审核统计</h4>
                  <div className={styles.chartPlaceholder}>
                    <i className="fas fa-chart-bar"></i>
                    <p>审核统计图表</p>
                  </div>
                </div>
                <div className={styles.analyticsCard}>
                  <h4>用户价值分布</h4>
                  <div className={styles.chartPlaceholder}>
                    <i className="fas fa-chart-area"></i>
                    <p>价值分布图表</p>
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>
        )}
      </div>
    </div>
  );
};

export default UserManage;
