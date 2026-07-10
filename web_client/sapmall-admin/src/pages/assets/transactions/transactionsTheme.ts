import { theme, type ThemeConfig } from 'antd';

/** 交易管理页深色主题：蓝青色调 */
export const transactionsTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    colorTextPlaceholder: '#64748b',
    colorTextDisabled: '#64748b',
    colorTextHeading: '#e2e8f0',
    colorTextDescription: '#64748b',
    colorBgContainer: 'rgba(15, 23, 42, 0.48)',
    colorBgElevated: '#1e293b',
    colorBorder: 'rgba(51, 65, 85, 0.38)',
    colorPrimary: '#38bdf8',
    borderRadius: 8,
  },
  components: {
    Input: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
      activeBorderColor: 'rgba(56, 189, 248, 0.55)',
      hoverBorderColor: 'rgba(56, 189, 248, 0.35)',
    },
    Select: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
      colorBgElevated: '#1e293b',
      optionSelectedColor: '#e2e8f0',
      optionSelectedBg: 'rgba(56, 189, 248, 0.16)',
      optionActiveBg: 'rgba(56, 189, 248, 0.1)',
    },
    Table: {
      colorText: '#cbd5e1',
      colorTextHeading: '#64748b',
      colorBgContainer: 'transparent',
    },
    Tabs: {
      itemColor: '#94a3b8',
      itemHoverColor: '#e2e8f0',
      itemSelectedColor: '#f8fafc',
      inkBarColor: '#38bdf8',
    },
    Empty: {
      colorTextDisabled: '#64748b',
    },
    Drawer: {
      colorBgElevated: '#1e293b',
    },
    Tag: {
      colorText: '#cbd5e1',
    },
    DatePicker: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
    },
  },
};
