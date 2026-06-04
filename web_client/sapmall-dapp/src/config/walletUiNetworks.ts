import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';
import { PAYMENT_CHAIN_IDS } from './paymentChains';

/** Header 网络切换菜单展示项（id 须与 wagmi chains 一致） */
export type WalletUiNetwork = {
  id: number;
  /** i18n key under walletConnect.networks.* */
  nameKey: string;
  /** 是否允许切换；非支付链仅展示 */
  switchable?: boolean;
};

export const WALLET_UI_NETWORKS: WalletUiNetwork[] = [
  { id: LINEA_SEPOLIA_CHAIN_ID, nameKey: 'lineaSepolia', switchable: true },
  { id: ARC_TESTNET_CHAIN_ID, nameKey: 'arcTestnet', switchable: true },
  { id: 84532, nameKey: 'baseSepolia', switchable: true },
  { id: 1, nameKey: 'ethereum', switchable: false },
  { id: 8453, nameKey: 'base', switchable: false },
  { id: 11155111, nameKey: 'sepolia', switchable: false },
  { id: 5, nameKey: 'goerli', switchable: false },
  { id: 17000, nameKey: 'holesky', switchable: false },
  { id: 56, nameKey: 'bsc', switchable: false },
  { id: 137, nameKey: 'polygon', switchable: false },
];

export function isWalletNetworkSwitchable(chainId: number): boolean {
  const item = WALLET_UI_NETWORKS.find((n) => n.id === chainId);
  if (item?.switchable === true) return true;
  if (item?.switchable === false) return false;
  return PAYMENT_CHAIN_IDS.includes(chainId);
}
