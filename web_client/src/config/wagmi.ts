import { http, createConfig } from 'wagmi'
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains'
import { walletConnect, injected, coinbaseWallet } from 'wagmi/connectors'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'

// 只在客户端创建配置
const createWagmiConfig = () => {
  if (typeof window === 'undefined') {
    // 服务端返回空配置
    return createConfig({
      chains: [mainnet],
      connectors: [],
      transports: {
        [mainnet.id]: http(),
      },
    })
  }

  return createConfig({
    chains: [mainnet, sepolia, polygon, polygonMumbai],
    connectors: [
      injected(),
      walletConnect({ projectId }),
      coinbaseWallet({ appName: 'Sapphire Mall' }),
    ],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
      [polygon.id]: http(),
      [polygonMumbai.id]: http(),
    },
  })
}

export const config = createWagmiConfig() 