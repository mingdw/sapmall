import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, bsc, arbitrum, optimism } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'Sapphire Mall',
  projectId: process.env.REACT_APP_WALLETCONNECT_PROJECT_ID || '',
  chains: [mainnet, polygon, bsc, arbitrum, optimism],
  ssr: false, // 如果您的dApp使用服务器端渲染(SSR)
});
