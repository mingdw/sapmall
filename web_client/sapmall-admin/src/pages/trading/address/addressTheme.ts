import { theme, type ThemeConfig } from 'antd';

/** 收货地址页 — 与项目一致的深色主题，去除多余装饰 */
export const addressTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorText: '#e2e8f0',
    colorTextSecondary: '#94a3b8',
    colorTextPlaceholder: '#64748b',
    colorTextDisabled: '#64748b',
    colorTextHeading: '#e2e8f0',
    colorTextDescription: '#64748b',
    colorBgContainer: 'rgba(15, 23, 42, 0.45)',
    colorBgElevated: '#1e293b',
    colorBorder: 'rgba(51, 65, 85, 0.4)',
    colorPrimary: '#3b82f6',
    borderRadius: 8,
  },
  components: {
    Input: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.5)',
      activeBorderColor: '#3b82f6',
      hoverBorderColor: 'rgba(59, 130, 246, 0.4)',
    },
    Select: {
      colorText: '#e2e8f0',
      colorTextPlaceholder: '#64748b',
      colorBgContainer: 'rgba(15, 23, 42, 0.5)',
      colorBgElevated: '#1e293b',
      optionSelectedColor: '#e2e8f0',
      optionSelectedBg: 'rgba(59, 130, 246, 0.15)',
      optionActiveBg: 'rgba(59, 130, 246, 0.08)',
    },
    Modal: {
      contentBg: '#1e293b',
      headerBg: '#1e293b',
      titleColor: '#e2e8f0',
      colorText: '#e2e8f0',
      colorTextDescription: '#94a3b8',
    },
    Checkbox: {
      colorPrimary: '#3b82f6',
      colorPrimaryHover: '#2563eb',
    },
    Empty: {
      colorTextDisabled: '#64748b',
    },
  },
};
