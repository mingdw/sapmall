import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, arbitrum, optimism, sepolia, goerli, holesky } from 'wagmi/chains';
import { http } from 'wagmi';

// 获取 WalletConnect Project ID（可选，主要用于 WalletConnect 钱包）
// 如果没有设置，MetaMask 等注入式钱包仍然可以正常工作
const walletConnectProjectId = process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '';

// 如果未设置 Project ID，在开发环境给出警告
if (!walletConnectProjectId && process.env.NODE_ENV === 'development') {
  console.warn(
    '⚠️ WalletConnect Project ID 未设置。' +
    'MetaMask 等注入式钱包可以正常使用，但 WalletConnect 钱包可能无法连接。' +
    '如需使用 WalletConnect，请访问 https://cloud.walletconnect.com 获取 Project ID 并设置 REACT_APP_WALLETCONNECT_PROJECT_ID 环境变量。'
  );
}

// 创建Wagmi配置
export const config = getDefaultConfig({
  appName: 'Sapphire Mall',
  projectId: walletConnectProjectId,
  chains: [mainnet, sepolia, goerli, holesky, polygon, bsc, arbitrum, optimism],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [goerli.id]: http(),
    [holesky.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
    [arbitrum.id]: http(),
    [optimism.id]: http(),
  },
  ssr: false, // 如果您的dApp使用服务器端渲染(SSR)
});
