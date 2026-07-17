import { ARC_TESTNET_CHAIN_ID } from './chains/arcTestnet';
import { LINEA_SEPOLIA_CHAIN_ID } from './chains/lineaSepolia';
import { PAYMENT_CHAIN_IDS } from './paymentChains';
import { useChainConfigStore } from '../store/chainConfigStore';
import { config } from './wagmi';

/** Header 网络切换菜单展示项（id 须与 wagmi chains 一致） */
export type WalletUiNetwork = {
  id: number;
  /** i18n key under walletConnect.networks.* */
  nameKey: string;
  /** 是否允许切换；非支付链仅展示 */
  switchable?: boolean;
};

/**
 * 硬编码降级：仅业务支付链（须与 wagmi chains 一致）。
 * 「即将上线」主网等由后端 chain_config 下发展示，避免前端再挂未使用链触发 RPC。
 */
export const WALLET_UI_NETWORKS: WalletUiNetwork[] = [
  { id: LINEA_SEPOLIA_CHAIN_ID, nameKey: 'lineaSepolia', switchable: true },
  { id: ARC_TESTNET_CHAIN_ID, nameKey: 'arcTestnet', switchable: true },
  { id: 84532, nameKey: 'baseSepolia', switchable: true },
];

export type WalletUiNetworkItem = {
  id: number;
  name: string;
  switchable: boolean;
};

/**
 * 构建钱包导航链下拉列表
 * 优先使用后端 /api/common/chain_config（按 sort 排序）；未加载时降级硬编码 + i18n
 */
export function buildWalletUiNetworks(
  translate: (key: string) => string,
): WalletUiNetworkItem[] {
  const store = useChainConfigStore.getState();
  if (store.loaded && store.chains.length > 0) {
    return store.chains.map((chain) => ({
      id: Number(chain.chainId),
      name: chain.name,
      switchable: chain.status === 0,
    }));
  }

  return WALLET_UI_NETWORKS.map((network) => ({
    id: network.id,
    name: translate(`walletConnect.networks.${network.nameKey}`),
    switchable: network.switchable !== false,
  }));
}

export function isWalletNetworkSwitchable(chainId: number): boolean {
  const store = useChainConfigStore.getState();
  if (store.loaded) {
    const chain = store.getChainByChainId(chainId);
    if (chain) return chain.status === 0;
  }

  const item = WALLET_UI_NETWORKS.find((n) => n.id === chainId);
  if (item?.switchable === true) return true;
  if (item?.switchable === false) return false;
  return PAYMENT_CHAIN_IDS.includes(chainId);
}

/** 根据 wagmi chainId 解析导航栏当前应展示的链信息 */
export function resolveCurrentWalletNetwork(
  chainId: number | undefined,
  networks: WalletUiNetworkItem[],
): WalletUiNetworkItem {
  if (chainId != null) {
    const normalizedId = Number(chainId);
    const matched = networks.find((network) => Number(network.id) === normalizedId);
    if (matched) return matched;

    const fromStore = useChainConfigStore.getState().getChainByChainId(normalizedId);
    if (fromStore) {
      return {
        id: Number(fromStore.chainId),
        name: fromStore.name,
        switchable: fromStore.status === 0,
      };
    }

    const wagmiChain = config.chains.find((chain) => chain.id === normalizedId);
    if (wagmiChain) {
      return {
        id: wagmiChain.id,
        name: wagmiChain.name,
        switchable: isWalletNetworkSwitchable(wagmiChain.id),
      };
    }

    return {
      id: normalizedId,
      name: `Chain ${normalizedId}`,
      switchable: false,
    };
  }

  return networks[0] ?? { id: 0, name: '—', switchable: false };
}
