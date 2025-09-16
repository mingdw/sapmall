import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, arbitrum, optimism, sepolia, goerli, holesky } from 'wagmi/chains';
import { http } from 'wagmi';

// 创建Wagmi配置
export const config = getDefaultConfig({
  appName: 'Sapphire Mall',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
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
