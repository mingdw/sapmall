import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';

/** Header 网络切换菜单展示项（id 须与 wagmi chains 一致） */
export type WalletUiNetwork = {
  id: number;
  /** i18n key under walletConnect.networks.* */
  nameKey: string;
};

export const WALLET_UI_NETWORKS: WalletUiNetwork[] = [
  { id: ARC_TESTNET_CHAIN_ID, nameKey: 'arcTestnet' },
  { id: 1, nameKey: 'ethereum' },
  { id: 8453, nameKey: 'base' },
  { id: 11155111, nameKey: 'sepolia' },
  { id: 5, nameKey: 'goerli' },
  { id: 17000, nameKey: 'holesky' },
  { id: 56, nameKey: 'bsc' },
  { id: 137, nameKey: 'polygon' },
];
