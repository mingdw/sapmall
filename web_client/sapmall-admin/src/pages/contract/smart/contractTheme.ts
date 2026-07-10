import { theme, type ThemeConfig } from 'antd';

/** 合约管理页深色主题：与 chainnet 页保持一致 */
export const contractTheme: ThemeConfig = {
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
    colorPrimary: '#60a5fa',
    borderRadius: 8,
  },
  components: {
    Input: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
      activeBorderColor: 'rgba(96, 165, 250, 0.55)',
      hoverBorderColor: 'rgba(96, 165, 250, 0.35)',
    },
    InputNumber: {
      colorText: '#e2e8f0',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
    },
    Select: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
      colorBgElevated: '#1e293b',
      optionSelectedColor: '#e2e8f0',
      optionSelectedBg: 'rgba(96, 165, 250, 0.16)',
      optionActiveBg: 'rgba(96, 165, 250, 0.1)',
    },
    Form: {
      labelColor: '#94a3b8',
      colorTextDescription: '#64748b',
    },
    Table: {
      colorText: '#cbd5e1',
      colorTextHeading: '#64748b',
      colorBgContainer: 'transparent',
    },
    Modal: {
      contentBg: '#1e293b',
      headerBg: 'rgba(15, 23, 42, 0.35)',
      titleColor: '#e2e8f0',
      colorText: '#e2e8f0',
      titleFontSize: 16,
      borderRadiusLG: 12,
      paddingContentHorizontal: 22,
      paddingMD: 18,
    },
    Tabs: {
      itemColor: '#94a3b8',
      itemHoverColor: '#e2e8f0',
      itemSelectedColor: '#f8fafc',
      inkBarColor: '#60a5fa',
    },
    Empty: {
      colorTextDisabled: '#64748b',
    },
    Switch: {
      colorPrimary: '#60a5fa',
    },
    Drawer: {
      colorBgElevated: '#1e293b',
    },
    Tag: {
      colorText: '#cbd5e1',
    },
  },
};

/** Select 下拉挂载在 body，使用全局 class 保证样式生效 */
export const CONTRACT_SELECT_POPUP_CLASS = 'contract-select-dropdown';
