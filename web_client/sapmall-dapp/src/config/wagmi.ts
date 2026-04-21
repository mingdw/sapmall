import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'wagmi';
import { mainnet, polygon, bsc, arbitrum, optimism, sepolia, goerli, holesky, base } from 'wagmi/chains';

// 获取 WalletConnect Project ID
// RainbowKit v2 要求 projectId 非空，否则会在初始化时报错。
// 这里提供一个开发兜底值，避免应用直接崩溃；如需真正使用 WalletConnect，
// 仍需在环境变量中配置你自己的 Project ID。
const walletConnectProjectId =
  process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || 'sapmall-dev-placeholder-project-id';

// 如果未设置 Project ID，在开发环境给出警告
if (
  walletConnectProjectId === 'sapmall-dev-placeholder-project-id' &&
  process.env.NODE_ENV === 'development'
) {
  console.warn(
    '⚠️ WalletConnect Project ID 未设置。' +
    '当前使用占位 projectId 仅用于避免初始化报错；MetaMask 等注入式钱包可以正常使用，WalletConnect 可能无法连接。' +
    '如需使用 WalletConnect，请访问 https://cloud.walletconnect.com 获取 Project ID 并设置 REACT_APP_WALLETCONNECT_PROJECT_ID 环境变量。'
  );
}

export const config = getDefaultConfig({
  appName: 'Sapphire Mall',
  projectId: walletConnectProjectId,
  chains: [mainnet, base, sepolia, goerli, holesky, polygon, bsc, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
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
