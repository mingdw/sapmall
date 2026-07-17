import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fallback, http, type Transport } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { arcTestnet, ARC_TESTNET_RPC_URLS } from './chains/arcTestnet';
import { lineaSepolia, LINEA_SEPOLIA_RPC_URL } from './chains/lineaSepolia';
import {
  injectedOnlyWalletGroups,
  recommendedWalletGroups,
} from './walletConnectors';

/** Base Sepolia 官方公共 RPC（勿用无 CORS 的默认公共节点） */
export const BASE_SEPOLIA_RPC_URL = 'https://sepolia.base.org';

// RainbowKit v2 要求 projectId 非空；生产仍须配置真实 Project ID
const PLACEHOLDER_WC_PROJECT_ID = 'sapmall-dev-placeholder-project-id';

const walletConnectProjectId =
  process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || PLACEHOLDER_WC_PROJECT_ID;

const hasValidWalletConnectProjectId =
  walletConnectProjectId.length > 0 &&
  walletConnectProjectId !== PLACEHOLDER_WC_PROJECT_ID;

if (!hasValidWalletConnectProjectId && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ WalletConnect Project ID 未设置。' +
      'MetaMask SDK 依赖 WalletConnect 中继，未配置将无法唤起锁定钱包。' +
      '请在 .env.local 中配置 REACT_APP_WALLETCONNECT_PROJECT_ID。' +
      '获取地址：https://cloud.walletconnect.com'
  );
}

/**
 * 仅保留业务支付链，避免 wagmi 对 mainnet 等无关链请求公共 RPC（CORS / 无效请求刷屏）。
 * 展示用「即将上线」网络仍可由 walletUiNetworks / 后端 chain_config 渲染，无需挂进 wagmi。
 */
const paymentChains = [lineaSepolia, arcTestnet, baseSepolia] as const;

const rpcHttpOptions = {
  batch: true,
  retryCount: 1,
  retryDelay: 1_500,
  timeout: 20_000,
} as const;

/** 单节点 HTTP transport */
function createRpcTransport(url: string): Transport {
  return http(url, rpcHttpOptions);
}

/**
 * Arc Testnet：按官方节点列表做 fallback
 * @see https://docs.arc.io/arc/references/rpc-endpoints
 */
function createArcTestnetTransport(): Transport {
  return fallback(
    ARC_TESTNET_RPC_URLS.map((url) => http(url, rpcHttpOptions)),
    { rank: false },
  );
}

const walletList = hasValidWalletConnectProjectId
  ? recommendedWalletGroups
  : injectedOnlyWalletGroups;

export const config = getDefaultConfig({
  appName: 'Sapphire Mall',
  projectId: walletConnectProjectId,
  wallets: walletList,
  chains: paymentChains,
  transports: {
    [lineaSepolia.id]: createRpcTransport(LINEA_SEPOLIA_RPC_URL),
    [arcTestnet.id]: createArcTestnetTransport(),
    [baseSepolia.id]: createRpcTransport(BASE_SEPOLIA_RPC_URL),
  },
  ssr: false,
  // 降低多链区块/余额默认同步频率（毫秒）
  pollingInterval: 12_000,
});

export const chains = config.chains;
