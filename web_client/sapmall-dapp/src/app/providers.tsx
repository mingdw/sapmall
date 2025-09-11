'use client'

import { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/config/wagmi'
import { ThemeProvider } from 'next-themes'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/i18n/config'
import dynamic from 'next/dynamic'

// 动态导入Web3Modal，避免SSR问题
const Web3Modal = dynamic(
  () => import('@web3modal/react').then((mod) => ({ default: mod.Web3Modal })),
  { ssr: false }
)

const queryClient = new QueryClient()

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <I18nextProvider i18n={i18n}>
            {children}
            <Web3Modal
              projectId={process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id'}
            />
          </I18nextProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 