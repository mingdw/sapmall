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
    '已禁用 MetaMask SDK / WalletConnect 连接器，请使用弹窗「已安装」中的 MetaMask（浏览器扩展直连）。' +
    '配置 REACT_APP_WALLETCONNECT_PROJECT_ID 后可恢复完整钱包列表。' +
    '获取地址：https://cloud.walletconnect.com'
  );
}

/**
 * 无效 projectId 时若仍使用默认 metaMaskWallet，会走 MetaMask SDK + WalletConnect，
 * 弹窗会一直停在「正在打开 MetaMask…」且扩展内无确认框。
 */
const walletList = hasValidWalletConnectProjectId
  ? [
      {
        groupName: 'Recommended',
        wallets: [injectedWallet, metaMaskWallet, walletConnectWallet],
      },
    ]
  : [
      {
        groupName: 'Recommended',
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
