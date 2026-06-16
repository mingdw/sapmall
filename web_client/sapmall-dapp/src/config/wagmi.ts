import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { http } from 'wagmi';
import {
  mainnet,
  polygon,
  bsc,
  arbitrum,
  optimism,
  sepolia,
  goerli,
  holesky,
  base,
  baseSepolia,
} from 'wagmi/chains';
import { arcTestnet, ARC_TESTNET_RPC_URL } from './chains/arcTestnet';
import { lineaSepolia, LINEA_SEPOLIA_RPC_URL } from './chains/lineaSepolia';

// 获取 WalletConnect Project ID
// RainbowKit v2 要求 projectId 非空，否则会在初始化时报错。
// 这里提供一个开发兜底值，避免应用直接崩溃；如需真正使用 WalletConnect，
// 仍需在环境变量中配置你自己的 Project ID。
const PLACEHOLDER_WC_PROJECT_ID = 'sapmall-dev-placeholder-project-id';

const walletConnectProjectId =
  process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || PLACEHOLDER_WC_PROJECT_ID;

const hasValidWalletConnectProjectId =
  walletConnectProjectId.length > 0 &&
  walletConnectProjectId !== PLACEHOLDER_WC_PROJECT_ID;

// 如果未设置 Project ID，在开发环境给出警告
if (!hasValidWalletConnectProjectId && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ WalletConnect Project ID 未设置。' +
    'MetaMask SDK 依赖 WalletConnect 中继，未配置将无法唤起锁定钱包。' +
    '请在 .env.local 中配置 REACT_APP_WALLETCONNECT_PROJECT_ID。' +
    '获取地址：https://cloud.walletconnect.com'
  );
}

/**
 * 钱包连接策略：
 *
 * 有效 WalletConnect Project ID：
 *   - metaMaskWallet：使用 MetaMask SDK，无论 MetaMask 是否锁定/未登录都能唤起弹窗
 *   - walletConnectWallet：通用 WalletConnect 协议，支持移动端钱包
 *   首次连接需通过 WalletConnect 中继建立信道（3-10秒），后续复用 session 秒连。
 *
 * 无有效 Project ID（开发兜底）：
 *   - injectedWallet：直连浏览器扩展，速度快但 MetaMask 锁定时无法唤起
 */
const walletList = hasValidWalletConnectProjectId
  ? [
      {
        groupName: 'Recommended',
        wallets: [metaMaskWallet, walletConnectWallet],
      },
    ]
  : [
      {
        groupName: 'Installed',
        wallets: [injectedWallet],
      },
    ];

export const config = getDefaultConfig({
  appName: 'Sapphire Mall',
  projectId: walletConnectProjectId,
  wallets: walletList,
  chains: [
    lineaSepolia,
    arcTestnet,
    baseSepolia,
    mainnet,
    base,
    sepolia,
    goerli,
    holesky,
    polygon,
    bsc,
    arbitrum,
    optimism,
  ],
  transports: {
    [lineaSepolia.id]: http(LINEA_SEPOLIA_RPC_URL),
    [mainnet.id]: http(),
    [base.id]: http(),
    [baseSepolia.id]: http(),
    [arcTestnet.id]: http(ARC_TESTNET_RPC_URL),
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [holesky.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
  ssr: false,
});

export const chains = config.chains;
