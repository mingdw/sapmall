import { theme, type ThemeConfig } from 'antd';

/** 链配置页深色主题：与 admin 主色（emerald）一致 */
export const chainnetTheme: ThemeConfig = {
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
    colorPrimary: '#34d399',
    borderRadius: 8,
  },
  components: {
    Input: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.55)',
      activeBorderColor: 'rgba(52, 211, 153, 0.55)',
      hoverBorderColor: 'rgba(52, 211, 153, 0.35)',
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
      optionSelectedBg: 'rgba(52, 211, 153, 0.16)',
      optionActiveBg: 'rgba(52, 211, 153, 0.1)',
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
      inkBarColor: '#34d399',
    },
    Empty: {
      colorTextDisabled: '#64748b',
    },
    Switch: {
      colorPrimary: '#34d399',
    },
  },
};

/** Select 下拉挂载在 body，使用全局 class 保证样式生效 */
export const CHAINNET_SELECT_POPUP_CLASS = 'chainnet-select-dropdown';
