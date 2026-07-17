import { darkTheme, type Theme } from '@rainbow-me/rainbowkit';

/**
 * Sapphire Mall 钱包弹窗主题
 * 对齐 DApp 深色渐变（slate + indigo/violet）
 */
export const sapmallRainbowKitTheme: Theme = {
  ...darkTheme({
    accentColor: '#6366f1',
    accentColorForeground: '#ffffff',
    borderRadius: 'large',
    fontStack: 'system',
    overlayBlur: 'small',
  }),
  colors: {
    ...darkTheme().colors,
    accentColor: '#6366f1',
    accentColorForeground: '#ffffff',
    actionButtonBorder: 'rgba(148, 163, 184, 0.18)',
    actionButtonBorderMobile: 'rgba(148, 163, 184, 0.18)',
    actionButtonSecondaryBackground: 'rgba(99, 102, 241, 0.16)',
    closeButton: '#94a3b8',
    closeButtonBackground: 'rgba(148, 163, 184, 0.12)',
    connectButtonBackground: '#1e293b',
    connectButtonBackgroundError: '#ef4444',
    connectButtonInnerBackground: 'linear-gradient(135deg, #1e293b 0%, #312e81 100%)',
    connectButtonText: '#f8fafc',
    connectButtonTextError: '#ffffff',
    connectionIndicator: '#34d399',
    downloadBottomCardBackground:
      'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(49, 46, 129, 0.9) 100%)',
    downloadTopCardBackground:
      'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(79, 70, 229, 0.35) 100%)',
    error: '#f87171',
    generalBorder: 'rgba(148, 163, 184, 0.2)',
    generalBorderDim: 'rgba(148, 163, 184, 0.1)',
    menuItemBackground: 'rgba(99, 102, 241, 0.14)',
    modalBackdrop: 'rgba(2, 6, 23, 0.72)',
    modalBackground: '#0f172a',
    modalBorder: 'rgba(129, 140, 248, 0.28)',
    modalText: '#f1f5f9',
    modalTextDim: '#94a3b8',
    modalTextSecondary: '#cbd5e1',
    profileAction: 'rgba(30, 41, 59, 0.9)',
    profileActionHover: 'rgba(99, 102, 241, 0.2)',
    profileForeground: '#0f172a',
    selectedOptionBorder: 'rgba(129, 140, 248, 0.55)',
    standby: '#fbbf24',
  },
  shadows: {
    ...darkTheme().shadows,
    connectButton: '0 8px 24px rgba(15, 23, 42, 0.45)',
    dialog: '0 24px 64px rgba(2, 6, 23, 0.65)',
    profileDetailsAction: '0 4px 12px rgba(15, 23, 42, 0.35)',
    selectedOption: '0 0 0 1px rgba(129, 140, 248, 0.45)',
    selectedWallet: '0 0 0 1px rgba(99, 102, 241, 0.55)',
    walletLogo: '0 4px 14px rgba(15, 23, 42, 0.4)',
  },
};
