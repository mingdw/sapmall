import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import arcIcon from '../assets/chains/arc.svg';

/** Trust Wallet Assets CDN — https://github.com/trustwallet/assets */
const trustWalletChainLogo = (folder: string) =>
  `https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/${folder}/info/logo.png`;

/**
 * 导航栏 / 网络切换使用的链图标（chainId → 图片 URL）
 * 测试网与主网同系列链共用主网品牌图标（行业常见做法）
 */
export const CHAIN_ICON_BY_ID: Record<number, string> = {
  1: trustWalletChainLogo('ethereum'),
  8453: trustWalletChainLogo('base'),
  [ARC_TESTNET_CHAIN_ID]: arcIcon,
  11155111: trustWalletChainLogo('ethereum'),
  5: trustWalletChainLogo('ethereum'),
  17000: trustWalletChainLogo('ethereum'),
  56: trustWalletChainLogo('smartchain'),
  137: trustWalletChainLogo('polygon'),
  42161: trustWalletChainLogo('arbitrum'),
  10: trustWalletChainLogo('optimism'),
};

/** 图标加载失败时的单字缩写 */
export const CHAIN_ICON_FALLBACK_LETTER: Record<number, string> = {
  1: 'E',
  8453: 'B',
  [ARC_TESTNET_CHAIN_ID]: 'A',
  11155111: 'S',
  5: 'G',
  17000: 'H',
  56: 'B',
  137: 'P',
};

export function getChainIconUrl(chainId: number): string | undefined {
  return CHAIN_ICON_BY_ID[chainId];
}

export function getChainIconFallbackLetter(chainId: number): string {
  return CHAIN_ICON_FALLBACK_LETTER[chainId] ?? '?';
}
