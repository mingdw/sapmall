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

/** status=0 启用可切换；须同时在 wagmi 中注册才能真正 switchChain */
function isChainSwitchableByStatus(status: unknown, chainId: number): boolean {
  if (Number(status) !== 0) return false;
  return config.chains.some((c) => c.id === Number(chainId));
}

/**
 * 构建钱包导航链下拉列表
 * 优先使用后端 /api/common/chain_config（按 sort 升序）；未加载时降级硬编码 + i18n
 * switchable 对应 sys_chain_network.status：0 启用 / 1 仅展示
 */
export function buildWalletUiNetworks(
  translate: (key: string) => string,
): WalletUiNetworkItem[] {
  const store = useChainConfigStore.getState();
  if (store.loaded && store.chains.length > 0) {
    return [...store.chains]
      .sort((a, b) => Number(a.sort) - Number(b.sort) || Number(a.chainId) - Number(b.chainId))
      .map((chain) => {
        const id = Number(chain.chainId);
        return {
          id,
          name: chain.name,
          switchable: isChainSwitchableByStatus(chain.status, id),
        };
      });
  }

  return WALLET_UI_NETWORKS.map((network) => ({
    id: network.id,
    name: translate(`walletConnect.networks.${network.nameKey}`),
    switchable: network.switchable !== false,
  }));
}

export function isWalletNetworkSwitchable(chainId: number): boolean {
  const normalizedId = Number(chainId);
  const store = useChainConfigStore.getState();
  if (store.loaded) {
    const chain = store.getChainByChainId(normalizedId);
    if (chain) return isChainSwitchableByStatus(chain.status, normalizedId);
  }

  const item = WALLET_UI_NETWORKS.find((n) => n.id === normalizedId);
  if (item?.switchable === true) return true;
  if (item?.switchable === false) return false;
  return PAYMENT_CHAIN_IDS.includes(normalizedId);
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
        switchable: isChainSwitchableByStatus(fromStore.status, normalizedId),
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
