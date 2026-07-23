import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import arcIcon from '../assets/chains/arc.svg';

/** Trust Wallet Assets CDN — https://github.com/trustwallet/assets */
const trustWalletChainLogo = (folder: string) =>
  `https://cdn.jsdelivr.net/gh/trustwallet/assets@master/blockchains/${folder}/info/logo.png`;

/**
 * 导航栏 / CCTP 源链下拉使用的链图标（chainId → 图片 URL）
 * 测试网与主网同系列链共用主网品牌图标（行业常见做法；Circle Faucet 同类）
 */
export const CHAIN_ICON_BY_ID: Record<number, string> = {
  // Ethereum / Sepolia
  1: trustWalletChainLogo('ethereum'),
  11155111: trustWalletChainLogo('ethereum'),
  5: trustWalletChainLogo('ethereum'),
  17000: trustWalletChainLogo('ethereum'),
  // Base
  8453: trustWalletChainLogo('base'),
  84532: trustWalletChainLogo('base'),
  // Arbitrum
  42161: trustWalletChainLogo('arbitrum'),
  421614: trustWalletChainLogo('arbitrum'),
  // Avalanche
  43114: trustWalletChainLogo('avalanchec'),
  43113: trustWalletChainLogo('avalanchec'),
  // Optimism
  10: trustWalletChainLogo('optimism'),
  11155420: trustWalletChainLogo('optimism'),
  // Polygon
  137: trustWalletChainLogo('polygon'),
  80002: trustWalletChainLogo('polygon'),
  // Linea
  59144: trustWalletChainLogo('linea'),
  59141: trustWalletChainLogo('linea'),
  // Unichain（暂无独立 logo 时回退 ethereum 风格色块由 fallback 处理，优先尝试 unichain）
  130: trustWalletChainLogo('ethereum'),
  1301: trustWalletChainLogo('ethereum'),
  // World Chain
  480: trustWalletChainLogo('ethereum'),
  4801: trustWalletChainLogo('ethereum'),
  // Arc
  [ARC_TESTNET_CHAIN_ID]: arcIcon,
  // 其它
  56: trustWalletChainLogo('smartchain'),
};

/** 图标加载失败时的单字缩写 */
export const CHAIN_ICON_FALLBACK_LETTER: Record<number, string> = {
  1: 'E',
  11155111: 'E',
  5: 'G',
  17000: 'H',
  8453: 'B',
  84532: 'B',
  42161: 'A',
  421614: 'A',
  43114: 'A',
  43113: 'A',
  10: 'O',
  11155420: 'O',
  137: 'P',
  80002: 'P',
  59144: 'L',
  59141: 'L',
  130: 'U',
  1301: 'U',
  480: 'W',
  4801: 'W',
  [ARC_TESTNET_CHAIN_ID]: 'A',
  56: 'B',
};

export function getChainIconUrl(chainId: number): string | undefined {
  return CHAIN_ICON_BY_ID[chainId];
}

export function getChainIconFallbackLetter(chainId: number): string {
  return CHAIN_ICON_FALLBACK_LETTER[chainId] ?? '?';
}
