import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<div>Loading...</div>}>
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-center mb-8">
              Welcome to Sapphire Mall
            </h1>
            <p className="text-center text-muted-foreground">
              Web3虚拟商品交易平台正在建设中...
            </p>
          </div>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
} 