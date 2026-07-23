import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { fallback, http, type Transport } from 'wagmi';
import {
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  sepolia,
  unichainSepolia,
  worldchainSepolia,
} from 'wagmi/chains';
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
 * 支付链 + CCTP 跨入 Arc 的源链（需在 wagmi 中注册才能 switchChain / 读余额）
 * 目的链固定 Arc Testnet。
 */
const paymentChains = [
  sepolia,
  arbitrumSepolia,
  avalancheFuji,
  baseSepolia,
  optimismSepolia,
  polygonAmoy,
  lineaSepolia,
  unichainSepolia,
  worldchainSepolia,
  arcTestnet,
] as const;

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
    [sepolia.id]: http(undefined, rpcHttpOptions),
    [arbitrumSepolia.id]: http(undefined, rpcHttpOptions),
    [avalancheFuji.id]: http(undefined, rpcHttpOptions),
    [baseSepolia.id]: createRpcTransport(BASE_SEPOLIA_RPC_URL),
    [optimismSepolia.id]: createRpcTransport('https://sepolia.optimism.io'),
    // Amoy 官方公共节点常不稳定，加 fallback 避免拖慢源链余额
    [polygonAmoy.id]: fallback(
      [
        http('https://rpc-amoy.polygon.technology', rpcHttpOptions),
        http('https://polygon-amoy-bor-rpc.publicnode.com', rpcHttpOptions),
      ],
      { rank: false },
    ),
    [lineaSepolia.id]: createRpcTransport(LINEA_SEPOLIA_RPC_URL),
    [unichainSepolia.id]: createRpcTransport('https://sepolia.unichain.org'),
    [worldchainSepolia.id]: fallback(
      [
        http('https://worldchain-sepolia.g.alchemy.com/public', rpcHttpOptions),
        http('https://worldchain-sepolia.gateway.tenderly.co', rpcHttpOptions),
      ],
      { rank: false },
    ),
    [arcTestnet.id]: createArcTestnetTransport(),
  },
  ssr: false,
  // 降低多链区块/余额默认同步频率（毫秒）
  pollingInterval: 12_000,
});

export const chains = config.chains;
