import {
  binanceWallet,
  bitgetWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  rainbowWallet,
  safeWallet,
  tokenPocketWallet,
  trustWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

/**
 * 常用钱包列表（需有效 WalletConnect Project ID）
 * Popular：桌面/移动端高频钱包；More：通用协议与硬件/多签
 */
export const popularWallets = [
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  coinbaseWallet,
  rainbowWallet,
  trustWallet,
  tokenPocketWallet,
  bitgetWallet,
  binanceWallet,
];

export const moreWallets = [
  walletConnectWallet,
  injectedWallet,
  ledgerWallet,
  safeWallet,
];

export const recommendedWalletGroups = [
  {
    groupName: 'Popular',
    wallets: popularWallets,
  },
  {
    groupName: 'More',
    wallets: moreWallets,
  },
];

/** 无 Project ID 时仅展示浏览器已注入扩展 */
export const injectedOnlyWalletGroups = [
  {
    groupName: 'Installed',
    wallets: [injectedWallet],
  },
];
