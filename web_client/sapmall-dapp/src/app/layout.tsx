import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sapphire Mall - Web3虚拟商品交易平台',
  description: 'Sapphire Mall是一个基于Web3技术的虚拟商品交易平台，支持NFT交易、质押收益和DAO治理功能。',
  keywords: 'Web3, NFT, 虚拟商品, 交易平台, 区块链, 质押, DAO',
  authors: [{ name: 'Sapphire Mall Team' }],
  creator: 'Sapphire Mall',
  publisher: 'Sapphire Mall',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://sapphiremall.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sapphire Mall - Web3虚拟商品交易平台',
    description: 'Sapphire Mall是一个基于Web3技术的虚拟商品交易平台，支持NFT交易、质押收益和DAO治理功能。',
    url: 'https://sapphiremall.com',
    siteName: 'Sapphire Mall',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Sapphire Mall',
      },
    ],
    locale: 'zh_CN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sapphire Mall - Web3虚拟商品交易平台',
    description: 'Sapphire Mall是一个基于Web3技术的虚拟商品交易平台，支持NFT交易、质押收益和DAO治理功能。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 