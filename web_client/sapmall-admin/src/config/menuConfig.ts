import { RoleMenuConfig } from '../types';

export const menuConfig: RoleMenuConfig = {
  admin: [
    {
      id: 'platform',
      title: '平台管理',
      icon: 'fas fa-cogs',
      items: [
        { id: 'dashboard', name: '平台概览', icon: 'fas fa-chart-pie', url: '/dashboard', title: '平台概览' },
        { id: 'user-management', name: '用户管理', icon: 'fas fa-users', url: '/user-management', title: '用户管理' },
        { id: 'merchant-manage', name: '商家管理', icon: 'fas fa-store', url: '/merchant-manage', title: '商家管理' },
        { id: 'admin-orders', name: '订单管理', icon: 'fas fa-shopping-bag', url: '/admin-orders', title: '订单管理' }
      ]
    },
    {
      id: 'contract',
      title: '合约管理',
      icon: 'fas fa-file-contract',
      items: [
        { id: 'smart-contracts', name: '智能合约', icon: 'fas fa-code', url: '/smart-contracts', title: '智能合约' },
        { id: 'transaction-monitor', name: '交易监控', icon: 'fas fa-chart-line', url: '/transaction-monitor', title: '交易监控' }
      ]
    },
    {
      id: 'system',
      title: '系统管理',
      icon: 'fas fa-server',
      items: [
        { id: 'system-settings', name: '系统设置', icon: 'fas fa-cog', url: '/system-settings', title: '系统设置' },
        { id: 'logs', name: '日志管理', icon: 'fas fa-file-alt', url: '/logs', title: '日志管理' }
      ]
    },
    {
      id: 'dao',
      title: 'DAO治理',
      icon: 'fas fa-vote-yea',
      items: [
        { id: 'governance-monitor', name: '治理监控', icon: 'fas fa-chart-pie', url: '/governance-monitor', title: '治理监控' },
        { id: 'admin-proposals', name: '提案管理', icon: 'fas fa-clipboard-list', url: '/admin-proposals', title: '提案管理' },
        { id: 'governance-config', name: '治理配置', icon: 'fas fa-sliders-h', url: '/governance-config', title: '治理配置' },
        { id: 'permission-management', name: '权限管理', icon: 'fas fa-user-shield', url: '/permission-management', title: '权限管理' },
        { id: 'system-governance', name: '系统治理', icon: 'fas fa-tools', url: '/system-governance', title: '系统治理' }
      ]
    }
  ],
  merchant: [
    {
      id: 'merchant-center',
      title: '商家中心',
      icon: 'fas fa-store',
      items: [
        { id: 'merchant-dashboard', name: '商家概览', icon: 'fas fa-chart-pie', url: '/merchant-dashboard', title: '商家概览' },
        { id: 'product-management', name: '商品管理', icon: 'fas fa-box', url: '/product-management', title: '商品管理' },
        { id: 'merchant-orders', name: '订单管理', icon: 'fas fa-shopping-bag', url: '/merchant-orders', title: '订单管理' },
        { id: 'merchant-finance', name: '财务管理', icon: 'fas fa-money-bill-wave', url: '/merchant-finance', title: '财务管理' },
        { id: 'merchant-marketing', name: '营销推广', icon: 'fas fa-bullhorn', url: '/merchant-marketing', title: '营销推广' }
      ]
    },
    {
      id: 'user-functions',
      title: '个人中心',
      icon: 'fas fa-user',
      items: [
        { id: 'profile', name: '个人信息', icon: 'fas fa-user-circle', url: '/profile', title: '个人信息' },
        { id: 'assets', name: '资产管理', icon: 'fas fa-wallet', url: '/assets', title: '资产管理' },
        { id: 'transactions', name: '交易记录', icon: 'fas fa-exchange-alt', url: '/transactions', title: '交易记录' }
      ]
    },
    {
      id: 'dao-user',
      title: 'DAO治理',
      icon: 'fas fa-vote-yea',
      items: [
        { id: 'proposals', name: '提案浏览', icon: 'fas fa-clipboard-list', url: '/proposals', title: '提案浏览' },
        { id: 'voting', name: '投票参与', icon: 'fas fa-vote-yea', url: '/voting', title: '投票参与' }
      ]
    }
  ],
  user: [
    {
      id: 'personal',
      title: '个人中心',
      icon: 'fas fa-user',
      items: [
        { id: 'profile', name: '个人信息', icon: 'fas fa-user-circle', url: '/profile', title: '个人信息' },
        { id: 'assets', name: '资产管理', icon: 'fas fa-wallet', url: '/assets', title: '资产管理' },
        { id: 'transactions', name: '交易记录', icon: 'fas fa-exchange-alt', url: '/transactions', title: '交易记录' }
      ]
    },
    {
      id: 'dao',
      title: 'DAO治理',
      icon: 'fas fa-vote-yea',
      items: [
        { id: 'proposals', name: '提案浏览', icon: 'fas fa-clipboard-list', url: '/proposals', title: '提案浏览' },
        { id: 'voting', name: '投票参与', icon: 'fas fa-vote-yea', url: '/voting', title: '投票参与' }
      ]
    }
  ]
};
