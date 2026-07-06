/** 官网外链与 DApp 入口配置 */
const dappBase = process.env.REACT_APP_DAPP_URL || 'http://localhost:7102';

export const siteLinks = {
  dappUrl: dappBase,
  dappMarketplace: `${dappBase.replace(/\/$/, '')}/marketplace`,
  dappHelp: `${dappBase.replace(/\/$/, '')}${process.env.REACT_APP_HELP_PATH || '/help'}`,
  whitepaper: process.env.REACT_APP_WHITEPAPER_URL || 'https://github.com',
  demo: process.env.REACT_APP_DEMO_URL || 'https://www.youtube.com',
  github: process.env.REACT_APP_GITHUB_URL || 'https://github.com',
  twitter: process.env.REACT_APP_TWITTER_URL || 'https://twitter.com',
  telegram: process.env.REACT_APP_TELEGRAM_URL || 'https://t.me',
  discord: process.env.REACT_APP_DISCORD_URL || 'https://discord.com',
  audit: process.env.REACT_APP_AUDIT_URL || 'https://github.com',
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
} as const;

/** 支付网络：active=true 可切换支付；false 为待加入（仅展示） */
export type PaymentNetwork = {
  id: number;
  name: string;
  tokens: readonly string[];
  active: boolean;
};

/** 与 DApp walletUiNetworks / 后端 sys_chain_network 保持一致 */
export const paymentNetworks: readonly PaymentNetwork[] = [
  { id: 59141, name: 'Linea Sepolia', tokens: ['SAP', 'USDC'], active: true },
  { id: 5042002, name: 'Arc Testnet', tokens: ['SAP', 'USDC', 'EURC', 'cirBTC'], active: true },
  { id: 84532, name: 'Base Sepolia', tokens: ['SAP', 'USDC'], active: true },
  { id: 1, name: 'Ethereum', tokens: [], active: false },
  { id: 8453, name: 'Base', tokens: [], active: false },
  { id: 11155111, name: 'Sepolia', tokens: [], active: false },
  { id: 56, name: 'BSC', tokens: [], active: false },
  { id: 137, name: 'Polygon', tokens: [], active: false },
] as const;

/** @deprecated 使用 paymentNetworks */
export const supportedChains = paymentNetworks
  .filter((n) => n.active)
  .map((n) => ({ name: n.name, id: n.id }));

/** @deprecated 使用 paymentNetworks 按链联动 */
export const supportedTokens = ['USDC', 'SAP', 'EURC', 'cirBTC'] as const;
